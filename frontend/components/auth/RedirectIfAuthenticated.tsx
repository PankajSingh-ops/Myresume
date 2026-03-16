'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isInitialized && isAuthenticated) {
            router.replace('/dashboard');
        }
    }, [mounted, isInitialized, isAuthenticated, router]);

    // Do not render anything on the server to prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    // If we haven't finished checking auth yet, or if they ARE authenticated,
    // don't render the public children yet.
    if (!isInitialized || isAuthenticated) {
        return null; // They will be redirected by the useEffect shortly
    }

    // Only render the public content if we are fully initialized AND confirmed NOT authenticated
    return <>{children}</>;
}
