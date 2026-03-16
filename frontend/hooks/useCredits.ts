'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCreditsStore } from '@/store/creditsStore';
import type { CreditBalance, CreditTransaction } from '@/types/credits';

export function useBalance() {
    const setBalance = useCreditsStore((s) => s.setBalance);

    return useQuery<CreditBalance>({
        queryKey: ['credits', 'balance'],
        queryFn: async () => {
            const { data } = await api.get<{ status: string; data: CreditBalance }>('/credits/balance');
            setBalance(data.data.balance);
            return data.data;
        },
    });
}

export function useCreditHistory(page = 1, limit = 20) {
    return useQuery<{ transactions: CreditTransaction[]; total: number }>({
        queryKey: ['credits', 'history', page, limit],
        queryFn: async () => {
            const { data } = await api.get('/credits/history', {
                params: { page, limit },
            });
            return data.data; // Server returns { status: 'success', data: { transactions, total } }
        },
    });
}

/**
 * Generic deduct hook — the caller specifies the API call that costs credits.
 * Provides optimistic balance deduction with rollback on error.
 */
export function useDeductCredits() {
    const queryClient = useQueryClient();
    const { deductOptimistic, revertOptimistic } = useCreditsStore.getState();

    return {
        /** Wrap any credit-consuming API call with optimistic balance updates */
        withOptimisticDeduction: async <T>(
            amount: number,
            apiCall: () => Promise<T>,
        ): Promise<T> => {
            deductOptimistic(amount);
            try {
                const result = await apiCall();
                // Refresh real balance from server
                queryClient.invalidateQueries({ queryKey: ['credits', 'balance'] });
                queryClient.invalidateQueries({ queryKey: ['credits', 'history'] });
                return result;
            } catch (error) {
                revertOptimistic(amount);
                throw error;
            }
        },
    };
}
