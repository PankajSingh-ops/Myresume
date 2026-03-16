import { Request, Response, NextFunction } from 'express';
import { nanoid } from 'nanoid';
import morgan from 'morgan';
import winston from 'winston';

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

// Ensure the Request interface type export works in other files that import requestLogger
// Wait, TS definition merged correctly with declare global.

// Configure Winston Logger
export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ],
});

// Create Morgan stream for Winston
const stream = {
    write: (message: string) => logger.info(message.trim()),
};

// Generate Request ID and configure Morgan logging
export const requestLogger = [
    (req: Request, res: Response, next: NextFunction) => {
        const requestId = nanoid(12);
        req.id = requestId;
        res.setHeader('X-Request-ID', requestId);
        next();
    },

    // Custom Morgan Format
    morgan((tokens, req, res) => {
        return JSON.stringify({
            requestId: (req as any).id,
            method: tokens.method(req, res),
            path: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            durationMs: Number(tokens['response-time'](req, res)),
            ip: tokens['remote-addr'](req, res),
            userId: (req as any).user?.id || undefined,
        });
    }, { stream })
];
