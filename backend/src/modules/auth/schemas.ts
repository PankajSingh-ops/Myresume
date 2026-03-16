import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(72, 'Password cannot exceed 72 characters')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
            'Must contain uppercase, lowercase, number, and special character'
        ),
    firstName: z.string().min(1, 'First name is required').max(100).trim(),
    lastName: z.string().min(1, 'Last name is required').max(100).trim(),
    referralCode: z.string().max(20).optional(),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, 'Token is required'),
    password: registerSchema.shape.password,
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: registerSchema.shape.password,
});

// Infer types
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;
