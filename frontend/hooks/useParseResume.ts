'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Resume } from '@/types/resume';

interface ParseResumePayload {
    file: File;
    title: string;
    templateId: string;
}

export function useParseResume() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: ParseResumePayload) => {
            const formData = new FormData();
            formData.append('resume', payload.file);
            formData.append('title', payload.title);
            formData.append('templateId', payload.templateId);

            const { data } = await api.post<{ data: Resume }>(
                '/resumes/parse-upload',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    timeout: 60000, // 60s — AI parsing can take time
                },
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['resumes'] });
            queryClient.invalidateQueries({ queryKey: ['credits'] });
        },
    });
}
