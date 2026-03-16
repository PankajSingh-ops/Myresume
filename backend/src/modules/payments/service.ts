import Razorpay from 'razorpay';
import crypto from 'crypto';
import pool from '../../db/pool';
import { config } from '../../config';
import { AppError } from '../credits/errors';
import { CreditsService } from '../credits/service';

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET,
});

export const PaymentsService = {
    async createOrder(userId: string, planId: string, credits: number, amountCents: number) {
        // Razorpay expects amount in the smallest currency unit (paise/cents)
        const orderOptions = {
            amount: amountCents, // e.g. 499 cents for $4.99 or 499 paise for ₹4.99
            currency: 'USD',
            // Receipt max length is 40 chars. userId is 36 chars long if UUID. 
            // So we take first 10 chars of UUID + timestamp to ensure uniqueness and fit limit.
            receipt: `rcpt_${userId.substring(0, 10)}_${Date.now().toString().slice(-8)}`,
        };

        try {
            const razorpayOrder = await razorpay.orders.create(orderOptions);

            const { rows } = await pool.query(
                `INSERT INTO transactions (user_id, razorpay_order_id, amount, currency, credits_added, status, plan_id)
                 VALUES ($1, $2, $3, $4, $5, 'pending', $6)
                 RETURNING id, razorpay_order_id, amount, currency, credits_added, status`,
                [userId, razorpayOrder.id, amountCents, orderOptions.currency, credits, planId]
            );

            return rows[0];
        } catch (error: any) {
            // Razorpay puts error details in `error.error.description` or `error.description`
            const errorMsg = error.error?.description || error.description || error.message || JSON.stringify(error);
            throw new AppError(500, 'PAYMENT_ERROR', `Failed to create Razorpay order: ${errorMsg}`);
        }
    },

    async verifyPayment(
        userId: string,
        razorpayOrderId: string,
        razorpayPaymentId: string,
        razorpaySignature: string
    ) {
        // 1. Verify Signature
        const generatedSignature = crypto
            .createHmac('sha256', config.RAZORPAY_KEY_SECRET)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest('hex');

        if (generatedSignature !== razorpaySignature) {
            // Update transaction to failed
            await pool.query(
                `UPDATE transactions SET status = 'failed', updated_at = NOW() WHERE razorpay_order_id = $1`,
                [razorpayOrderId]
            );
            throw new AppError(400, 'PAYMENT_VERIFICATION_FAILED', 'Invalid payment signature');
        }

        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const { rows: txRows } = await client.query(
                `SELECT * FROM transactions WHERE razorpay_order_id = $1 FOR UPDATE`,
                [razorpayOrderId]
            );

            if (txRows.length === 0) {
                throw new AppError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found for this order ID');
            }

            const transaction = txRows[0];

            if (transaction.status === 'completed') {
                await client.query('ROLLBACK');
                return transaction; // Already processed
            }

            // Mark transaction as successful
            await client.query(
                `UPDATE transactions 
                 SET status = 'completed', razorpay_payment_id = $1, razorpay_signature = $2, updated_at = NOW() 
                 WHERE razorpay_order_id = $3`,
                [razorpayPaymentId, razorpaySignature, razorpayOrderId]
            );

            // Add credits to user
            await CreditsService.addCredits(
                userId,
                transaction.credits_added,
                'purchase', // as defined in credit_transaction_type enum
                `Purchased ${transaction.plan_id} plan`,
                { razorpayOrderId, razorpayPaymentId }
            );

            await client.query('COMMIT');
            return transaction;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    },

    async processWebhook(signature: string, payloadStr: string) {
        // 1. Verify webhook signature
        const expectedSignature = crypto
            .createHmac('sha256', config.RAZORPAY_WEBHOOK_SECRET)
            .update(payloadStr)
            .digest('hex');

        if (expectedSignature !== signature) {
            throw new AppError(400, 'WEBHOOK_VERIFICATION_FAILED', 'Invalid webhook signature');
        }

        const payload = JSON.parse(payloadStr);

        // 2. Process events
        if (payload.event === 'payment.captured') {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id;
            const paymentId = payment.id;

            if (!orderId) return;

            // Use the verifyPayment logic, but we omit the client-side signature check 
            // since we already verified the webhook signature above.
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                const { rows: txRows } = await client.query(
                    `SELECT * FROM transactions WHERE razorpay_order_id = $1 FOR UPDATE`,
                    [orderId]
                );

                if (txRows.length > 0) {
                    const transaction = txRows[0];
                    if (transaction.status === 'pending') {
                        await client.query(
                            `UPDATE transactions 
                             SET status = 'completed', razorpay_payment_id = $1, razorpay_signature = $2, updated_at = NOW() 
                             WHERE razorpay_order_id = $3`,
                            [paymentId, 'WEBHOOK_VERIFIED', orderId]
                        );

                        await CreditsService.addCredits(
                            transaction.user_id,
                            transaction.credits_added,
                            'purchase',
                            `Purchased ${transaction.plan_id} plan (Webhook)`,
                            { razorpayOrderId: orderId, razorpayPaymentId: paymentId }
                        );
                    }
                }
                await client.query('COMMIT');
            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }
        } else if (payload.event === 'payment.failed') {
            const payment = payload.payload.payment.entity;
            const orderId = payment.order_id;

            if (orderId) {
                await pool.query(
                    `UPDATE transactions SET status = 'failed', updated_at = NOW() WHERE razorpay_order_id = $1 AND status = 'pending'`,
                    [orderId]
                );
            }
        }
    },

    async getHistory(userId: string, options: { page: number; limit: number }) {
        const { page, limit } = options;
        const offset = (page - 1) * limit;

        const [countResult, rowsResult] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM transactions WHERE user_id = $1', [userId]),
            pool.query(
                `SELECT 
                    id, 
                    amount, 
                    currency, 
                    credits_added AS "creditsAdded", 
                    status, 
                    plan_id AS "planId", 
                    created_at AS "createdAt"
                 FROM transactions 
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
    }
};
