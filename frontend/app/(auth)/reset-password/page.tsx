import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ResetPasswordPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Set a new password</h1>
                <p className="text-sm text-muted-foreground">
                    Your new password must be at least 8 characters
                </p>
            </div>
            <Suspense>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
