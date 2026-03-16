'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useCreditsStore } from '@/store/creditsStore';
import type { User, AuthResponse, RegisterPayload, LoginPayload, ForgotPasswordPayload, ResetPasswordPayload } from '@/types/user';

// ── Queries ──────────────────────────────────────────────────────────

export function useMe() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const setBalance = useCreditsStore((s) => s.setBalance);

    return useQuery<User>({
        queryKey: ['auth', 'me'],
        queryFn: async () => {
            try {
                const { data: res } = await api.get('/auth/me');

                // The backend response is { status: 'success', data: { user, credits } }
                const user = res.data?.user || res.user || res;
                const credits = res.data?.credits || res.credits;

                // Hydrate auth store
                const currentToken = useAuthStore.getState().accessToken;
                useAuthStore.getState().setAuth(user, currentToken || '');

                // Hydrate credits store
                if (credits?.balance !== undefined) {
                    setBalance(credits.balance);
                }

                return user;
            } catch (error) {
                clearAuth();
                throw error;
            }
        },
        retry: false,
    });
}

// ── Mutations ────────────────────────────────────────────────────────

export function useRegister() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: RegisterPayload) => {
            const { data } = await api.post<{ message: string }>('/auth/register', payload);
            return data;
        },
        onSuccess: () => {
            router.push('/verify-email');
        },
    });
}

export function useLogin() {
    const setAuth = useAuthStore((s) => s.setAuth);
    const fetchBalance = useCreditsStore((s) => s.fetchBalance);
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: LoginPayload) => {
            const { data } = await api.post<AuthResponse>('/auth/login', payload);
            return data;
        },
        onSuccess: (data) => {
            setAuth(data.user, data.accessToken);
            fetchBalance();
            queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
            router.push('/dashboard');
        },
    });
}

export function useLogout() {
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async () => {
            await api.post('/auth/logout');
        },
        onSettled: () => {
            clearAuth();
            queryClient.clear();
            router.push('/login');
        },
    });
}

export function useGoogleLogin() {
    return useMutation({
        mutationFn: async () => {
            // Redirect to backend Google OAuth flow
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
        },
    });
}

export function useForgotPassword() {
    return useMutation({
        mutationFn: async (payload: ForgotPasswordPayload) => {
            const { data } = await api.post<{ message: string }>('/auth/forgot-password', payload);
            return data;
        },
    });
}

export function useResetPassword() {
    const router = useRouter();

    return useMutation({
        mutationFn: async (payload: ResetPasswordPayload) => {
            const { data } = await api.post<{ message: string }>('/auth/reset-password', payload);
            return data;
        },
        onSuccess: () => {
            router.push('/login');
        },
    });
}
