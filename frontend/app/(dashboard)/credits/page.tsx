'use client';

import { useState, useEffect } from 'react';
import { Coins, ChevronLeft, ChevronRight, Loader2, Share2, Copy, Check, Gift, Users } from 'lucide-react';
import { useBalance, useCreditHistory } from '@/hooks/useCredits';
import { useReferralStats } from '@/hooks/useReferrals';
import { formatCredits, formatDate, cn } from '@/lib/utils';
import { CREDIT_COSTS } from '@/types/credits';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// ── Type label mapping ───────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
    signup_bonus: 'Welcome Bonus',
    resume_create: 'Resume Created',
    resume_duplicate: 'Resume Duplicated',
    pdf_export: 'PDF Export',
    ai_suggestion: 'AI Suggestion',
    ai_full_rewrite: 'AI Rewrite',
    admin_grant: 'Admin Grant',
    refund: 'Refund',
    referral_bonus: 'Referral Bonus',
    referee_bonus: 'Referee Bonus',
};

const POSITIVE_TYPES = new Set(['signup_bonus', 'refund', 'admin_grant', 'referral_bonus', 'referee_bonus']);

// ── Cost breakdown ───────────────────────────────────────────────────

const costBreakdown = [
    { action: 'Create Resume', cost: CREDIT_COSTS.RESUME_CREATE },
    { action: 'Create Cover Letter', cost: CREDIT_COSTS.COVER_LETTER_CREATE },
    { action: 'Duplicate Resume', cost: CREDIT_COSTS.RESUME_CREATE },
    { action: 'Export PDF', cost: CREDIT_COSTS.PDF_EXPORT },
    { action: 'ATS Scan', cost: CREDIT_COSTS.ATS_SCAN },
    { action: 'AI Improve Bullet', cost: CREDIT_COSTS.AI_SUGGESTION },
    { action: 'AI Full Rewrite', cost: CREDIT_COSTS.AI_FULL_REWRITE },
];

export default function CreditsPage() {
    const [page, setPage] = useState(1);
    const [copied, setCopied] = useState(false);
    const LIMIT = 10;

    const { data: balanceData, isLoading: balanceLoading } = useBalance();
    const { data: historyData, isLoading: historyLoading } = useCreditHistory(
        page,
        LIMIT,
    );
    const { data: referralData, isLoading: referralLoading } = useReferralStats();

    const balance = balanceData?.balance ?? 0;
    const transactions = historyData?.transactions ?? [];
    const total = historyData?.total ?? 0;
    const totalPages = Math.ceil(total / LIMIT) || 1;

    const copyReferralLink = async () => {
        if (!referralData?.referralLink) return;
        await navigator.clipboard.writeText(referralData.referralLink);
        setCopied(true);
    };

    useEffect(() => {
        if (copied) {
            const t = setTimeout(() => setCopied(false), 2000);
            return () => clearTimeout(t);
        }
    }, [copied]);

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Credits</h1>

            {/* ── Balance card ────────────────────────────────────────── */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader className="pb-3">
                        <CardDescription>Available Balance</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {balanceLoading ? (
                            <Skeleton className="h-12 w-40" />
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <Coins className="h-8 w-8 text-primary" />
                                <span className="text-4xl font-bold tabular-nums">
                                    {balance}
                                </span>
                                <span className="text-lg text-muted-foreground">credits</span>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Cost breakdown table ──────────────────────────────── */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Credit Costs</CardTitle>
                        <CardDescription>How credits are spent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                    <th className="pb-2">Action</th>
                                    <th className="pb-2 text-right">Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {costBreakdown.map(({ action, cost }) => (
                                    <tr key={action} className="border-b last:border-0">
                                        <td className="py-2">{action}</td>
                                        <td className="py-2 text-right font-medium">
                                            {formatCredits(cost)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>

            {/* ── Referral sharing card ───────────────────────────────── */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        <CardTitle>Refer a Friend</CardTitle>
                    </div>
                    <CardDescription>
                        Share your referral link and earn <strong>100 credits</strong> for every friend who signs up. They get <strong>50 credits</strong> too!
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {referralLoading ? (
                        <Skeleton className="h-12 w-full" />
                    ) : referralData?.referralLink ? (
                        <>
                            {/* Copy link row */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm font-mono truncate select-all">
                                    {referralData.referralLink}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 gap-1.5"
                                    onClick={copyReferralLink}
                                >
                                    {copied ? (
                                        <><Check className="h-4 w-4 text-green-500" /> Copied</>
                                    ) : (
                                        <><Copy className="h-4 w-4" /> Copy</>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="shrink-0 gap-1.5"
                                    onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({
                                                title: 'Join me on MyResume!',
                                                text: 'Sign up with my link and get 50 bonus credits!',
                                                url: referralData.referralLink!,
                                            });
                                        } else {
                                            copyReferralLink();
                                        }
                                    }}
                                >
                                    <Share2 className="h-4 w-4" /> Share
                                </Button>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="rounded-lg border p-3 text-center">
                                    <Users className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                                    <p className="text-2xl font-bold tabular-nums">
                                        {referralData.successfulReferrals}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Successful</p>
                                </div>
                                <div className="rounded-lg border p-3 text-center">
                                    <Loader2 className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                                    <p className="text-2xl font-bold tabular-nums">
                                        {referralData.pendingReferrals}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Pending</p>
                                </div>
                                <div className="rounded-lg border p-3 text-center">
                                    <Coins className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
                                    <p className="text-2xl font-bold tabular-nums">
                                        {referralData.totalCreditsEarned}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Credits Earned</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">Referral link not available yet.</p>
                    )}
                </CardContent>
            </Card>

            {/* ── Transaction history ─────────────────────────────────── */}
            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent credit activity</CardDescription>
                </CardHeader>
                <CardContent>
                    {historyLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : transactions.length === 0 ? (
                        <p className="py-12 text-center text-sm text-muted-foreground">
                            No transactions yet.
                        </p>
                    ) : (
                        <>
                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            <th className="pb-2 pr-4">Date</th>
                                            <th className="pb-2 pr-4">Type</th>
                                            <th className="pb-2 pr-4">Description</th>
                                            <th className="pb-2 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.map((tx) => {
                                            const isPositive =
                                                POSITIVE_TYPES.has(tx.action) || tx.amount > 0;

                                            return (
                                                <tr
                                                    key={tx.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="py-3 pr-4 whitespace-nowrap text-muted-foreground">
                                                        {formatDate(tx.createdAt)}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        <Badge
                                                            variant={isPositive ? 'default' : 'secondary'}
                                                            className={cn(
                                                                'text-xs',
                                                                isPositive
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-400'
                                                                    : 'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-400',
                                                            )}
                                                        >
                                                            {TYPE_LABELS[tx.action] || tx.action}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 pr-4 text-muted-foreground">
                                                        {tx.description}
                                                    </td>
                                                    <td
                                                        className={cn(
                                                            'py-3 text-right font-medium tabular-nums',
                                                            isPositive
                                                                ? 'text-green-600 dark:text-green-400'
                                                                : 'text-red-600 dark:text-red-400',
                                                        )}
                                                    >
                                                        {isPositive ? '+' : ''}
                                                        {tx.amount}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Page {page} of {totalPages}
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page <= 1}
                                            onClick={() => setPage((p) => p - 1)}
                                        >
                                            <ChevronLeft className="mr-1 h-4 w-4" /> Prev
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={page >= totalPages}
                                            onClick={() => setPage((p) => p + 1)}
                                        >
                                            Next <ChevronRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
