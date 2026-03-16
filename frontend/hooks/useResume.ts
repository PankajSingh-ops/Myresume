'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type {
    Resume,
    ResumeVersion,
    CreateResumeDTO,
    UpdateResumeDTO,
} from '@/types/resume';

// ── Queries ──────────────────────────────────────────────────────────

export function useResumes() {
    return useQuery<Resume[]>({
        queryKey: ['resumes'],
        queryFn: async () => {
            const { data } = await api.get<{ data: Resume[] }>('/resumes');
            return data.data;
        },
    });
}

export function useResume(id: string) {
    return useQuery<Resume>({
        queryKey: ['resumes', id],
        queryFn: async () => {
            const { data } = await api.get<{ data: Resume }>(`/resumes/${id}`);
            return data.data;
        },
        enabled: !!id,
    });
}

export function useResumeVersions(id: string) {
    return useQuery<ResumeVersion[]>({
        queryKey: ['resumes', id, 'versions'],
        queryFn: async () => {
            const { data } = await api.get<{ data: ResumeVersion[] }>(`/resumes/${id}/versions`);
            return data.data;
        },
        enabled: !!id,
    });
}

// ── Mutations ────────────────────────────────────────────────────────

export function useCreateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: CreateResumeDTO) => {
            const { data } = await api.post<{ data: Resume }>('/resumes', payload);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
}

export function useUpdateResume(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateResumeDTO) => {
            const { data } = await api.patch<{ data: Resume }>(`/resumes/${id}`, payload);
            return data.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['resumes', id], updated);
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        },
    });
}

export function useDeleteResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/resumes/${id}`);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
        },
    });
}

export function useDuplicateResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.post<{ data: Resume }>(`/resumes/${id}/duplicate`);
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
}

export function useRestoreVersion(resumeId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (versionId: string) => {
            const { data } = await api.post<{ data: Resume }>(
                `/resumes/${resumeId}/versions/${versionId}/restore`,
            );
            return data.data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(['resumes', resumeId], updated);
            queryClient.invalidateQueries({ queryKey: ['resumes', resumeId, 'versions'] });
        },
    });
}
