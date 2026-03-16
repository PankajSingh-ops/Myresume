'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, Target, Briefcase, FileText, CheckCircle2, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useATSStore } from '@/store/atsStore';
import { ResumeUploadZone } from '@/components/ats/ResumeUploadZone';
import { ScoreGauge } from '@/components/ats/ScoreGauge';
import { KeywordBadge, KeywordImportance, KeywordVariant } from '@/components/ats/KeywordBadge';
import { ImprovementCard, SeverityLevel } from '@/components/ats/ImprovementCard';
import { ATSScanSkeleton } from '@/components/ats/ATSScanSkeleton';
import { getScanById } from '@/lib/api/ats';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { toast } from 'sonner';
import type { ATSJobMatchResult } from '@/types/ats';

function downloadJobMatchReport(result: ATSJobMatchResult) {
    const lines: string[] = [
        '═══════════════════════════════════════════',
        '        ATS JOB MATCH REPORT',
        '═══════════════════════════════════════════',
        '',
        `Match Score: ${result.match_score}/100  (${result.match_label})`,
        `Hiring Likelihood: ${result.hiring_likelihood}`,
        '',
        '── Executive Summary ───────────────────────',
        result.executive_summary,
        '',
        `── Keyword Analysis (${result.keyword_analysis.match_percentage}% match) ──`,
        '',
        'Matched Keywords:',
        ...result.keyword_analysis.matched_keywords.map(
            (k) => `  \u2714 ${k.keyword} [${k.importance}]`
        ),
        '',
        'Missing Keywords:',
        ...result.keyword_analysis.missing_keywords.map(
            (k) => `  \u2718 ${k.keyword} [${k.importance}] — ${k.context}`
        ),
        '',
        '── Skills Analysis ─────────────────────────',
        `Matched: ${result.skills_analysis.matched_skills.join(', ') || 'None'}`,
        `Missing Required: ${result.skills_analysis.missing_required_skills.join(', ') || 'None'}`,
        `Missing Preferred: ${result.skills_analysis.missing_preferred_skills.join(', ') || 'None'}`,
        `Bonus Skills: ${result.skills_analysis.bonus_skills.join(', ') || 'None'}`,
        '',
        '── Experience ───────────────────────────────',
        `Required: ${result.experience_analysis.years_required} years`,
        `You have: ${result.experience_analysis.years_candidate_has} years`,
        `Match: ${result.experience_analysis.experience_match ? 'Yes' : 'No'}`,
        result.experience_analysis.relevant_experience_summary,
        ...(result.experience_analysis.experience_gaps.length > 0
            ? ['Gaps:', ...result.experience_analysis.experience_gaps.map((g) => `  • ${g}`)]
            : []),
        '',
        '── Education ────────────────────────────────',
        `Required: ${result.education_analysis.required}`,
        `You have: ${result.education_analysis.candidate_has}`,
        `Match: ${result.education_analysis.education_match ? 'Yes' : 'No'}`,
        '',
        '── Key Strengths ────────────────────────────',
        ...result.positives.map((p) => `  \u2714 ${p.title}: ${p.description}`),
        '',
        '── Areas of Concern ─────────────────────────',
        ...result.negatives.map(
            (n) => `  [${n.severity}] ${n.title}\n    ${n.description}\n    How to address: ${n.how_to_address}`
        ),
        '',
        '── Tailoring Suggestions ────────────────────',
        ...result.resume_tailoring_suggestions.map(
            (s, i) => `  ${i + 1}. [${s.section}] ${s.current_issue}\n     \u2192 ${s.suggested_action}`
        ),
        '',
        '── Interview Talking Points ─────────────────',
        ...result.interview_talking_points.map((p) => `  • ${p}`),
        '',
        '── Overall Recommendation ───────────────────',
        result.overall_recommendation,
        '',
        `Generated on ${new Date().toLocaleString()}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-job-match-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

const jobDescriptionSchema = z.string()
    .min(50, 'Job description must be at least 50 characters.')
    .max(5000, 'Job description must not exceed 5000 characters.');

export default function JobMatchPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scanId = searchParams.get('id');
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');

    const {
        isScanning,
        matchResult: storeResult,
        runJobMatch,
        clearResults
    } = useATSStore();

    // Fetch saved scan when navigating from history
    const { data: fetchedScan, isLoading: isFetchingReport } = useQuery({
        queryKey: ['ats-scan', scanId],
        queryFn: () => getScanById(scanId!),
        enabled: !!scanId,
    });

    // Use store result (fresh scan) or fetched result (history)
    const matchResult = storeResult ?? (fetchedScan?.result as ATSJobMatchResult | undefined) ?? null;

    const handleScan = () => {
        if (!file) {
            toast.error('Please upload a resume to match against.');
            return;
        }

        try {
            jobDescriptionSchema.parse(jobDescription);
            runJobMatch(file, jobDescription);
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast.error(error.issues[0].message);
            }
        }
    };

    const handleBack = () => {
        clearResults();
        router.push('/ats-scanner');
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Job Match Analyzer</h1>
                        <p className="text-sm text-muted-foreground">
                            Compare your resume against a specific job description
                        </p>
                    </div>
                </div>
                {matchResult && (
                    <Button variant="outline" size="sm" onClick={() => downloadJobMatchReport(matchResult)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden grid md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr]">
                {/* Left Panel: Inputs & Controls */}
                <div className="h-full border-r bg-muted/10 overflow-y-auto p-6 flex flex-col">
                    <div className="space-y-6 flex-1">
                        <div className="space-y-4">
                            <div>
                                <Label className="text-base">1. Upload Resume</Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    The resume you want to tailor for this job.
                                </p>
                            </div>
                            <ResumeUploadZone
                                onFileSelect={setFile}
                                isLoading={isScanning}
                            />
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label className="text-base">2. Paste Job Description</Label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Copy and paste the full job posting here.
                                </p>
                            </div>
                            <div className="relative">
                                <Textarea
                                    placeholder="Paste job description here..."
                                    className="min-h-[250px] resize-none pb-8 bg-background border-muted-foreground/30 focus-visible:ring-primary/50"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    disabled={isScanning}
                                />
                                <div className="absolute bottom-2 right-3 text-xs text-muted-foreground">
                                    {jobDescription.length} / 5000 chars
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 mt-6 border-t">
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!file || !jobDescription || isScanning}
                            onClick={handleScan}
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Match...
                                </>
                            ) : (
                                'Analyze Match'
                            )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                            This will consume 10 credits.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="h-full overflow-y-auto bg-background">
                    {!matchResult && !isScanning && !isFetchingReport ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                                <Target className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <div className="max-w-sm">
                                <h3 className="text-lg font-medium text-foreground">Ready to analyze</h3>
                                <p className="text-sm mt-1 text-balance">
                                    Upload a resume and paste a job description to see exactly how well you match and get tailored advice.
                                </p>
                            </div>
                        </div>
                    ) : isScanning || isFetchingReport ? (
                        <ATSScanSkeleton variant="job-match" />
                    ) : matchResult ? (
                        <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Top Section: Score & Badges */}
                            <div className="flex flex-col md:flex-row items-center gap-8 bg-card border rounded-2xl p-8 shadow-sm">
                                <div className="shrink-0">
                                    <ScoreGauge
                                        score={matchResult.match_score}
                                        grade={
                                            matchResult.match_score >= 80 ? 'A' :
                                                matchResult.match_score >= 60 ? 'B' :
                                                    matchResult.match_score >= 40 ? 'C' : 'D'
                                        }
                                        size="lg"
                                    />
                                </div>
                                <div className="space-y-4 flex-1 text-center md:text-left">
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                        <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium uppercase border-primary/20 text-primary bg-primary/5">
                                            {matchResult.match_label}
                                        </Badge>
                                        <Badge className={cn(
                                            "px-3 py-1.5 text-sm font-medium",
                                            matchResult.hiring_likelihood === 'High' ? 'bg-green-500 hover:bg-green-600' :
                                                matchResult.hiring_likelihood === 'Medium' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                    'bg-red-500 hover:bg-red-600'
                                        )}>
                                            Likelihood: {matchResult.hiring_likelihood}
                                        </Badge>
                                    </div>
                                    <h2 className="text-2xl font-bold">Executive Summary</h2>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {matchResult.executive_summary}
                                    </p>
                                </div>
                            </div>

                            {/* Two Column Analysis */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                {/* Keywords Analysis */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold tracking-tight">Keyword Match</h3>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {matchResult.keyword_analysis.match_percentage}% Match
                                        </span>
                                    </div>

                                    <Card className="shadow-sm">
                                        <CardContent className="p-5 space-y-6">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                    Matched Keywords
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchResult.keyword_analysis.matched_keywords.length > 0 ? (
                                                        matchResult.keyword_analysis.matched_keywords.map((kw, i) => (
                                                            <KeywordBadge
                                                                key={i}
                                                                keyword={kw.keyword}
                                                                variant="matched"
                                                                importance={kw.importance as KeywordImportance}
                                                            />
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">None found</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold flex items-center gap-2">
                                                    <Target className="w-4 h-4 text-red-500" />
                                                    Missing Keywords
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchResult.keyword_analysis.missing_keywords.length > 0 ? (
                                                        matchResult.keyword_analysis.missing_keywords.map((kw, i) => (
                                                            <div key={i} title={`Context: ${kw.context}`}>
                                                                <KeywordBadge
                                                                    keyword={kw.keyword}
                                                                    variant="missing"
                                                                    importance={kw.importance as KeywordImportance}
                                                                />
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">None missing!</span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Skills Analysis */}
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold tracking-tight">Skills Match</h3>

                                    <Card className="shadow-sm">
                                        <CardContent className="p-5 space-y-6">
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">Matched</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {matchResult.skills_analysis.matched_skills.map((skill, i) => (
                                                        <Badge key={i} variant="outline" className="bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 font-normal">
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            {(matchResult.skills_analysis.missing_required_skills.length > 0 ||
                                                matchResult.skills_analysis.missing_preferred_skills.length > 0) && (
                                                    <div className="space-y-3 border-t pt-4">
                                                        <h4 className="text-sm font-semibold text-red-600 dark:text-red-500">Missing</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {matchResult.skills_analysis.missing_required_skills.map((skill, i) => (
                                                                <Badge key={`req-${i}`} variant="outline" className="bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-medium">
                                                                    {skill} (Req)
                                                                </Badge>
                                                            ))}
                                                            {matchResult.skills_analysis.missing_preferred_skills.map((skill, i) => (
                                                                <Badge key={`pref-${i}`} variant="outline" className="bg-orange-50/50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 font-normal">
                                                                    {skill} (Pref)
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            {matchResult.skills_analysis.bonus_skills.length > 0 && (
                                                <div className="space-y-3 border-t pt-4">
                                                    <h4 className="text-sm font-semibold text-blue-600 dark:text-blue-500">Bonus Skills Found</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {matchResult.skills_analysis.bonus_skills.map((skill, i) => (
                                                            <Badge key={i} variant="secondary" className="font-normal border-primary/20">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Experience & Education */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className={cn(
                                    "shadow-sm border-l-4",
                                    matchResult.experience_analysis.experience_match ? "border-l-green-500" : "border-l-yellow-500"
                                )}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Briefcase className="w-5 h-5 text-muted-foreground" />
                                            <h4 className="font-semibold text-base">Experience Match</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Required:</span>
                                                <span className="font-medium">{matchResult.experience_analysis.years_required} years</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">You have:</span>
                                                <span className="font-medium">{matchResult.experience_analysis.years_candidate_has} years</span>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t">
                                                {matchResult.experience_analysis.relevant_experience_summary}
                                            </p>
                                            {matchResult.experience_analysis.experience_gaps.length > 0 && (
                                                <div className="pt-2">
                                                    <h5 className="text-xs font-semibold uppercase text-yellow-600 dark:text-yellow-500 mb-2">Noticeable Gaps</h5>
                                                    <ul className="list-disc pl-4 text-sm text-muted-foreground space-y-1">
                                                        {matchResult.experience_analysis.experience_gaps.map((gap, i) => (
                                                            <li key={i}>{gap}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className={cn(
                                    "shadow-sm border-l-4",
                                    matchResult.education_analysis.education_match ? "border-l-green-500" : "border-l-yellow-500"
                                )}>
                                    <CardContent className="p-5">
                                        <div className="flex items-center gap-3 mb-4">
                                            <FileText className="w-5 h-5 text-muted-foreground" />
                                            <h4 className="font-semibold text-base">Education Match</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex flex-col gap-1 text-sm">
                                                <span className="text-muted-foreground">Required Definition:</span>
                                                <span className="font-medium">{matchResult.education_analysis.required}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 text-sm pt-2 border-t">
                                                <span className="text-muted-foreground">Your Education:</span>
                                                <span className="font-medium">{matchResult.education_analysis.candidate_has}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold tracking-tight">Key Strengths</h3>
                                    <div className="grid gap-3">
                                        {matchResult.positives.map((pos, i) => (
                                            <div key={i} className="flex gap-4 bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
                                                <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium text-green-900 dark:text-green-300">{pos.title}</h4>
                                                    <p className="text-sm text-green-800/80 dark:text-green-400/80 mt-1">{pos.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <h3 className="text-xl font-semibold tracking-tight">Areas of Concern</h3>
                                    {matchResult.negatives.length > 0 ? (
                                        <div className="grid gap-3">
                                            {matchResult.negatives.map((neg, i) => (
                                                <ImprovementCard
                                                    key={i}
                                                    title={neg.title}
                                                    description={neg.description}
                                                    severity={neg.severity as SeverityLevel}
                                                    how_to_address={neg.how_to_address}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="bg-muted border rounded-lg p-6 text-center text-muted-foreground">
                                            No significant red flags found for this job description.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Tailoring Suggestions */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold tracking-tight">Tailoring Suggestions</h3>
                                <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                                    {matchResult.resume_tailoring_suggestions.map((suggestion, i) => (
                                        <div key={i} className={cn(
                                            "p-5 grid md:grid-cols-[200px_1fr] gap-4",
                                            i !== matchResult.resume_tailoring_suggestions.length - 1 && "border-b"
                                        )}>
                                            <div>
                                                <Badge variant="outline" className="mb-2">{suggestion.section} Section</Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="text-sm">
                                                    <span className="font-semibold text-muted-foreground">Current Issue: </span>
                                                    <span className="text-foreground">{suggestion.current_issue}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="font-semibold text-primary">Suggestion: </span>
                                                    <span className="text-foreground">{suggestion.suggested_action}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Interview Talking Points */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold tracking-tight">Interview Talking Points</h3>
                                <ul className="bg-muted/30 border rounded-xl p-6 space-y-4 text-sm text-muted-foreground">
                                    {matchResult.interview_talking_points.map((point, i) => (
                                        <li key={i} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            <span className="leading-relaxed">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Overall Recommendation Callout */}
                            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mt-12 mb-12 flex flex-col items-center text-center space-y-4 shadow-sm">
                                <h3 className="font-semibold text-lg text-primary">Final Verdict</h3>
                                <p className="max-w-2xl text-foreground/90 font-medium text-balance leading-relaxed">
                                    "{matchResult.overall_recommendation}"
                                </p>
                            </div>

                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
