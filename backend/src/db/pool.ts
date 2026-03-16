import pg from 'pg';
import { config } from '../config/index';

const { Pool } = pg;

const pool = new Pool({
    connectionString: config.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        // You could replace console.log with Winston here
        console.log(`[DB] executed query:`, { text, duration, rows: res.rowCount });
        return res;
    } catch (err: any) {
        console.error(`[DB] query error:`, err.message);
        throw err;
    }
};

// Expose the pool directly for when transactions or client checkout is needed
export default pool;

// Graceful shutdown
const shutdown = async () => {
    console.log('Closing database connection pool');
    await pool.end();
    process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
