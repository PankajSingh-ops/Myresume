'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
    CoverLetter,
    CoverLetterVersion,
    CreateCoverLetterDTO,
    UpdateCoverLetterDTO,
} from '@/types/coverLetter';

// ── Queries ──

export function useCoverLetters() {
    return useQuery<CoverLetter[]>({
        queryKey: ['cover-letters'],
        queryFn: async () => {
            const { data } = await api.get<{ data: CoverLetter[] }>('/cover-letters');
            return data.data;
        },
    });
}

export function useCoverLetter(id: string) {
    return useQuery<CoverLetter>({
        queryKey: ['cover-letters', id],
        queryFn: async () => {
            const { data } = await api.get<{ data: CoverLetter }>(`/cover-letters/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

export function useCoverLetterVersions(id: string) {
    return useQuery<CoverLetterVersion[]>({
        queryKey: ['cover-letters', id, 'versions'],
        queryFn: async () => {
            const { data } = await api.get<{ data: CoverLetterVersion[] }>(`/cover-letters/${id}/versions`);
            return data.data;
        },
        enabled: !!id,
    });
}

// ── Mutations ──

export function useCreateCoverLetter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateCoverLetterDTO) => {
            const { data } = await api.post<{ data: CoverLetter }>('/cover-letters', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
}

export function useUpdateCoverLetter(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateCoverLetterDTO) => {
            const { data } = await api.patch<{ data: CoverLetter }>(`/cover-letters/${id}`, payload);
            return data.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['cover-letters', id], updated);
            queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
        },
    });
}

export function useDeleteCoverLetter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/cover-letters/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
        },
    });
}

export function useDuplicateCoverLetter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post<{ data: CoverLetter }>(`/cover-letters/${id}/duplicate`);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
}

export function useRestoreCoverLetterVersion(coverLetterId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (versionId: string) => {
            const { data } = await api.post<{ data: CoverLetter }>(
                `/cover-letters/${coverLetterId}/versions/${versionId}/restore`,
            );
            return data.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['cover-letters', coverLetterId], updated);
            queryClient.invalidateQueries({ queryKey: ['cover-letters', coverLetterId, 'versions'] });
        },
    });
}
