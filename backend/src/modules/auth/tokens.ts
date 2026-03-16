import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { nanoid } from 'nanoid';
import { Response } from 'express';
import { config } from '../../config/index';

export interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

export const TokenHelpers = {
    generateAccessToken(payload: TokenPayload): string {
        return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
            jwtid: nanoid(),
        });
    },

    generateRefreshToken(): string {
        return `${crypto.randomUUID()}-${crypto.randomBytes(16).toString('hex')}`;
    },

    hashToken(rawToken: string): string {
        return crypto.createHash('sha256').update(rawToken).digest('hex');
    },

    setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 mins
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            path: '/api/auth/refresh', // only sent to refresh endpoint
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    },

    clearAuthCookies(res: Response) {
        const isProd = process.env.NODE_ENV === 'production';

        res.cookie('access_token', '', {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 0,
        });

        res.cookie('refresh_token', '', {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            path: '/api/auth/refresh',
            maxAge: 0,
        });
    },
};
