'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export interface ReferralStats {
    referralCode: string | null;
    referralLink: string | null;
    successfulReferrals: number;
    pendingReferrals: number;
    totalCreditsEarned: number;
}

export function useReferralStats() {
    return useQuery<ReferralStats>({
        queryKey: ['referrals', 'stats'],
        queryFn: async () => {
            const { data } = await api.get<{ status: string; data: ReferralStats }>('/referrals/stats');
            return data.data;
        },
    });
}
