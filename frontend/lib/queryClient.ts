'use client';

import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ApiError } from '@/types/api';

function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60_000,
                gcTime: 5 * 60_000,
                retry: (failureCount, error) => {
                    const apiError = error as ApiError;
                    // Never retry 402 (insufficient credits) or 401
                    if (
                        apiError?.response?.status === 402 ||
                        apiError?.response?.status === 401
                    ) {
                        return false;
                    }
                    return failureCount < 1;
                },
                refetchOnWindowFocus: false,
            },
            mutations: {
                retry: false,
                onError: (error) => {
                    const apiError = error as ApiError;
                    const message =
                        apiError?.response?.data?.detail || 'Something went wrong';
                    toast.error(message);
                },
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
    // Server: always make a new client
    if (typeof window === 'undefined') {
        return makeQueryClient();
    }
    // Browser: reuse the singleton
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}
