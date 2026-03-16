'use client';

import Link from 'next/link';
import { Coins, AlertTriangle } from 'lucide-react';
import { useCreditsStore } from '@/store/creditsStore';
import { formatCredits } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function CreditBadge() {
    const balance = useCreditsStore((s) => s.balance);

    if (balance === null) return null;

    const colorClass =
        balance >= 50
            ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-400'
            : balance >= 20
                ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-400'
                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400';

    return (
        <Link href="/pricing" className="inline-block">
            <Badge
                variant="outline"
                className={cn('gap-1.5 px-2.5 py-1 transition-all cursor-pointer hover:opacity-80 hover:scale-105', colorClass)}
            >
                {balance < 20 ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                    <Coins className="h-3.5 w-3.5" />
                )}
                <span className="text-xs font-medium">
                    {balance < 20 ? 'Low credits · ' : ''}
                    {formatCredits(balance)}
                </span>
            </Badge>
        </Link>
    );
}
