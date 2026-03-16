import { config } from './config';
import { logger } from './middleware/requestLogger';
import { startCronJobs } from './jobs/cleanup';
import pool from './db/pool';
import { redis } from './lib/redis';
import { createApp } from './app';

async function bootstrap() {
    try {
        logger.info('Starting backend server bootstrap process...');

        // 1. Validate config (implicit via import config above)
        // If config was missing a required property, the app would have already crashed during import.

        // 2. Test DB connection
        logger.info('Testing database connection...');
        await pool.query('SELECT 1');
        logger.info('Database connection established successfully.');

        // 3. Test Redis connection (do not crash on failure)
        try {
            logger.info('Testing Redis connection...');
            const pong = await redis.ping();
            if (pong === 'PONG') {
                logger.info('Redis connection established successfully.');
            }
        } catch (error: any) {
            logger.warn(`Redis connection failed: ${error.message} - App will degrade gracefully.`);
        }

        // 4. Import app from app.ts and initialize
        const app = createApp();

        // 5. Start HTTP server
        const port = config.PORT || 5000;
        const server = app.listen(port, () => {
            logger.info(`Server listening on port ${port} in ${config.NODE_ENV} mode.`);
        });

        // 6. Start Cron Jobs
        startCronJobs();

        // Log startup summary
        logger.info('--- Startup Summary ---');
        logger.info(`Port: ${port}`);
        logger.info(`NODE_ENV: ${config.NODE_ENV}`);
        logger.info('DB Connected: true');
        logger.info(`Redis Status: ${redis.status}`);
        logger.info('-----------------------');

        // 7. Graceful Shutdown handlers
        const shutdown = async (signal: string) => {
            logger.info(`${signal} signal received. Starting graceful shutdown...`);

            // Start a timeout to force shutdown if it takes too long
            const forceShutdownTimeout = setTimeout(() => {
                logger.error('Forced shutdown after 10s timeout.');
                process.exit(1);
            }, 10_000);

            server.close(async () => {
                logger.info('HTTP server closed — no longer accepting new connections, draining existing.');

                try {
                    await pool.end();
                    logger.info('Database pool closed.');
                } catch (err: any) {
                    logger.error(`Error closing database pool: ${err.message}`);
                }

                try {
                    await redis.quit();
                    logger.info('Redis connection closed.');
                } catch (err: any) {
                    logger.error(`Error closing Redis connection: ${err.message}`);
                }

                clearTimeout(forceShutdownTimeout);
                logger.info('Graceful shutdown complete. Exiting process.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error: any) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
}

bootstrap();
