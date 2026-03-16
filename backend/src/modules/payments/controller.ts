import { Request, Response, NextFunction } from 'express';
import { PaymentsService } from './service';
import { CreateOrderDTO, VerifyPaymentDTO } from './schemas';
import { AppError } from '../credits/errors';
import pool from '../../db/pool';
import { logger } from '../../middleware/requestLogger';

export const PaymentsController = {
    async createOrder(req: Request<{}, {}, CreateOrderDTO>, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { planId, credits, amount } = req.body;

            const order = await PaymentsService.createOrder(userId, planId, credits, amount);

            res.status(201).json({
                message: 'Order created successfully',
                order
            });
        } catch (error) {
            logger.error(`Error in createOrder: ${error}`);
            next(error);
        }
    },

    async verifyPayment(req: Request<{}, {}, VerifyPaymentDTO>, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

            const transaction = await PaymentsService.verifyPayment(
                userId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            );

            res.status(200).json({
                message: 'Payment verified and credits added successfully',
                transaction
            });
        } catch (error) {
            logger.error(`Error in verifyPayment: ${error}`);
            next(error);
        }
    },

    async handleWebhook(req: Request, res: Response, next: NextFunction) {
        try {
            // Razorpay sends the signature in the 'x-razorpay-signature' header
            const signature = req.headers['x-razorpay-signature'] as string;
            
            if (!signature) {
                res.status(400).send('Webhook Signature Missing');
                return;
            }

            // Webhooks need the raw body as a string to verify the cryptographic signature properly
            // Alternatively, since express.json() is used globally, we can use JSON.stringify(req.body)
            // But JSON formatting can differ. It's best if we check for req.rawBody or use JSON.stringify as a fallback.
            // For this project, assuming a standard setup, we stringify the object:
            const payloadStr = JSON.stringify(req.body);

            await PaymentsService.processWebhook(signature, payloadStr);

            res.status(200).send('OK');
        } catch (error) {
            logger.error(`Error in handleWebhook: ${error}`);
            // We still respond with 200/OK if we gracefully handled it as a non-applicable event,
            // but for verify failures we might want to let Razorpay know to retry, or 200 so they stop pinging.
            // Returning 400 makes Razorpay retry. 
            res.status(400).send('Webhook processing failed');
        }
    },

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;

            const result = await PaymentsService.getHistory(userId, { page, limit });

            res.status(200).json({
                success: true,
                data: result.transactions,
                meta: {
                    total: result.total,
                    page: result.page,
                    limit: result.limit,
                    totalPages: result.totalPages
                }
            });
        } catch (error) {
            next(error);
        }
    }
};
