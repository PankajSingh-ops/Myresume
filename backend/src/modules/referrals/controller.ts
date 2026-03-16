import { Request, Response, NextFunction } from 'express';
import pool from '../../db/pool';
import { config } from '../../config/index';
import { ReferralService } from './service';

export const ReferralController = {
    async getStats(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;

            // Ensure the user has a referral code (backfill for existing users)
            const { rows: userRows } = await pool.query(
                'SELECT referral_code FROM users WHERE id = $1',
                [userId]
            );

            let referralCode = userRows[0]?.referral_code;

            if (!referralCode) {
                referralCode = ReferralService.generateReferralCode();
                await pool.query(
                    'UPDATE users SET referral_code = $1 WHERE id = $2',
                    [referralCode, userId]
                );
            }

            const { rows } = await pool.query(
                `SELECT
                    COUNT(r.id) FILTER (WHERE r.status = 'rewarded')  AS successful_referrals,
                    COUNT(r.id) FILTER (WHERE r.status = 'pending')   AS pending_referrals,
                    COALESCE(SUM(r.referrer_credits) FILTER (WHERE r.status = 'rewarded'), 0) AS total_credits_earned
                 FROM referrals r
                 WHERE r.referrer_id = $1`,
                [userId]
            );

            const stats = rows[0] || {
                successful_referrals: 0,
                pending_referrals: 0,
                total_credits_earned: 0,
            };

            res.status(200).json({
                status: 'success',
                data: {
                    referralCode,
                    referralLink: `${config.FRONTEND_URL}/register?ref=${referralCode}`,
                    successfulReferrals: parseInt(stats.successful_referrals, 10) || 0,
                    pendingReferrals: parseInt(stats.pending_referrals, 10) || 0,
                    totalCreditsEarned: parseInt(stats.total_credits_earned, 10) || 0,
                },
            });
        } catch (error) {
            next(error);
        }
    },
};

