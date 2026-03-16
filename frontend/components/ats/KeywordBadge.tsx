import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type KeywordVariant = 'matched' | 'missing' | 'warning';
export type KeywordImportance = 'High' | 'Medium' | 'Low';

interface KeywordBadgeProps {
    keyword: string;
    variant: KeywordVariant;
    importance?: KeywordImportance;
    className?: string;
}

export function KeywordBadge({ keyword, variant, importance, className }: KeywordBadgeProps) {
    // Styles based on variant
    const variantStyles = {
        matched: 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/50',
        missing: 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800 dark:hover:bg-yellow-900/50',
    };

    // Dot color based on importance
    const importanceDotColors = {
        High: 'bg-red-500',
        Medium: 'bg-yellow-500',
        Low: 'bg-blue-500',
    };

    return (
        <Badge
            variant="outline"
            className={cn(
                'font-medium rounded-full px-2.5 py-1 flex items-center gap-1.5 transition-colors',
                variantStyles[variant],
                className
            )}
        >
            {importance && (
                <span
                    className={cn(
                        'inline-block h-2 w-2 rounded-full shrink-0',
                        importanceDotColors[importance]
                    )}
                    aria-hidden="true"
                />
            )}
            <span>{keyword}</span>
        </Badge>
    );
}
