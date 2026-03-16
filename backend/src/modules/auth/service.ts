import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import pool from '../../db/pool';
import { AppError } from '../credits/errors';
import { config } from '../../config/index';
import { CreditsService } from '../credits/service';
import { ReferralService } from '../referrals/service';
import { TokenHelpers } from './tokens';
import { RegisterData, LoginData, ForgotPasswordData, ChangePasswordData } from './schemas';
import { EmailService } from '../../lib/email';

/**
 * Helper to execute a query silently.
 * Used for "fire and forget" operations like sending emails.
 */
const fireAndForget = (promise: Promise<any>) => {
    promise.catch(err => console.error('Background task failed:', err));
};

/** Transform a raw DB user row to a camelCase frontend-safe object */
function sanitizeUser(dbUser: any) {
    return {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        avatarUrl: dbUser.avatar_url,
        role: dbUser.role,
        isEmailVerified: dbUser.is_email_verified,
        lastLoginAt: dbUser.last_login_at,
        createdAt: dbUser.created_at,
        updatedAt: dbUser.updated_at,
    };
}

export const AuthService = {
    async register(data: RegisterData, ip: string, userAgent: string) {
        const { email, password, firstName, lastName, referralCode } = data;

        // 1. Check if user exists
        const existingResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingResult.rowCount && existingResult.rowCount > 0) {
            throw new AppError(409, 'EMAIL_TAKEN', 'Email is already in use');
        }

        // 2. Hash password
        const passwordHash = await bcryptjs.hash(password, config.BCRYPT_ROUNDS);

        // 3. User creation Transaction
        const client = await pool.connect();
        let newUser;
        try {
            await client.query('BEGIN');

            const userRes = await client.query(
                `INSERT INTO users (email, password_hash, first_name, last_name, is_email_verified) 
         VALUES ($1, $2, $3, $4, false) RETURNING *`,
                [email, passwordHash, firstName, lastName]
            );
            newUser = userRes.rows[0];

            // Grant 100 credits atomically
            await CreditsService.grantSignupBonus(newUser.id, client);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        // 4. Generate referral code for the new user
        const newReferralCode = ReferralService.generateReferralCode();
        await pool.query(
            'UPDATE users SET referral_code = $1 WHERE id = $2',
            [newReferralCode, newUser.id]
        );

        // 5. If user signed up with a referral code, link the referral
        if (referralCode) {
            await ReferralService.processReferral(newUser.id, referralCode);
        }
        // Do NOT call rewardReferral here — email is not yet verified

        if (config.NODE_ENV === 'development') {
            // DEV MODE: Auto-verify email (SMTP is often blocked on local networks)
            await pool.query(
                `UPDATE users SET is_email_verified = true WHERE id = $1`,
                [newUser.id]
            );
            await ReferralService.rewardReferral(newUser.id);
            console.log(`[DEV] Auto-verified email for ${email}`);
        } else {
            // PRODUCTION: Generate email verification token and send verification email
            const token = crypto.randomBytes(32).toString('hex');
            const tokenHash = TokenHelpers.hashToken(token);
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

            await pool.query(
                `UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3`,
                [tokenHash, expiresAt, newUser.id]
            );

            const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
            fireAndForget(EmailService.sendVerificationEmail(email, firstName, verificationUrl));
        }

        // Return sanitized user
        const { password_hash, email_verification_token, email_verification_expires, reset_password_token, reset_password_expires, ...sanitizedUser } = newUser;
        return sanitizedUser;
    },

    async login(data: LoginData, ip: string, userAgent: string) {
        const { email, password } = data;

        const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userRes.rows[0];

        // Dummy hash to prevent timing attacks if user not found
        const dummyHash = '$2a$12$4L.XzQXVQ/tq.sD5XU75M.C4W27d2B/x2OQ8Y7NtjQZ2I3r0P5Q.O';
        const hashToCompare = user ? user.password_hash : dummyHash;

        const isMatch = await bcryptjs.compare(password, hashToCompare);

        if (!user) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }

        if (user.locked_until && new Date(user.locked_until) > new Date()) {
            throw new AppError(423, 'ACCOUNT_LOCKED', `Account is locked until ${user.locked_until}`);
        }

        if (!isMatch) {
            const attempts = (user.failed_login_attempts || 0) + 1;
            if (attempts >= 5) {
                const lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
                await pool.query('UPDATE users SET failed_login_attempts = $1, locked_until = $2 WHERE id = $3', [attempts, lockedUntil, user.id]);
                throw new AppError(423, 'ACCOUNT_LOCKED', 'Too many failed attempts. Account locked for 15 minutes.');
            }
            await pool.query('UPDATE users SET failed_login_attempts = $1 WHERE id = $2', [attempts, user.id]);
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
        }

        if (!user.is_email_verified) {
            throw new AppError(403, 'EMAIL_NOT_VERIFIED', 'Please verify your email address to log in');
        }

        // Success login -> Clear attempts
        await pool.query('UPDATE users SET failed_login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = $1', [user.id]);

        // Tokens
        const accessToken = TokenHelpers.generateAccessToken({ id: user.id, email: user.email, role: user.role });
        const refreshToken = TokenHelpers.generateRefreshToken();
        const refreshHash = TokenHelpers.hashToken(refreshToken);
        const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await pool.query(
            `INSERT INTO sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at) 
       VALUES ($1, $2, $3, $4, $5)`,
            [user.id, refreshHash, ip, userAgent, sessionExpiresAt]
        );

        const balance = await CreditsService.getBalance(user.id);

        return { user: sanitizeUser(user), accessToken, refreshToken, credits: { balance } };
    },

    async refreshTokens(rawRefreshToken: string, ip: string, userAgent: string) {
        const hash = TokenHelpers.hashToken(rawRefreshToken);

        const sessionRes = await pool.query('SELECT * FROM sessions WHERE refresh_token_hash = $1', [hash]);
        const session = sessionRes.rows[0];

        if (!session) {
            // Possible reuse attack (decode token to find user manually would be needed if token was stateless, but here we can't reliably map a raw token hash back without the DB. 
            // If we don't know the user from the token, we just throw 401. 
            // Note: If you stored user_id inside refreshToken, you could decode it and logoutAll.
            throw new AppError(401, 'TOKEN_REUSE', 'Invalid refresh token');
        }

        const { user_id, expires_at } = session;

        if (new Date(expires_at) < new Date()) {
            await pool.query('DELETE FROM sessions WHERE id = $1', [session.id]);
            throw new AppError(401, 'SESSION_EXPIRED', 'Your session has expired. Please log in again.');
        }

        const userRes = await pool.query('SELECT role, email FROM users WHERE id = $1', [user_id]);
        if (userRes.rowCount === 0) {
            throw new AppError(401, 'INVALID_USER', 'User no longer exists');
        }

        // ROTATE
        await pool.query('DELETE FROM sessions WHERE id = $1', [session.id]);

        const user = userRes.rows[0];
        const newAccessToken = TokenHelpers.generateAccessToken({ id: user_id, email: user.email, role: user.role });
        const newRefreshToken = TokenHelpers.generateRefreshToken();
        const newRefreshHash = TokenHelpers.hashToken(newRefreshToken);
        const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await pool.query(
            `INSERT INTO sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at) 
       VALUES ($1, $2, $3, $4, $5)`,
            [user_id, newRefreshHash, ip, userAgent, newExpiresAt]
        );

        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    },

    async logout(rawRefreshToken: string) {
        const hash = TokenHelpers.hashToken(rawRefreshToken);
        await pool.query('DELETE FROM sessions WHERE refresh_token_hash = $1', [hash]);
    },

    async logoutAll(userId: string) {
        await pool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
    },

    async verifyEmail(rawToken: string) {
        const hash = TokenHelpers.hashToken(rawToken);

        console.log('[verifyEmail] rawToken:', rawToken);
        console.log('[verifyEmail] computed hash:', hash);

        const res = await pool.query(
            'SELECT id FROM users WHERE email_verification_token = $1 AND email_verification_expires > NOW()',
            [hash]
        );

        if (res.rowCount === 0) {
            // Debug: check if token exists but is expired
            const debugRes = await pool.query(
                'SELECT id, email_verification_token, email_verification_expires FROM users WHERE email_verification_token = $1',
                [hash]
            );
            if (debugRes.rowCount && debugRes.rowCount > 0) {
                const dbRow = debugRes.rows[0];
                console.log('[verifyEmail] Token found but EXPIRED. expires_at:', dbRow.email_verification_expires, 'NOW:', new Date());
            } else {
                // Check if any user has a token at all (raw token stored instead of hash?)
                const rawCheck = await pool.query(
                    'SELECT id, email_verification_token FROM users WHERE email_verification_token = $1',
                    [rawToken]
                );
                if (rawCheck.rowCount && rawCheck.rowCount > 0) {
                    console.log('[verifyEmail] BUG: Raw token is stored in DB instead of hash!');
                } else {
                    console.log('[verifyEmail] No matching token found in DB at all');
                }
            }
            throw new AppError(400, 'INVALID_OR_EXPIRED_TOKEN', 'Verification token is invalid or has expired');
        }

        const user = res.rows[0];
        await pool.query(
            `UPDATE users SET is_email_verified = true, email_verification_token = NULL, email_verification_expires = NULL WHERE id = $1`,
            [user.id]
        );

        // Reward referral now that email is verified (guards internally)
        await ReferralService.rewardReferral(user.id);

        // Send welcome email
        const userRes = await pool.query('SELECT email, first_name FROM users WHERE id = $1', [user.id]);
        if (userRes.rows[0]) {
            fireAndForget(EmailService.sendWelcomeEmail(userRes.rows[0].email, userRes.rows[0].first_name));
        }
    },

    async forgotPassword(data: ForgotPasswordData) {
        const { email } = data;
        const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        // Always return success to prevent email enumeration
        if (userRes.rowCount === 0) return true;

        const user = userRes.rows[0];
        const token = crypto.randomBytes(32).toString('hex');
        const hash = TokenHelpers.hashToken(token);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await pool.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
            [hash, expiresAt, user.id]
        );

        const userDetails = await pool.query('SELECT first_name FROM users WHERE id = $1', [user.id]);
        const resetUrl = `${config.FRONTEND_URL}/reset-password?token=${token}`;
        fireAndForget(EmailService.sendPasswordResetEmail(email, userDetails.rows[0]?.first_name || '', resetUrl));
        return true;
    },

    async resetPassword(rawToken: string, newPassword: string) {
        const hash = TokenHelpers.hashToken(rawToken);

        const userRes = await pool.query(
            'SELECT id FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
            [hash]
        );

        if (userRes.rowCount === 0) {
            throw new AppError(400, 'INVALID_OR_EXPIRED_TOKEN', 'Reset token is invalid or has expired');
        }

        const user = userRes.rows[0];
        const passwordHash = await bcryptjs.hash(newPassword, config.BCRYPT_ROUNDS);

        await pool.query(
            `UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2`,
            [passwordHash, user.id]
        );

        await this.logoutAll(user.id);

        const userDetails = await pool.query('SELECT email, first_name FROM users WHERE id = $1', [user.id]);
        if (userDetails.rows[0]) {
            fireAndForget(EmailService.sendPasswordChangedEmail(userDetails.rows[0].email, userDetails.rows[0].first_name));
        }
    },

    async changePassword(userId: string, data: ChangePasswordData) {
        const { currentPassword, newPassword } = data;

        const userRes = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
        if (userRes.rowCount === 0) {
            throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
        }

        const user = userRes.rows[0];
        const isMatch = await bcryptjs.compare(currentPassword, user.password_hash);

        if (!isMatch) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Incorrect current password');
        }

        const passwordHash = await bcryptjs.hash(newPassword, config.BCRYPT_ROUNDS);
        await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);

        await this.logoutAll(userId);

        const userDetails = await pool.query('SELECT email, first_name FROM users WHERE id = $1', [userId]);
        if (userDetails.rows[0]) {
            fireAndForget(EmailService.sendPasswordChangedEmail(userDetails.rows[0].email, userDetails.rows[0].first_name));
        }
    },

    async resendVerification(email: string) {
        const userRes = await pool.query(
            'SELECT id, first_name, is_email_verified FROM users WHERE email = $1',
            [email]
        );

        // Always return success to prevent email enumeration
        if (userRes.rowCount === 0) return true;

        const user = userRes.rows[0];

        if (user.is_email_verified) {
            throw new AppError(400, 'ALREADY_VERIFIED', 'Email is already verified');
        }

        // Generate a new verification token
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = TokenHelpers.hashToken(token);
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        await pool.query(
            `UPDATE users SET email_verification_token = $1, email_verification_expires = $2 WHERE id = $3`,
            [tokenHash, expiresAt, user.id]
        );

        const verificationUrl = `${config.FRONTEND_URL}/verify-email?token=${token}`;
        fireAndForget(EmailService.sendVerificationEmail(email, user.first_name, verificationUrl));

        return true;
    },

    async googleOAuthCallback(code: string, ip: string, userAgent: string, pendingReferralCode?: string) {
        // 1. Exchange code for tokens
        const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: config.GOOGLE_CLIENT_ID,
            client_secret: config.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: config.GOOGLE_CALLBACK_URL,
        });
        const { access_token, id_token } = tokenRes.data;

        // 2. Fetch User Profile
        const profileRes = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${access_token}` },
        });
        const profile = profileRes.data;

        const decodedIdToken = jwt.decode(id_token) as any;
        if (!decodedIdToken || decodedIdToken.aud !== config.GOOGLE_CLIENT_ID) {
            throw new AppError(401, 'GOOGLE_AUTH_FAILED', 'Invalid Google token audience');
        }

        // 3. Find oauth account
        let user;
        let isNewUser = false;
        const oauthRes = await pool.query('SELECT user_id FROM oauth_accounts WHERE provider_account_id = $1 AND provider = $2', [profile.sub, 'google']);

        if (oauthRes.rowCount && oauthRes.rowCount > 0) {
            // User exists via OAuth
            const userRes = await pool.query('SELECT * FROM users WHERE id = $1', [oauthRes.rows[0].user_id]);
            user = userRes.rows[0];

            await pool.query(
                'UPDATE oauth_accounts SET access_token = $1, refresh_token = $2 WHERE provider_account_id = $3',
                [access_token, tokenRes.data.refresh_token || null, profile.sub]
            );
        } else {
            // Find by email or create new user, ensuring transaction for new user/linking
            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                const userRes = await pool.query('SELECT * FROM users WHERE email = $1', [profile.email.toLowerCase()]);

                if (userRes.rowCount && userRes.rowCount > 0) {
                    user = userRes.rows[0];
                    // Link account
                    await client.query(
                        'INSERT INTO oauth_accounts (user_id, provider, provider_account_id, access_token, refresh_token) VALUES ($1, $2, $3, $4, $5)',
                        [user.id, 'google', profile.sub, access_token, tokenRes.data.refresh_token || null]
                    );
                } else {
                    // Create new user
                    const newUserRes = await client.query(
                        `INSERT INTO users (email, first_name, last_name, avatar_url, is_email_verified) 
              VALUES ($1, $2, $3, $4, true) RETURNING *`,
                        [profile.email.toLowerCase(), profile.given_name, profile.family_name || '', profile.picture]
                    );
                    user = newUserRes.rows[0];
                    isNewUser = true;

                    await client.query(
                        'INSERT INTO oauth_accounts (user_id, provider, provider_account_id, access_token, refresh_token) VALUES ($1, $2, $3, $4, $5)',
                        [user.id, 'google', profile.sub, access_token, tokenRes.data.refresh_token || null]
                    );

                    await CreditsService.grantSignupBonus(user.id, client);
                }

                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
        }

        // For NEW Google OAuth users: generate referral code & process pending referral
        if (isNewUser) {
            const newReferralCode = ReferralService.generateReferralCode();
            await pool.query(
                'UPDATE users SET referral_code = $1 WHERE id = $2',
                [newReferralCode, user.id]
            );

            if (pendingReferralCode) {
                await ReferralService.processReferral(user.id, pendingReferralCode);
                // Email is already verified for Google OAuth — reward immediately
                await ReferralService.rewardReferral(user.id);
            }
        }

        // Generate tokens
        const accessToken = TokenHelpers.generateAccessToken({ id: user.id, email: user.email, role: user.role });
        const refreshToken = TokenHelpers.generateRefreshToken();
        const refreshHash = TokenHelpers.hashToken(refreshToken);
        const sessionExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await pool.query(
            `INSERT INTO sessions (user_id, refresh_token_hash, ip_address, user_agent, expires_at) 
       VALUES ($1, $2, $3, $4, $5)`,
            [user.id, refreshHash, ip, userAgent, sessionExpiresAt]
        );

        const balance = await CreditsService.getBalance(user.id);

        return { user: sanitizeUser(user), accessToken, refreshToken, credits: { balance } };
    }
};
