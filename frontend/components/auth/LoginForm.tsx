'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCreditsStore } from '@/store/creditsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GoogleButton } from '@/components/auth/GoogleButton';
import type { ApiError } from '@/types/api';
import type { User } from '@/types/user';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
    status: string;
    data: {
        user: User;
        accessToken: string;
        refreshToken: string;
        credits: { balance: number };
    };
}

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect');

    const setAuth = useAuthStore((s) => s.setAuth);
    const setBalance = useCreditsStore((s) => s.setBalance);
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const isInitialized = useAuthStore((s) => s.isInitialized);

    useEffect(() => {
        if (isInitialized && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [isInitialized, isAuthenticated, router]);

    const [showPassword, setShowPassword] = useState(false);
    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [resendingVerification, setResendingVerification] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (values: LoginFormValues) => {
        setEmailNotVerified(false);

        try {
            const { data: res } = await api.post<LoginResponse>('/auth/login', values);
            const { user, accessToken, credits } = res.data;

            setAuth(user, accessToken);
            setBalance(credits.balance);

            const destination = redirectTo ? decodeURIComponent(redirectTo) : '/dashboard';
            router.push(destination);
        } catch (err) {
            const error = err as ApiError;
            const status = error.response?.status;
            const code = error.response?.data?.code;

            if (status === 401) {
                toast.error('Invalid email or password.');
            } else if (status === 423) {
                const detail = error.response?.data?.detail || '';
                toast.error(detail || 'Account locked. Too many failed attempts.');
            } else if (status === 403 && code === 'EMAIL_NOT_VERIFIED') {
                setEmailNotVerified(true);
                toast.error('Please verify your email first.');
            } else {
                toast.error(error.response?.data?.detail || 'Login failed.');
            }
        }
    };

    const handleResendVerification = async () => {
        setResendingVerification(true);
        try {
            await api.post('/auth/resend-verification', {
                email: getValues('email'),
            });
            toast.success('Verification email sent! Check your inbox.');
        } catch {
            toast.error('Failed to resend verification email.');
        } finally {
            setResendingVerification(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <GoogleButton label="Sign in with Google" />

            <div className="relative flex items-center py-2">
                <div className="grow border-t border-border" />
                <span className="mx-4 shrink text-xs uppercase text-muted-foreground">
                    or continue with email
                </span>
                <div className="grow border-t border-border" />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
                <label htmlFor="login-email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="login-email"
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
                <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="text-sm font-medium">
                        Password
                    </label>
                    <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Input
                        id="login-password"
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
            </div>

            {/* Email not verified banner */}
            {emailNotVerified && (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-900 dark:bg-yellow-950">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Your email is not verified.{' '}
                        <button
                            type="button"
                            className="font-medium underline hover:no-underline"
                            onClick={handleResendVerification}
                            disabled={resendingVerification}
                        >
                            {resendingVerification ? 'Sending…' : 'Resend verification email →'}
                        </button>
                    </p>
                </div>
            )}

            <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Log In
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-medium text-foreground hover:underline">
                    Sign up
                </Link>
            </p>
        </form>
    );
}
