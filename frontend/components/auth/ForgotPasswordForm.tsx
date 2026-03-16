'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const schema = z.object({
    email: z.string().email('Invalid email address'),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = async (values: FormValues) => {
        try {
            await api.post('/auth/forgot-password', values);
            setSent(true);
        } catch {
            // Backend returns 200 regardless (prevents enumeration), but network errors possible
            toast.error('Something went wrong. Please try again.');
        }
    };

    if (sent) {
        return (
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold">Check your email</h2>
                <p className="text-sm text-muted-foreground">
                    If an account exists with that email, we&apos;ve sent password reset instructions.
                </p>
                <Link href="/login">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to login
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
                <label htmlFor="fp-email" className="text-sm font-medium">
                    Email
                </label>
                <Input
                    id="fp-email"
                    type="email"
                    placeholder="john@example.com"
                    {...register('email')}
                />
                {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
            </Button>

            <p className="text-center text-sm text-muted-foreground">
                <Link href="/login" className="font-medium text-foreground hover:underline">
                    ← Back to login
                </Link>
            </p>
        </form>
    );
}
