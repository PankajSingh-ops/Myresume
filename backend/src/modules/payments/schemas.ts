import { z } from 'zod';

export const createOrderSchema = z.object({
    planId: z.string().min(1, "Plan ID is required"),
    credits: z.number().int().positive("Credits must be a positive integer"),
    amount: z.number().int().positive("Amount must be a positive integer in cents"),
});

export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, "Razorpay Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Razorpay Payment ID is required"),
    razorpay_signature: z.string().min(1, "Razorpay Signature is required"),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type VerifyPaymentDTO = z.infer<typeof verifyPaymentSchema>;
