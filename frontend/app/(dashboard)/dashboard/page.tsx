'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Sparkles,
    LayoutTemplate,
    User,
    ArrowRight,
    Loader2,
    Shield,
    Clock,
    Plus,
    PaperclipIcon,
    Mail,
    ScanSearch,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import { useResumes } from '@/hooks/useResume';
import { useCoverLetters } from '@/hooks/useCoverLetter';
import { getUserScans } from '@/lib/api/ats';
import { useAuthStore } from '@/store/authStore';
import { useCreditsStore } from '@/store/creditsStore';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
    const router = useRouter();
    const { data: resumes, isLoading } = useResumes();
    const { data: coverLetters, isLoading: isCoverLettersLoading } = useCoverLetters();
    const { data: atsData, isLoading: isAtsLoading } = useQuery({
        queryKey: ['ats-scans-count'],
        queryFn: () => getUserScans(1, 1),
    });
    const user = useAuthStore((s) => s.user);
    const balance = useCreditsStore((s) => s.balance);

    const recentResumes = resumes
        ? [...resumes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3)
        : [];

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-10">
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Here&apos;s an overview of your resume building progress.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button onClick={() => router.push('/resumes')} variant="outline" className="hidden sm:flex">
                        View All Resumes
                    </Button>
                    <Button onClick={() => router.push('/resumes/templates')} className="gap-2 shadow-sm">
                        <Plus className="h-4 w-4" />
                        New Resume
                    </Button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Resumes</CardTitle>
                        <FileText className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : resumes?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {resumes?.length === 1 ? '1 active resume' : `${resumes?.length || 0} active resumes`}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Cover Letters</CardTitle>
                        <Mail className="h-4 w-4 text-violet-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isCoverLettersLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : coverLetters?.length || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {coverLetters?.length === 1 ? '1 cover letter' : `${coverLetters?.length || 0} cover letters`}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">ATS Scans</CardTitle>
                        <ScanSearch className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{isAtsLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : atsData?.total || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {(atsData?.total || 0) === 1 ? '1 scan performed' : `${atsData?.total || 0} scans performed`}
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available Credits</CardTitle>
                        <Sparkles className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{balance}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            For AI writing and PDF exports
                        </p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm sm:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Account Status</CardTitle>
                        {user?.isEmailVerified ? (
                            <Shield className="h-4 w-4 text-green-500" />
                        ) : (
                            <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{user?.role || 'User'}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {user?.isEmailVerified ? 'Email verified' : 'Email unverified'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Resumes Section */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold tracking-tight">Recent Resumes</h2>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/resumes')} className="text-primary hover:text-primary/80">
                            See all <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm h-64">
                                    <Skeleton className="h-40 w-full rounded-none" />
                                    <div className="space-y-2 p-4">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-3 w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : recentResumes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {recentResumes.map((resume) => (
                                <ResumeCard key={resume.id} resume={resume} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 py-12 px-4 text-center">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                <FileText className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold">No resumes found</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-xs">
                                Create your first professional resume in minutes using our tailored templates.
                            </p>
                            <Button onClick={() => router.push('/resumes/templates')}>
                                <PaperclipIcon className="mr-2 h-4 w-4" />
                                Create Resume
                            </Button>
                        </div>
                    )}
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
                    <div className="flex flex-col gap-3">
                        <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => router.push('/resumes/templates')}>
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <LayoutTemplate className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Browse Templates</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Start with a professional design</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => router.push('/cover-letters')}>
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-violet-500/10 p-2 rounded-lg">
                                        <Mail className="h-5 w-5 text-violet-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Cover Letters</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Create or manage cover letters</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => router.push('/ats-scanner')}>
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-500/10 p-2 rounded-lg">
                                        <ScanSearch className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">ATS Scanner</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Check resume compatibility</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => router.push('/profile')}>
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-2 rounded-lg">
                                        <User className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Edit Profile</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Manage details and passwords</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>

                        <Card className="hover:border-primary/50 transition-colors shadow-sm cursor-pointer" onClick={() => router.push('/pricing')}>
                            <CardHeader className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-500/10 p-2 rounded-lg">
                                        <Sparkles className="h-5 w-5 text-amber-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Buy Credits</CardTitle>
                                        <CardDescription className="text-xs mt-0.5">Top-up for AI features</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
