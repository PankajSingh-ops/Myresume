'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useMe } from '@/hooks/useAuth';
import { useBalance } from '@/hooks/useCredits';
import { Sidebar } from '@/components/common/Sidebar';
import { Header } from '@/components/common/Header';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const accessToken = useAuthStore((s) => s.accessToken);
    const isInitialized = useAuthStore((s) => s.isInitialized);

    // Fetch user + balance on mount
    useMe();
    useBalance();

    useEffect(() => {
        // Wait until we have made our initial me request before asserting logged out state
        if (isInitialized && !isAuthenticated && !accessToken) {
            router.replace('/login');
        }
    }, [isInitialized, isAuthenticated, accessToken, router]);

    if (!isInitialized) {
        // Show a brief loading skeleton or empty space while restoring session from cookie
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    if (!isAuthenticated && !accessToken) {
        return null; // Redirecting…
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className={cn(
                    "flex-1 overflow-y-auto",
                    !(pathname.startsWith('/resumes/') && pathname.endsWith('/edit')) && "p-6"
                )}>
                    {children}
                </main>
            </div>
        </div>
    );
}
