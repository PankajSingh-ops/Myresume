'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Receipt, Settings as SettingsIcon, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { format } from 'date-fns';

import { useCreditsStore } from '@/store/creditsStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CREDIT_COSTS } from '@/types/credits';
export default function SettingsPage() {
    const user = useAuthStore((s) => s.user);
    const balance = useCreditsStore((s) => s.balance);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Fetch transactions using React Query for caching, automatic state management, and refetching
    const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['billingHistory'],
        queryFn: async () => {
            const { data } = await api.get('/payments/history?limit=5');
            return data.data || [];
        }
    });

    const transactions = transactionsData || [];

    // Prevent hydration mismatch by only rendering theme selector after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings & Billing</h1>
                <p className="text-muted-foreground mt-1">Manage your account preferences and AI credits.</p>
            </div>

            {/* Current Balance Overview */}
            <Card className="border-primary/20 bg-primary/5 shadow-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        AI Credits Balance
                    </CardTitle>
                    <CardDescription>
                        Credits are used for AI suggestions, bullet generation, and exporting PDFs.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
                        <div>
                            <span className="text-5xl font-bold tracking-tight">{balance ?? '...'}</span>
                            <span className="text-muted-foreground ml-2 font-medium">Credits Available</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm max-w-lg w-full">
                            <div className="flex items-center justify-between bg-background px-3 py-2 rounded-md border">
                                <span className="text-muted-foreground">PDF Export</span>
                                <span className="font-semibold">{CREDIT_COSTS.PDF_EXPORT} cr</span>
                            </div>
                            <div className="flex items-center justify-between bg-background px-3 py-2 rounded-md border">
                                <span className="text-muted-foreground">AI Assist</span>
                                <span className="font-semibold">{CREDIT_COSTS.AI_SUGGESTION} cr</span>
                            </div>
                            <div className="flex items-center justify-between bg-background px-3 py-2 rounded-md border">
                                <span className="text-muted-foreground">Create Resume</span>
                                <span className="font-semibold">{CREDIT_COSTS.RESUME_CREATE} cr</span>
                            </div>
                            <div className="flex items-center justify-between bg-background px-3 py-2 rounded-md border">
                                <span className="text-muted-foreground">Cover Letter</span>
                                <span className="font-semibold">{CREDIT_COSTS.COVER_LETTER_CREATE} cr</span>
                            </div>
                            <div className="flex items-center justify-between bg-background px-3 py-2 rounded-md border">
                                <span className="text-muted-foreground">ATS Scan</span>
                                <span className="font-semibold">{CREDIT_COSTS.ATS_SCAN} cr</span>
                            </div>
                            <div className="flex items-center justify-between bg-background px-3 py-2 rounded-md border">
                                <span className="text-muted-foreground">Full Rewrite</span>
                                <span className="font-semibold">{CREDIT_COSTS.AI_FULL_REWRITE} cr</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>



            {/* Other Settings Sections Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                <Card className="flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-muted-foreground" />
                            Billing History
                        </CardTitle>
                        <CardDescription>View your past purchases and exports.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto pr-2 max-h-[300px]">
                        {isLoadingTransactions ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                <p>Loading history...</p>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-6 text-center text-sm text-muted-foreground">
                                <Receipt className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p>No billing history available yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map((tx: any) => (
                                    <div key={tx.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                        <div>
                                            <p className="font-medium text-sm">
                                                {tx.planId ? `${tx.planId} Plan` : 'Credits Purchase'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(tx.createdAt), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            <p className="font-semibold text-sm flex items-center gap-1">
                                                ${(tx.amount / 100).toFixed(2)}
                                            </p>
                                            <Badge variant={tx.status === 'completed' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'} className="text-[10px] px-1 py-0 h-4 mt-1">
                                                {tx.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <SettingsIcon className="h-5 w-5 text-muted-foreground" />
                            Preferences
                        </CardTitle>
                        <CardDescription>App settings and notification preferences.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Theme Preference</p>
                                    <p className="text-xs text-muted-foreground">Customize your viewing experience.</p>
                                </div>
                                {mounted && (
                                    <Select value={theme} onValueChange={(t) => setTheme(t)}>
                                        <SelectTrigger className="w-[140px]">
                                            <SelectValue placeholder="Select theme" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="system">
                                                <div className="flex items-center gap-2">
                                                    <Monitor className="h-4 w-4" /> System
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="light">
                                                <div className="flex items-center gap-2">
                                                    <Sun className="h-4 w-4" /> Light
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="dark">
                                                <div className="flex items-center gap-2">
                                                    <Moon className="h-4 w-4" /> Dark
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-sm">Email Notifications</p>
                                    <p className="text-xs text-muted-foreground">Receive product updates and tips.</p>
                                </div>

                                <div className="relative inline-flex h-5 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-full bg-muted">
                                    <span className="translate-x-0 inline-block h-4 w-4 transform rounded-full bg-background ring-0 transition duration-200 ease-in-out" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
