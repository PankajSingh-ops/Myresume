'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

type VerifyState = 'loading' | 'success' | 'error';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [state, setState] = useState<VerifyState>(token ? 'loading' : 'error');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setState('error');
            setErrorMessage('No verification token provided.');
            return;
        }

        const verify = async () => {
            try {
                await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
                setState('success');
            } catch (err: unknown) {
                setState('error');
                const error = err as { response?: { data?: { detail?: string } } };
                setErrorMessage(
                    error?.response?.data?.detail ||
                    'Verification failed. The link may have expired.',
                );
            }
        };

        verify();
    }, [token]);

    if (state === 'loading') {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Verifying your email…</p>
            </div>
        );
    }

    if (state === 'success') {
        return (
            <div className="space-y-4 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Email verified!</h1>
                <p className="text-sm text-muted-foreground">
                    Your email has been successfully verified. You can now log in to your
                    account.
                </p>
                <Link href="/login">
                    <Button className="mt-2">Go to Login</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Verification failed</h1>
            <p className="text-sm text-muted-foreground">
                {errorMessage}
            </p>
            <Link href="/login">
                <Button variant="outline" className="mt-2">
                    Back to Login
                </Button>
            </Link>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center py-8">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
