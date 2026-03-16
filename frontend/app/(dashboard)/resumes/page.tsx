'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Sparkles } from 'lucide-react';

import { useResumes } from '@/hooks/useResume';
import { useCreditsStore } from '@/store/creditsStore';
import { CreditBadge } from '@/components/credits/CreditBadge';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { CreateResumeDialog } from '@/components/resume/CreateResumeDialog';
import { InsufficientCreditsModal } from '@/components/credits/InsufficientCreditsModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CREDIT_COSTS } from '@/types/credits';

function SkeletonCard() {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
            <Skeleton className="h-40 w-full rounded-none" />
            <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/30 py-20 px-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No resumes yet</h3>
            <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
                Create your first professional resume in minutes. Choose a template and start
                filling in your details.
            </p>
            <Button size="lg" onClick={onCreateClick} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create your first resume — 20 credits
            </Button>
        </div>
    );
}

export default function ResumesPage() {
    const { data: resumes, isLoading } = useResumes();
    const balance = useCreditsStore((s) => s.balance);
    const openInsufficientModal = useCreditsStore((s) => s.openInsufficientModal);

    const router = useRouter();

    const handleNewResume = () => {
        router.push('/resumes/templates');
    };

    return (
        <div className="space-y-6">
            {/* Header row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">My Resumes</h1>
                    <CreditBadge />
                </div>
                <Button onClick={handleNewResume} className="gap-2 cursor-pointer shadow-sm">
                    <Plus className="h-4 w-4" />
                    New Resume — 20 credits
                </Button>
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {/* Empty state */}
            {!isLoading && resumes && resumes.length === 0 && (
                <EmptyState onCreateClick={handleNewResume} />
            )}

            {/* Resume grid */}
            {!isLoading && resumes && resumes.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume} />
                    ))}
                </div>
            )}

            {/* Dialogs */}
            <InsufficientCreditsModal />
        </div>
    );
}
