import { Router } from 'express';
import { PaymentsController } from './controller';
import { authenticate } from '../../middleware/authenticate';
import { validateBody } from '../../middleware/validateRequest';
import { createOrderSchema, verifyPaymentSchema } from './schemas';

const router = Router();

// Webhook endpoint does not require user authentication (Razorpay calls this directly)
// We verify its authenticity using the webhook signature instead
router.post('/webhook', PaymentsController.handleWebhook);

// All other payment routes require user authentication
router.use(authenticate);

// Request a new order from Razorpay
router.post(
    '/create-order',
    validateBody(createOrderSchema),
    PaymentsController.createOrder
);

// Verify payment signature after checkout success
router.post(
    '/verify',
    validateBody(verifyPaymentSchema),
    PaymentsController.verifyPayment
);

// Get transaction history
router.get(
    '/history',
    PaymentsController.getHistory
);

export default router;
