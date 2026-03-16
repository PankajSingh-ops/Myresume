import { nanoid } from 'nanoid';
import pool from '../../db/pool';
import { PoolClient } from 'pg';

export const ReferralService = {
    /**
     * Generate an 8-character uppercase referral code.
     */
    generateReferralCode(): string {
        return nanoid(8).toUpperCase();
    },

    /**
     * Link a referee to a referrer via referral code.
     * Silently returns if:
     *  - referral code not found
     *  - self-referral attempt
     *  - referee already has a referral record (UNIQUE constraint)
     */
    async processReferral(refereeId: string, referralCode: string): Promise<void> {
        // Find the referrer by referral code
        const { rows } = await pool.query(
            'SELECT id FROM users WHERE referral_code = $1',
            [referralCode]
        );

        if (rows.length === 0) return; // Code not found

        const referrerId = rows[0].id;

        if (referrerId === refereeId) return; // No self-referral

        // Insert referral row — ON CONFLICT DO NOTHING prevents double-linking
        await pool.query(
            `INSERT INTO referrals (referrer_id, referee_id, status)
             VALUES ($1, $2, 'pending')
             ON CONFLICT (referee_id) DO NOTHING`,
            [referrerId, refereeId]
        );

        // Mark who referred the user
        await pool.query(
            `UPDATE users SET referred_by_user_id = $1, referral_code_used_at = NOW()
             WHERE id = $2 AND referred_by_user_id IS NULL`,
            [referrerId, refereeId]
        );
    },

    /**
     * Reward both referrer and referee with credits.
     * MUST check is_email_verified FIRST — hard return if not verified.
     */
    async rewardReferral(refereeId: string): Promise<void> {
        // FIRST LINE: verify email status
        const { rows: userRows } = await pool.query(
            'SELECT is_email_verified FROM users WHERE id = $1',
            [refereeId]
        );

        if (!userRows[0] || userRows[0].is_email_verified !== true) {
            console.log('Referral reward skipped - email not verified');
            return;
        }

        // Find the pending referral for this referee
        const { rows: refRows } = await pool.query(
            `SELECT * FROM referrals WHERE referee_id = $1 AND status = 'pending'`,
            [refereeId]
        );

        if (refRows.length === 0) return; // No pending referral

        const referral = refRows[0];

        // Open DB transaction for all credit operations
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await this.awardCredits(
                referral.referrer_id,
                referral.referrer_credits,
                'referral_bonus',
                'Referral bonus - friend joined',
                { referralId: referral.id },
                client
            );

            await this.awardCredits(
                refereeId,
                referral.referee_credits,
                'referee_bonus',
                'Bonus for joining via referral',
                { referralId: referral.id },
                client
            );

            await client.query(
                `UPDATE referrals SET status = 'rewarded', rewarded_at = NOW() WHERE id = $1`,
                [referral.id]
            );

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    /**
     * Award credits to a user within a transaction.
     * Updates balance and records the transaction.
     */
    async awardCredits(
        userId: string,
        amount: number,
        type: string,
        description: string,
        metadata: Record<string, any> = {},
        client: PoolClient
    ): Promise<void> {
        // Ensure user_credits row exists
        await client.query(
            `INSERT INTO user_credits (user_id, balance) VALUES ($1, 0) ON CONFLICT (user_id) DO NOTHING`,
            [userId]
        );

        const { rows } = await client.query(
            `UPDATE user_credits SET balance = balance + $1 WHERE user_id = $2 RETURNING balance`,
            [amount, userId]
        );

        const balanceAfter = rows[0].balance;

        await client.query(
            `INSERT INTO credit_transactions (user_id, type, amount, balance_after, description, metadata)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, type, amount, balanceAfter, description, JSON.stringify(metadata)]
        );
    },
};
