'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useResumeStore } from '@/store/resumeStore';
import { RichTextEditor } from '@/components/resume/RichTextEditor';
import { AIImproveButton } from '@/components/resume/AIImproveButton';
import { useImproveSummary } from '@/hooks/useAI';
import { Label } from '@/components/ui/label';

// Zod schema for local form validation
const summarySchema = z.object({
    summary: z.string().optional(),
});

type FormValues = z.infer<typeof summarySchema>;

export function SummaryForm() {
    const currentResume = useResumeStore((s) => s.currentResume);
    const updateCurrentResume = useResumeStore((s) => s.updateCurrentResume);
    const improveSummaryMutation = useImproveSummary();

    const defaultValues = { summary: currentResume?.content?.personalInfo?.summary || '' };

    const {
        watch,
        setValue,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        resolver: zodResolver(summarySchema),
        defaultValues,
    });

    const summaryValue = watch('summary');

    // Auto-update store on form changes
    useEffect(() => {
        const subscription = watch((value) => {
            updateCurrentResume({
                content: {
                    ...currentResume?.content,
                    personalInfo: {
                        ...currentResume?.content?.personalInfo,
                        summary: value.summary || ''
                    }
                }
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, currentResume, updateCurrentResume]);

    // Reset when resume ID changes
    useEffect(() => {
        if (currentResume?.content?.personalInfo) {
            reset({ summary: currentResume.content.personalInfo.summary || '' });
        }
    }, [currentResume?.id, reset]);

    const handleImprove = async () => {
        if (!summaryValue) return;

        const role = currentResume?.content?.personalInfo?.title || 'Professional';

        try {
            const improvedText = await improveSummaryMutation.mutateAsync({
                summary: summaryValue,
                role
            });
            setValue('summary', improvedText, { shouldDirty: true, shouldTouch: true });
        } catch (error) {
            throw error; // Rethrow to let AIImproveButton trigger the optimistic revert & toast
        }
    };

    return (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center justify-between">
                <Label htmlFor="summary-editor" className="text-sm font-medium">Professional Summary</Label>
                <AIImproveButton
                    label="✨ Improve Summary (2 credits)"
                    cost={2}
                    onImprove={handleImprove}
                    disabled={!summaryValue || summaryValue.length < 10}
                />
            </div>

            <p className="text-xs text-muted-foreground">
                Write a short paragraph summarizing your career, key skills, and goals.
            </p>

            <RichTextEditor
                value={summaryValue || ''}
                onChange={(val) => setValue('summary', val, { shouldDirty: true })}
            />
            {errors.summary && <p className="text-xs text-destructive">{errors.summary.message}</p>}
        </form>
    );
}
