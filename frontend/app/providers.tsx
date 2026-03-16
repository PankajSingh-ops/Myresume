'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/queryClient';
import { Toaster } from 'sonner';
import { InsufficientCreditsModal } from '@/components/credits/InsufficientCreditsModal';
import { RouteProgress } from '@/components/common/RouteProgress';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                <RouteProgress />
                <AuthProvider>
                    {children}
                </AuthProvider>
                <Toaster
                    position="bottom-right"
                    richColors
                    closeButton
                    theme="system"
                    toastOptions={{
                        duration: 4000,
                    }}
                />
                <InsufficientCreditsModal />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
