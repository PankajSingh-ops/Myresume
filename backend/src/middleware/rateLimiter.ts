import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import { config } from '../config/index';
import { Request, Response } from 'express';

// Init Redis connection
const redisClient = new Redis(config.REDIS_URL);

// Base configuration options for standardizing limiters
const createLimiter = (options: {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request, res: Response) => string;
}) => {
    return rateLimit({
        windowMs: options.windowMs,
        limit: options.max,
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        ...(options.keyGenerator && { keyGenerator: options.keyGenerator }),
        store: new RedisStore({
            // @ts-expect-error - Known issue with rate-limit-redis > 3.0 types
            sendCommand: (...args: string[]) => redisClient.call(...args),
        }),
        handler: (req: Request, res: Response) => {
            res.status(429).json({
                type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                title: 'Too Many Requests',
                status: 429,
                detail: 'You have exceeded the allowed number of requests. Please try again later.',
            });
        },
    });
};

// Rate Limiters

// General Limiter: 100 req / 15 min per IP
export const generalLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

// Auth Limiter: 10 req / 15 min per IP
export const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
});

// Reset Password Limiter: 5 req / hour per IP
export const resetPasswordLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
});

// AI Limiter: 20 req / hour per authenticated user ID
export const aiLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 20,
    keyGenerator: (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        // Basic fallback avoiding standard regex checks for request IP
        return userId || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
    },
});

// Upload Limiter: 10 req / hour per authenticated user ID
export const uploadLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        return userId || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
    },
});

// Credit Check Limiter: 50 req / 15 min per user
export const creditCheckLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    max: 50,
    keyGenerator: (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        return userId || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
    },
});

// ATS Scan Limiter: 10 req / hour per authenticated user (AI is expensive)
export const atsScanLimiter = createLimiter({
    windowMs: 60 * 60 * 1000,
    max: 10,
    keyGenerator: (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        return userId || (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || 'unknown';
    },
});

