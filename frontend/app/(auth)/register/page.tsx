import type { Metadata } from 'next';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = { title: 'Create Account' };

export default async function RegisterPage({
    searchParams,
}: {
    searchParams: Promise<{ ref?: string }>;
}) {
    const { ref } = await searchParams;

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                    Start building your professional resume today
                </p>
            </div>
            <RegisterForm referralCode={ref} />
        </div>
    );
}
