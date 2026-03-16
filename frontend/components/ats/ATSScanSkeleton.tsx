'use client';

import { cn } from '@/lib/utils';

function Bone({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'rounded-md bg-muted animate-pulse',
                className
            )}
        />
    );
}

/**
 * ATSScanSkeleton – mimics the results layout while scanning is in progress.
 * Pass variant="resume" for the resume scan page, "job-match" for the job-match page.
 */
export function ATSScanSkeleton({ variant = 'resume' }: { variant?: 'resume' | 'job-match' }) {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-300">
            {/* Top: Score & Summary card */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-card border rounded-2xl p-8 shadow-sm">
                {/* Gauge placeholder */}
                <div className="shrink-0">
                    <div className="w-36 h-36 rounded-full border-10 border-muted animate-pulse" />
                </div>
                {/* Summary block */}
                <div className="space-y-3 flex-1 w-full">
                    <Bone className="h-4 w-24" />
                    <Bone className="h-7 w-48" />
                    <Bone className="h-4 w-full" />
                    <Bone className="h-4 w-5/6" />
                    <Bone className="h-4 w-4/6" />
                </div>
            </div>

            {variant === 'resume' ? (
                <>
                    {/* Category breakdown (2×2 grid) */}
                    <div className="space-y-4">
                        <Bone className="h-6 w-48" />
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-card border rounded-xl p-5 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Bone className="h-4 w-32" />
                                        <Bone className="h-6 w-12 rounded-full" />
                                    </div>
                                    <Bone className="h-2 w-full rounded-full" />
                                    <Bone className="h-3 w-full" />
                                    <Bone className="h-3 w-4/5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sections & Keywords (two-col) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Bone className="h-6 w-40" />
                            <div className="bg-card border rounded-xl p-5 space-y-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="flex justify-between">
                                        <Bone className="h-4 w-28" />
                                        <Bone className="h-5 w-5 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <Bone className="h-6 w-40" />
                            <div className="bg-card border rounded-xl p-5 space-y-4">
                                <Bone className="h-4 w-44" />
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <Bone key={i} className="h-6 w-20 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Improvements */}
                    <div className="space-y-4">
                        <Bone className="h-6 w-60" />
                        <div className="space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-card border rounded-xl p-5 space-y-2">
                                    <Bone className="h-5 w-48" />
                                    <Bone className="h-3 w-full" />
                                    <Bone className="h-3 w-3/4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    {/* Job match: Two-column keyword + skills */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Bone className="h-6 w-36" />
                                <div className="bg-card border rounded-xl p-5 space-y-4">
                                    <Bone className="h-4 w-32" />
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <Bone key={j} className="h-6 w-20 rounded-full" />
                                        ))}
                                    </div>
                                    <div className="border-t pt-4 space-y-3">
                                        <Bone className="h-4 w-28" />
                                        <div className="flex flex-wrap gap-2">
                                            {Array.from({ length: 4 }).map((_, j) => (
                                                <Bone key={j} className="h-6 w-24 rounded-full" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Experience & Education (2 cards) */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="bg-card border rounded-xl p-5 space-y-3">
                                <Bone className="h-5 w-36" />
                                <Bone className="h-4 w-full" />
                                <Bone className="h-4 w-4/5" />
                                <Bone className="h-4 w-3/5" />
                            </div>
                        ))}
                    </div>

                    {/* Strengths / Concerns */}
                    <div className="space-y-4">
                        <Bone className="h-6 w-36" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-card border rounded-xl p-5 space-y-2">
                                <Bone className="h-5 w-48" />
                                <Bone className="h-3 w-full" />
                                <Bone className="h-3 w-3/4" />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
