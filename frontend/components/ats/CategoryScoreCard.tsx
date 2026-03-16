import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface CategoryScoreCardProps {
    category: string;
    score: number;
    label: string;
    feedback: string;
    className?: string;
}

export function CategoryScoreCard({
    category,
    score,
    label,
    feedback,
    className
}: CategoryScoreCardProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Trigger CSS animated progress bar on mount
    useEffect(() => {
        const timer = setTimeout(() => setAnimatedScore(score), 100);
        return () => clearTimeout(timer);
    }, [score]);

    // Determine color based on score
    let badgeColor = 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    let progressIndicatorClass = 'bg-red-500';

    if (score > 70) {
        badgeColor = 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        progressIndicatorClass = 'bg-green-500';
    } else if (score > 40) {
        badgeColor = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
        progressIndicatorClass = 'bg-yellow-500';
    }

    // Format category name (e.g., ats_compatibility -> ATS Compatibility)
    const formattedCategory = category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <Card className={cn('overflow-hidden', className)}>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold">{formattedCategory}</CardTitle>
                    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', badgeColor)}>
                        {label}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-sm font-medium">
                            <span>Score</span>
                            <span>{score}/100</span>
                        </div>
                        {/* Custom progress implementation to easily swap indicator color */}
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                            <div
                                className={cn('h-full w-full flex-1 transition-all duration-1000 ease-out', progressIndicatorClass)}
                                style={{ transform: `translateX(-${100 - animatedScore}%)` }}
                            />
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {feedback}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
