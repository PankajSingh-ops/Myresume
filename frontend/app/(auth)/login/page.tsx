import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = { title: 'Log In' };

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your credentials to access your account
                </p>
            </div>
            <Suspense>
                <LoginForm />
            </Suspense>
        </div>
    );
}
