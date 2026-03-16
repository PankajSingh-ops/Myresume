'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import type { ApiError } from '@/types/api';

const schema = z
    .object({
        password: z
            .string()
            .min(8, 'Must be at least 8 characters')
            .regex(/[a-z]/, 'Must contain a lowercase letter')
            .regex(/[A-Z]/, 'Must contain an uppercase letter')
            .regex(/\d/, 'Must contain a number')
            .regex(/[@$!%*?&]/, 'Must contain a special character'),
        confirmPassword: z.string(),
    })
    .refine((d) => d.password === d.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const passwordValue = watch('password', '');

    if (!token) {
        return (
            <div className="space-y-4 text-center">
                <h2 className="text-lg font-semibold text-destructive">Invalid Link</h2>
                <p className="text-sm text-muted-foreground">
                    This password reset link is missing or malformed.
                </p>
                <Link href="/forgot-password">
                    <Button variant="outline">Request a new link</Button>
                </Link>
            </div>
        );
    }

    const onSubmit = async (values: FormValues) => {
        try {
            await api.post('/auth/reset-password', {
                token,
                password: values.password,
            });
            toast.success('Password reset successfully! Please log in.');
            router.push('/login');
        } catch (err) {
            const error = err as ApiError;
            const code = error.response?.data?.code;
            if (code === 'INVALID_OR_EXPIRED_TOKEN') {
                toast.error('This reset link has expired. Please request a new one.');
            } else {
                toast.error(error.response?.data?.detail || 'Failed to reset password.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="rp-password" className="text-sm font-medium">
                    New Password
                </label>
                <div className="relative">
                    <Input
                        id="rp-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
                <PasswordStrengthMeter password={passwordValue} />
            </div>

            <div className="space-y-1.5">
                <label htmlFor="rp-confirm" className="text-sm font-medium">
                    Confirm Password
                </label>
                <Input
                    id="rp-confirm"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
            </Button>
        </form>
    );
}
