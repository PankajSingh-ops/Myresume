import cron from 'node-cron';
import pool from '../db/pool';
import { logger } from '../lib/logger';

export function startCronJobs() {
    // ----------------------------------------------------
    // Daily at 2:00 AM: Cleanup Expired Sessions
    // ----------------------------------------------------
    cron.schedule('0 2 * * *', async () => {
        logger.info('[CRON] Starting expired session cleanup job...');
        try {
            const res = await pool.query('DELETE FROM sessions WHERE expires_at < NOW()');
            logger.info(`[CRON] Expired session cleanup complete. Rows deleted: ${res.rowCount}`);
        } catch (error: any) {
            logger.error(`[CRON] Expired session cleanup failed: ${error.message}`);
        }
    });

    // ----------------------------------------------------
    // Daily at 3:00 AM: Cleanup Stale Unverified Accounts
    // ----------------------------------------------------
    cron.schedule('0 3 * * *', async () => {
        logger.info('[CRON] Starting unverified users cleanup job...');
        try {
            // Unverified users older than 7 days
            const res = await pool.query(`
                DELETE FROM users 
                WHERE is_email_verified = false 
                AND created_at < NOW() - INTERVAL '7 days'
            `);
            logger.info(`[CRON] Unverified user cleanup complete. Ghost accounts deleted: ${res.rowCount}`);
        } catch (error: any) {
            logger.error(`[CRON] Unverified user cleanup failed: ${error.message}`);
        }
    });

    logger.info('🕰️ Scheduled node-cron maintenance jobs initialized.');
}
