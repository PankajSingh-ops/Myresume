import { Request, Response, NextFunction } from 'express';
import { AuthService } from './service';
import { TokenHelpers } from './tokens';
import { GoogleHelpers } from './google';
import { config } from '../../config/index';

export const AuthController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await AuthService.register(req.body, req.ip || '', req.headers['user-agent'] || '');
            // Instead of logging in automatically, wait for email verification
            res.status(201).json({
                status: 'success',
                message: 'Registration successful. Please check your email to verify your account.',
                data,
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { user, accessToken, refreshToken, credits } = await AuthService.login(
                req.body,
                req.ip || '',
                req.headers['user-agent'] || ''
            );

            TokenHelpers.setAuthCookies(res, accessToken, refreshToken);

            res.status(200).json({
                status: 'success',
                data: { user, accessToken, refreshToken, credits },
            });
        } catch (error) {
            next(error);
        }
    },

    async refreshTokens(req: Request, res: Response, next: NextFunction) {
        try {
            let rawToken = req.body?.refreshToken;
            if (!rawToken && req.cookies?.refresh_token) {
                rawToken = req.cookies.refresh_token;
            }

            if (!rawToken) {
                res.status(401).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Unauthorized',
                    status: 401,
                    code: 'MISSING_TOKEN',
                    detail: 'Refresh token is required.',
                });
                return;
            }

            const { accessToken, refreshToken } = await AuthService.refreshTokens(
                rawToken,
                req.ip || '',
                req.headers['user-agent'] || ''
            );

            TokenHelpers.setAuthCookies(res, accessToken, refreshToken);

            res.status(200).json({
                status: 'success',
                data: { accessToken, refreshToken },
            });
        } catch (error) {
            next(error);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            let rawToken = req.body?.refreshToken;
            if (!rawToken && req.cookies?.refresh_token) {
                rawToken = req.cookies.refresh_token;
            }

            if (rawToken) {
                await AuthService.logout(rawToken);
            }

            TokenHelpers.clearAuthCookies(res);
            res.status(200).json({ status: 'success', message: 'Logged out successfully' });
        } catch (error) {
            next(error);
        }
    },

    async logoutAll(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user?.id;
            if (userId) {
                await AuthService.logoutAll(userId);
            }

            TokenHelpers.clearAuthCookies(res);
            res.status(200).json({ status: 'success', message: 'Logged out from all devices successfully' });
        } catch (error) {
            next(error);
        }
    },

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const token = req.query.token as string;
            if (!token) {
                res.status(400).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Bad Request',
                    status: 400,
                    detail: 'Token is required',
                });
                return;
            }

            await AuthService.verifyEmail(token);
            res.status(200).json({ status: 'success', message: 'Email successfully verified' });
        } catch (error) {
            next(error);
        }
    },

    async resendVerification(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Bad Request',
                    status: 400,
                    detail: 'Email is required',
                });
                return;
            }

            await AuthService.resendVerification(email);
            res.status(200).json({
                status: 'success',
                message: 'If the email exists and is not yet verified, a new verification link has been sent.',
            });
        } catch (error) {
            next(error);
        }
    },

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthService.forgotPassword(req.body);
            res.status(200).json({ status: 'success', message: 'If the email exists, a reset link has been sent.' });
        } catch (error) {
            next(error);
        }
    },

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, password } = req.body;
            await AuthService.resetPassword(token, password);
            res.status(200).json({ status: 'success', message: 'Password has been successfully reset. You can now log in.' });
        } catch (error) {
            next(error);
        }
    },

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            await AuthService.changePassword(userId, req.body);
            TokenHelpers.clearAuthCookies(res);
            res.status(200).json({ status: 'success', message: 'Password changed successfully. Please log in again.' });
        } catch (error) {
            next(error);
        }
    },

    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const tokenUser = (req as any).user;
            const { CreditsService } = await import('../credits/service');

            // Fetch the full user row from the database
            const { rows } = await (await import('../../db/pool')).default.query(
                'SELECT * FROM users WHERE id = $1',
                [tokenUser.id]
            );

            if (rows.length === 0) {
                res.status(404).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Not Found',
                    status: 404,
                    detail: 'User not found.',
                });
                return;
            }

            const dbUser = rows[0];
            const balance = await CreditsService.getBalance(tokenUser.id);

            // Transform snake_case DB columns to camelCase for the frontend
            const user = {
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

            res.status(200).json({
                status: 'success',
                data: { user, credits: { balance } }
            });
        } catch (error) {
            next(error);
        }
    },

    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { firstName, lastName } = req.body;

            const pool = (await import('../../db/pool')).default;

            const { rows } = await pool.query(
                `UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), updated_at = NOW() WHERE id = $3 RETURNING *`,
                [firstName, lastName, userId]
            );

            if (rows.length === 0) {
                res.status(404).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Not Found',
                    status: 404,
                    detail: 'User not found.',
                });
                return;
            }

            const dbUser = rows[0];
            const user = {
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

            res.status(200).json({
                status: 'success',
                data: { user }
            });
        } catch (error) {
            next(error);
        }
    },

    async googleAuthInit(req: Request, res: Response, next: NextFunction) {
        try {
            const stateToken = GoogleHelpers.generateStateToken();
            // Store state token in a secure (signed if possible, or just httpOnly) cookie for 10 minutes
            res.cookie('oauth_state', stateToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // Needs to be lax for OAuth redirect back
                maxAge: 10 * 60 * 1000,
            });

            const url = GoogleHelpers.buildGoogleAuthUrl(stateToken);
            res.redirect(url);
        } catch (error) {
            next(error);
        }
    },

    async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
        try {
            const { code, state } = req.query;
            const storedState = req.cookies?.oauth_state;

            // CSRF Check
            if (!state || !storedState || state !== storedState) {
                return res.redirect(`${config.FRONTEND_URL}/login?error=csrf_failed`);
            }

            res.clearCookie('oauth_state');

            if (!code) {
                return res.redirect(`${config.FRONTEND_URL}/login?error=missing_code`);
            }

            // Read pending referral code from cookie (set by frontend API route)
            const pendingReferralCode = req.cookies?.pending_referral;

            const { user, accessToken, refreshToken, credits } = await AuthService.googleOAuthCallback(
                code as string,
                req.ip || '',
                req.headers['user-agent'] || '',
                pendingReferralCode
            );

            // Clear the pending referral cookie if it was present
            if (pendingReferralCode) {
                res.clearCookie('pending_referral');
            }

            TokenHelpers.setAuthCookies(res, accessToken, refreshToken);

            // Redirect to the frontend dashboard after successful Google OAuth
            return res.redirect(`${config.FRONTEND_URL}/dashboard`);
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
        }
    }
};
