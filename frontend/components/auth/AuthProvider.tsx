'use client';

import { usePathname } from 'next/navigation';
import { useMe } from '@/hooks/useAuth';

// Routes where we should NOT attempt session hydration (e.g. Puppeteer render pages)
const SKIP_AUTH_ROUTES = ['/resume-render', '/cover-letter-render'];

function AuthHydrator() {
    useMe();
    return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Defensively check both usePathname and window.location to ensure Puppeteer ALWAYS skips
    const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
    const shouldSkip = SKIP_AUTH_ROUTES.some((route) => currentPath.startsWith(route));

    return (
        <>
            {!shouldSkip && <AuthHydrator />}
            {children}
        </>
    );
}
