import express, { Express, Request, Response } from 'express';
import { configureSecurityMiddleware } from './middleware/security';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import { authenticate } from './middleware/authenticate';
import { authorize } from './middleware/authorize';

// Import routers
import { authRouter } from './modules/auth/router';
import resumesRouter from './modules/resumes/router';
import coverLettersRouter from './modules/cover-letters/router';
import creditsRouter from './modules/credits/router';
import exportRouter from './modules/export/router';
import paymentsRouter from './modules/payments/router';
import uploadRouter from './modules/upload/router';
import aiRouter from './modules/ai/router';
import atsRouter from './routes/ats';
import { referralsRouter } from './modules/referrals/router';
import pool from './db/pool';
import { redis } from './lib/redis';



export const createApp = (): Express => {
    const app = express();

    // 1. Security Middleware
    configureSecurityMiddleware(app);

    // 2. Request Logging
    app.use(requestLogger);

    // 3. Health Routes
    app.get('/api/health', (req: Request, res: Response) => {
        res.json({ status: 'ok', timestamp: new Date() });
    });

    // Detailed health endpoint (Admin only)
    app.get(
        '/api/health/detailed',
        authenticate,
        authorize('admin'),
        async (req: Request, res: Response) => {
            let dbConnected = false;
            let dbLatencyMs = 0;
            let redisConnected = false;

            // Check DB
            try {
                const dbStart = Date.now();
                await pool.query('SELECT 1');
                dbLatencyMs = Date.now() - dbStart;
                dbConnected = true;
            } catch (err) {
                dbConnected = false;
            }

            // Check Redis
            try {
                const ping = await redis.ping();
                redisConnected = ping === 'PONG';
            } catch (err) {
                redisConnected = false;
            }

            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const packageJson = require('../../package.json');

            res.json({
                status: dbConnected ? 'ok' : 'degraded',
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                db: { connected: dbConnected, latencyMs: dbLatencyMs },
                redis: { connected: redisConnected },
                version: packageJson.version,
            });
        }
    );

    // 4. API Routes
    app.use('/api/auth', authRouter);
    app.use('/api/resumes', resumesRouter);
    app.use('/api/cover-letters', coverLettersRouter);
    app.use('/api/credits', creditsRouter);
    app.use('/api/export', exportRouter);
    app.use('/api/payments', paymentsRouter);
    app.use('/api/ai', aiRouter);
    app.use('/api/ats', atsRouter);
    app.use('/api/referrals', referralsRouter);

    app.use('/api/upload', uploadRouter);

    // 5. Not Found Handler (404)
    app.use(notFoundHandler);

    // 6. Global Error Handler (must be last)
    app.use(errorHandler);

    return app;
};
