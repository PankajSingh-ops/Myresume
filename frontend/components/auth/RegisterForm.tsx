'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import type { ApiError } from '@/types/api';
import { GoogleButton } from './GoogleButton';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

const registerSchema = z
    .object({
        firstName: z.string().min(1, 'First name is required').max(100),
        lastName: z.string().min(1, 'Last name is required').max(100),
        email: z.string().email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Must be at least 8 characters')
            .regex(/[a-z]/, 'Must contain a lowercase letter')
            .regex(/[A-Z]/, 'Must contain an uppercase letter')
            .regex(/\d/, 'Must contain a number')
            .regex(/[@$!%*?&]/, 'Must contain a special character (@$!%*?&)'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    referralCode?: string;
}

export function RegisterForm({ referralCode }: RegisterFormProps) {
    const router = useRouter();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isInitialized = useAuthStore((s) => s.isInitialized);

    // Store referral code in sessionStorage so it persists across navigations
    useEffect(() => {
        if (referralCode) {
            sessionStorage.setItem('referralCode', referralCode);
        }
    }, [referralCode]);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isInitialized, isAuthenticated, router]);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const passwordValue = watch('password', '');

    const onSubmit = async (values: RegisterFormValues) => {
        try {
            const storedRef = sessionStorage.getItem('referralCode');
            await api.post('/auth/register', {
                email: values.email,
                password: values.password,
                firstName: values.firstName,
                lastName: values.lastName,
                ...(storedRef && { referralCode: storedRef }),
            });
            sessionStorage.removeItem('referralCode');
            toast.success('Account created! Please check your email.');
            router.push('/login');
        } catch (err) {
            const error = err as ApiError;
            const status = error.response?.status;
            const code = error.response?.data?.code;

            if (status === 409 || code === 'EMAIL_TAKEN') {
                toast.error('This email is already registered.');
            } else {
                toast.error(error.response?.data?.detail || 'Registration failed.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <GoogleButton label="Sign up with Google" />

            <div className="relative flex items-center py-2">
                <div className="grow border-t border-border" />
                <span className="mx-4 shrink text-xs uppercase text-muted-foreground">
                    or continue with email
                </span>
                <div className="grow border-t border-border" />
            </div>

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                    </label>
                    <Input
                        id="firstName"
                        placeholder="John"
                        {...register('firstName')}
                    />
                    {errors.firstName && (
                        <p className="text-xs text-destructive">{errors.firstName.message}</p>
                    )}
                </div>
                <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                    </label>
                    <Input
                        id="lastName"
                        placeholder="Doe"
                        {...register('lastName')}
                    />
                    {errors.lastName && (
                        <p className="text-xs text-destructive">{errors.lastName.message}</p>
                    )}
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                />
                {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">
                    Password
                </label>
                <div className="relative">
                    <Input
                        id="password"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                </label>
                <div className="relative">
                    <Input
                        id="confirmPassword"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...register('confirmPassword')}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowConfirm(!showConfirm)}
                        tabIndex={-1}
                    >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                </div>
                {errors.confirmPassword && (
                    <p className="text-xs text-destructive">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-foreground hover:underline">
                    Log in
                </Link>
            </p>
        </form>
    );
}
