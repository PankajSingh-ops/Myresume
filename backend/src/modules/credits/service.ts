import pool from '../../db/pool';
import { InsufficientCreditsError, AppError } from './errors';
import { config } from '../../config';
import { PoolClient } from 'pg';

export const CreditsService = {
    async getBalance(userId: string): Promise<number> {
        const { rows } = await pool.query(
            'SELECT balance FROM user_credits WHERE user_id = $1',
            [userId]
        );
        return rows[0]?.balance ?? 0;
    },

    async getCreditHistory(userId: string, options: { page: number; limit: number }) {
        const { page, limit } = options;
        const offset = (page - 1) * limit;

        const [countResult, rowsResult] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM credit_transactions WHERE user_id = $1', [userId]),
            pool.query(
                `SELECT 
                    id, 
                    user_id AS "userId", 
                    type AS "action", 
                    amount, 
                    balance_after AS "balanceAfter", 
                    description, 
                    metadata, 
                    created_at AS "createdAt"
                 FROM credit_transactions 
                 WHERE user_id = $1 
                 ORDER BY created_at DESC 
                 LIMIT $2 OFFSET $3`,
                [userId, limit, offset]
            ),
        ]);

        const total = parseInt(countResult.rows[0].count, 10);
        return {
            transactions: rowsResult.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },

    /**
     * Grant initial signup bonus credits.
     * Can accept a client if it's executed within an external transaction (like the user signup flow).
     */
    async grantSignupBonus(userId: string, client?: PoolClient) {
        const db = client || pool;
        const bonusAmount = config.SIGNUP_BONUS_CREDITS;

        // We do an upsert on ON CONFLICT DO NOTHING so it only gives the bonus one time
        const res = await db.query(
            `INSERT INTO user_credits (user_id, balance) 
       VALUES ($1, $2)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING balance`,
            [userId, bonusAmount]
        );

        if (res.rowCount && res.rowCount > 0) {
            await db.query(
                `INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
         VALUES ($1, 'signup_bonus', $2, $3, 'Welcome bonus')`,
                [userId, bonusAmount, bonusAmount]
            );
        }
    },

    /**
     * Atomic credit deduction.
     * @throws InsufficientCreditsError if user lacks funds.
     */
    async deductCredits(
        userId: string,
        cost: number,
        type: string,
        description: string,
        metadata: Record<string, any> = {},
        client?: PoolClient
    ): Promise<number> {
        const dbClient = client || await pool.connect();
        let isInternalTransaction = false;

        try {
            if (!client) {
                await dbClient.query('BEGIN');
                isInternalTransaction = true;
            }

            // SELECT FOR UPDATE locks the row specifically for this transaction preventing race conditions
            const balanceRes = await dbClient.query(
                'SELECT balance FROM user_credits WHERE user_id = $1 FOR UPDATE',
                [userId]
            );

            if (balanceRes.rowCount === 0) {
                throw new AppError(404, 'USER_NOT_FOUND', 'User credits profile not found');
            }

            const currentBalance = balanceRes.rows[0].balance;

            if (currentBalance < cost) {
                throw new InsufficientCreditsError(currentBalance, cost);
            }

            const newBalance = currentBalance - cost;

            await dbClient.query(
                'UPDATE user_credits SET balance = $1 WHERE user_id = $2',
                [newBalance, userId]
            );

            await dbClient.query(
                `INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [userId, type, -cost, newBalance, description, JSON.stringify(metadata)]
            );

            if (isInternalTransaction) {
                await dbClient.query('COMMIT');
            }

            return newBalance;
        } catch (error) {
            if (isInternalTransaction) {
                await dbClient.query('ROLLBACK');
            }
            throw error;
        } finally {
            if (!client) {
                dbClient.release();
            }
        }
    },

    async addCredits(
        userId: string,
        amount: number,
        type: string,
        description: string,
        metadata: Record<string, any> = {}
    ): Promise<number> {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const balanceRes = await client.query(
                'SELECT balance FROM user_credits WHERE user_id = $1 FOR UPDATE',
                [userId]
            );

            let currentBalance = 0;
            if (balanceRes.rowCount === 0) {
                // Fallback just in case they don't have a record yet
                await client.query('INSERT INTO user_credits (user_id, balance) VALUES ($1, 0)', [userId]);
            } else {
                currentBalance = balanceRes.rows[0].balance;
            }

            const newBalance = currentBalance + amount;

            await client.query(
                'UPDATE user_credits SET balance = $1 WHERE user_id = $2',
                [newBalance, userId]
            );

            await client.query(
                `INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, metadata)
         VALUES ($1, $2, $3, $4, $5, $6)`,
                [userId, type, amount, newBalance, description, JSON.stringify(metadata)]
            );

            await client.query('COMMIT');
            return newBalance;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Fast, non-locking check to see if user has enough credits.
     * Useful for showing UI element disabled states before submission.
     */
    async checkSufficientCredits(userId: string, cost: number) {
        const balance = await this.getBalance(userId);
        return {
            sufficient: balance >= cost,
            balance,
            required: cost,
        };
    },

    async adminGrantCredits(adminUserId: string, targetUserId: string, amount: number, reason: string) {
        // Basic verification you could expand on
        const adminRes = await pool.query('SELECT role FROM users WHERE id = $1', [adminUserId]);
        if (adminRes.rowCount === 0 || adminRes.rows[0].role !== 'admin') {
            throw new AppError(403, 'FORBIDDEN', 'Only admins can grant arbitrary credits');
        }

        return this.addCredits(targetUserId, amount, 'admin_grant', reason, { grantedBy: adminUserId });
    },

    async refundCredits(userId: string, amount: number, description: string, metadata: Record<string, any> = {}) {
        return this.addCredits(userId, amount, 'refund', description, metadata);
    }
};
