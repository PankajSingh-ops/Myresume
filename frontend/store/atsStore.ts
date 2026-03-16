import { create } from 'zustand';
import { toast } from 'sonner';
import type {
    ATSScanResult,
    ATSJobMatchResult,
    ATSScan,
} from '@/types/ats';
import {
    scanResume,
    matchJobDescription,
    getUserScans,
} from '@/lib/api/ats';
import { useCreditsStore } from './creditsStore';

// ─── State types ─────────────────────────────────────────────

type ActiveTab = 'resume-scan' | 'job-match';

interface ATSState {
    // Results
    scanResult: ATSScanResult | null;
    matchResult: ATSJobMatchResult | null;
    currentScanId: string | null;

    // History
    scanHistory: ATSScan[];

    // Loading & error
    isScanning: boolean;
    isFetching: boolean;
    error: string | null;

    // UI
    activeTab: ActiveTab;

    // Actions
    runResumeScan: (file: File) => Promise<void>;
    runJobMatch: (file: File, jobDescription: string) => Promise<void>;
    fetchHistory: () => Promise<void>;
    clearResults: () => void;
    setActiveTab: (tab: ActiveTab) => void;
}

// ─── Helpers ─────────────────────────────────────────────────

function extractErrorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'response' in error) {
        const response: any = (error as any).response;

        if (response?.status === 429) {
            return "You've reached the scan limit (10/hour). Please try again later.";
        }

        if (response?.data?.detail) {
            return response.data.detail;
        }

        if (response?.data?.message) {
            return response.data.message;
        }
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'An unexpected error occurred.';
}

// ─── Store ───────────────────────────────────────────────────

export const useATSStore = create<ATSState>((set) => ({
    // Initial state
    scanResult: null,
    matchResult: null,
    currentScanId: null,
    scanHistory: [],
    isScanning: false,
    isFetching: false,
    error: null,
    activeTab: 'resume-scan',

    // ── Resume scan ──────────────────────────────────────────

    runResumeScan: async (file) => {
        set({
            isScanning: true,
            error: null,
            scanResult: null,
            matchResult: null,
            currentScanId: null,
        });

        try {
            const { data, scanId, credits } = await scanResume(file);

            set({
                scanResult: data,
                currentScanId: scanId,
                isScanning: false,
            });

            if (credits?.newBalance !== undefined) {
                useCreditsStore.getState().setBalance(credits.newBalance);
            }

            toast.success('Resume scan completed!');
        } catch (error) {
            const message = extractErrorMessage(error);
            set({ error: message, isScanning: false });
            toast.error(message);
        }
    },

    // ── Job match ────────────────────────────────────────────

    runJobMatch: async (file, jobDescription) => {
        set({
            isScanning: true,
            error: null,
            scanResult: null,
            matchResult: null,
            currentScanId: null,
        });

        try {
            const { data, scanId, credits } = await matchJobDescription(
                file,
                jobDescription
            );

            set({
                matchResult: data,
                currentScanId: scanId,
                isScanning: false,
            });

            if (credits?.newBalance !== undefined) {
                useCreditsStore.getState().setBalance(credits.newBalance);
            }

            toast.success('Job match analysis completed!');
        } catch (error) {
            const message = extractErrorMessage(error);
            set({ error: message, isScanning: false });
            toast.error(message);
        }
    },

    // ── Fetch history ────────────────────────────────────────

    fetchHistory: async () => {
        set({ isFetching: true, error: null });

        try {
            const { scans } = await getUserScans(1, 20);
            set({ scanHistory: scans, isFetching: false });
        } catch (error) {
            const message = extractErrorMessage(error);
            set({ error: message, isFetching: false });
            toast.error('Failed to load scan history.');
        }
    },

    // ── Clear results ────────────────────────────────────────

    clearResults: () =>
        set({
            scanResult: null,
            matchResult: null,
            currentScanId: null,
            error: null,
        }),

    // ── Set active tab ───────────────────────────────────────

    setActiveTab: (tab) =>
        set({
            activeTab: tab,
            scanResult: null,
            matchResult: null,
            currentScanId: null,
            error: null,
        }),
}));
