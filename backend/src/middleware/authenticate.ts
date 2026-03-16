import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        let token: string | undefined;

        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        // Fallback to cookie
        if (!token && req.cookies && req.cookies.access_token) {
            token = req.cookies.access_token;
        }

        if (!token) {
            res.status(401).json({
                type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                title: 'Unauthorized',
                status: 401,
                code: 'MISSING_TOKEN',
                detail: 'Authentication token is required.',
            });
            return;
        }

        // Verify token
        const decoded = jwt.verify(token, config.JWT_ACCESS_SECRET) as { id?: string, sub?: string, email?: string, role?: string };

        // Attach user to request
        (req as any).user = {
            id: decoded.id || decoded.sub,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                title: 'Unauthorized',
                status: 401,
                code: 'TOKEN_EXPIRED',
                detail: 'Your access token has expired. Please log in again.',
            });
            return;
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                title: 'Unauthorized',
                status: 401,
                code: 'INVALID_TOKEN',
                detail: 'The provided token is invalid.',
            });
            return;
        }

        next(error);
    }
};
