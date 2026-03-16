'use client';

import { useRouter } from 'next/navigation';
import { Plus, FileText, Sparkles } from 'lucide-react';

import { useCoverLetters } from '@/hooks/useCoverLetter';
import { useCreditsStore } from '@/store/creditsStore';
import { CreditBadge } from '@/components/credits/CreditBadge';
import { CoverLetterCard } from '@/components/cover-letter/CoverLetterCard';
import { InsufficientCreditsModal } from '@/components/credits/InsufficientCreditsModal';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

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
            <h3 className="text-xl font-semibold">No cover letters yet</h3>
            <p className="mt-2 mb-6 max-w-sm text-sm text-muted-foreground">
                Create your first professional cover letter in minutes. Choose a template and start
                filling in your details.
            </p>
            <Button size="lg" onClick={onCreateClick} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Create your first cover letter — 20 credits
            </Button>
        </div>
    );
}

export default function CoverLettersPage() {
    const { data: coverLetters, isLoading } = useCoverLetters();
    const router = useRouter();

    const handleNewCoverLetter = () => {
        router.push('/cover-letters/templates');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold tracking-tight">My Cover Letters</h1>
                    <CreditBadge />
                </div>
                <Button onClick={handleNewCoverLetter} className="gap-2 cursor-pointer shadow-sm">
                    <Plus className="h-4 w-4" />
                    New Cover Letter — 20 credits
                </Button>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            )}

            {!isLoading && coverLetters && coverLetters.length === 0 && (
                <EmptyState onCreateClick={handleNewCoverLetter} />
            )}

            {!isLoading && coverLetters && coverLetters.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {coverLetters.map((cl) => (
                        <CoverLetterCard key={cl.id} coverLetter={cl} />
                    ))}
                </div>
            )}

            <InsufficientCreditsModal />
        </div>
    );
}
