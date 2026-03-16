import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email and we&apos;ll send you a reset link
                </p>
            </div>
            <ForgotPasswordForm />
        </div>
    );
}
