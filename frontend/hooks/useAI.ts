'use client';

import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useCreditsStore } from '@/store/creditsStore';

// ── Request / Response types ─────────────────────────────────────────

interface ImproveBulletsPayload {
    bullets: string[];
    role: string;
    industry?: string;
}

interface ImproveSummaryPayload {
    summary: string;
    role: string;
    experienceYears?: number;
}

interface ImproveCoverLetterPayload {
    body: string;
    role?: string;
    company?: string;
}

interface GenerateBulletsPayload {
    role: string;
    company: string;
    responsibilities: string;
}

interface SuggestSkillsPayload {
    role: string;
    currentSkills: string[];
}

interface RewriteSectionPayload {
    sectionType: 'summary' | 'experience' | 'skills';
    content: string;
    instruction: string;
}

// Backend response shape: { success: true, data: { result: {...}, credits: { deducted, newBalance } } }

/** Unwrap the nested API response and update the credits store */
function unwrapAIResponse(axiosData: any) {
    // axiosData is the parsed JSON from axios: { success, data: { result, credits } }
    const inner = axiosData.data || axiosData;
    const result = inner.result;
    const credits = inner.credits;

    // Sync credits balance if returned
    if (credits?.newBalance !== undefined) {
        useCreditsStore.getState().setBalance(credits.newBalance);
    }

    return result;
}

// ── Mutation hooks ───────────────────────────────────────────────────

export function useImproveBullets() {
    return useMutation({
        mutationFn: async (payload: ImproveBulletsPayload) => {
            const { data } = await api.post('/ai/improve-bullets', payload);
            const result = unwrapAIResponse(data);
            return (result.bullets || result) as string[];
        },
    });
}

export function useImproveSummary() {
    return useMutation({
        mutationFn: async (payload: ImproveSummaryPayload) => {
            const { data } = await api.post('/ai/improve-summary', payload);
            const result = unwrapAIResponse(data);
            return (result.summary || result) as string;
        },
    });
}

export function useImproveCoverLetter() {
    return useMutation({
        mutationFn: async (payload: ImproveCoverLetterPayload) => {
            const { data } = await api.post('/ai/improve-cover-letter', payload);
            const result = unwrapAIResponse(data);
            return (result.body || result) as string;
        },
    });
}

export function useGenerateBullets() {
    return useMutation({
        mutationFn: async (payload: GenerateBulletsPayload) => {
            const { data } = await api.post('/ai/generate-bullets', payload);
            const result = unwrapAIResponse(data);
            return (result.bullets || result) as string[];
        },
    });
}

export function useSuggestSkills() {
    return useMutation({
        mutationFn: async (payload: SuggestSkillsPayload) => {
            const { data } = await api.post('/ai/suggest-skills', payload);
            const result = unwrapAIResponse(data);
            return result as { technical: string[]; soft: string[] };
        },
    });
}

export function useRewriteSection() {
    return useMutation({
        mutationFn: async (payload: RewriteSectionPayload) => {
            const { data } = await api.post('/ai/rewrite-section', payload);
            const result = unwrapAIResponse(data);
            return (result.content || result) as string;
        },
    });
}

