import { api } from '@/lib/api';
import { create } from 'zustand';

interface CreditsState {
    balance: number | null;
    isLoading: boolean;
    showModal: boolean;
    modalRequired: number;

    fetchBalance: () => Promise<void>;
    setBalance: (n: number) => void;
    deductOptimistic: (amount: number) => void;
    revertOptimistic: (amount: number) => void;
    openInsufficientModal: (required: number) => void;
    closeModal: () => void;
}

export const useCreditsStore = create<CreditsState>((set, get) => ({
    balance: null,
    isLoading: false,
    showModal: false,
    modalRequired: 0,

    fetchBalance: async () => {
        set({ isLoading: true });
        try {
            const { data } = await api.get<{ data: { balance: number } }>('/credits/balance');
            set({ balance: data.data.balance, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },

    setBalance: (n) => set({ balance: n }),

    deductOptimistic: (amount) => {
        const current = get().balance;
        if (current !== null) {
            set({ balance: current - amount });
        }
    },

    revertOptimistic: (amount) => {
        const current = get().balance;
        if (current !== null) {
            set({ balance: current + amount });
        }
    },

    openInsufficientModal: (required) =>
        set({ showModal: true, modalRequired: required }),

    closeModal: () =>
        set({ showModal: false, modalRequired: 0 }),
}));
