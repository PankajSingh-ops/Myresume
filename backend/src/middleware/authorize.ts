import { Request, Response, NextFunction } from 'express';
import { AppError } from '../modules/credits/errors';

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const user = (req as any).user;

        if (!user) {
            res.status(401).json({
                type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                title: 'Unauthorized',
                status: 401,
                code: 'MISSING_USER',
                detail: 'User not authenticated',
            });
            return;
        }

        if (!roles.includes(user.role)) {
            res.status(403).json({
                type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                title: 'Forbidden',
                status: 403,
                code: 'INSUFFICIENT_PERMISSIONS',
                detail: 'You do not have permission to perform this action.',
            });
            return;
        }

        next();
    };
};
