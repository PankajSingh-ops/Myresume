'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { FileSearch, Target, FileText, ArrowRight, Loader2, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUserScans } from '@/lib/api/ats';

export default function AtsScannerPage() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['ats-scans', 1, 3], // Get last 3
        queryFn: () => getUserScans(1, 3),
    });

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Smart ATS Scanner</h2>
                    <p className="text-muted-foreground mt-1">
                        Analyze your resume and see how it matches up against Applicant Tracking Systems and job requirements.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Resume Scanner Card */}
                <Card className="flex flex-col relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileSearch className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
                            <FileSearch className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">ATS Resume Scanner</CardTitle>
                        <CardDescription className="text-base text-balance max-w-sm mt-1.5">
                            Get an instant score on how well your resume is formatted for ATS systems. We'll check for missing sections, keyword optimization, and formatting issues.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Comprehensive score (0-100)
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Formatting and syntax checks
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Actionable improvement tips
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full sm:w-auto" size="lg">
                            <Link href="/ats-scanner/resume-scan">
                                Start Resume Scan <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>

                {/* Job Match Card */}
                <Card className="flex flex-col relative overflow-hidden group border-primary/20 hover:border-primary/50 transition-colors">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-32 h-32" />
                    </div>
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-4">
                            <Target className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl">Job Match Analyzer</CardTitle>
                        <CardDescription className="text-base text-balance max-w-sm mt-1.5">
                            Compare your resume side-by-side with a specific job description. Find missing keywords and get tailoring suggestions.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <ul className="space-y-2.5 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Detailed match percentage percentage
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Missing keyword identification
                            </li>
                            <li className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                Targeted tailoring recommendations
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild className="w-full sm:w-auto" variant="secondary" size="lg">
                            <Link href="/ats-scanner/job-match">
                                Start Job Match <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="mt-12 space-y-6">
                <div>
                    <h3 className="text-xl font-semibold tracking-tight">Recent Scans</h3>
                    <p className="text-sm text-muted-foreground mt-1">Review your most recent ATS activity.</p>
                </div>

                {isLoading ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <p className="text-sm">Loading history...</p>
                        </div>
                    </div>
                ) : isError ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-destructive bg-destructive/5">
                        <p className="text-sm font-medium">Failed to load scan history.</p>
                    </div>
                ) : !data?.scans?.length ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed">
                        <p className="text-sm text-muted-foreground">You haven't performed any ATS scans yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {data.scans.map((scan) => (
                            <Card key={scan.id} className="flex flex-col">
                                <CardHeader className="p-4 pb-2">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                                {scan.scan_type === 'resume_only' ? (
                                                    <FileSearch className="w-4 h-4" />
                                                ) : (
                                                    <Target className="w-4 h-4" />
                                                )}
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {scan.scan_type === 'resume_only' ? 'Resume Scan' : 'Job Match'}
                                            </Badge>
                                        </div>
                                        <Badge variant={(() => {
                                            const score = scan.scan_type === 'job_match' && scan.match_score != null
                                                ? scan.match_score
                                                : scan.overall_score;
                                            return score > 70 ? 'default' : score > 40 ? 'secondary' : 'destructive';
                                        })()}>
                                            {scan.scan_type === 'job_match' && scan.match_score != null
                                                ? `${scan.match_score}/100`
                                                : `${scan.overall_score}/100`}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-2 flex-1">
                                    <div className="space-y-2 mt-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <FileText className="w-3.5 h-3.5" />
                                            <span className="truncate">{scan.resume_filename}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Button variant="ghost" size="sm" className="w-full text-xs" asChild>
                                        <Link href={`/ats-scanner/${scan.scan_type === 'resume_only' ? 'resume-scan' : 'job-match'}?id=${scan.id}`}>
                                            View Full Report
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
