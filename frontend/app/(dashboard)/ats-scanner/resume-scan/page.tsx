'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle2, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useATSStore } from '@/store/atsStore';
import { ResumeUploadZone } from '@/components/ats/ResumeUploadZone';
import { ScoreGauge } from '@/components/ats/ScoreGauge';
import { CategoryScoreCard } from '@/components/ats/CategoryScoreCard';
import { KeywordBadge } from '@/components/ats/KeywordBadge';
import { ImprovementCard } from '@/components/ats/ImprovementCard';
import { ATSScanSkeleton } from '@/components/ats/ATSScanSkeleton';
import { getScanById } from '@/lib/api/ats';
import type { ATSScanResult } from '@/types/ats';

function downloadResumeScanReport(result: ATSScanResult) {
    const lines: string[] = [
        '═══════════════════════════════════════════',
        '         ATS RESUME SCAN REPORT',
        '═══════════════════════════════════════════',
        '',
        `Overall Score: ${result.overall_score}/100  (Grade: ${result.grade})`,
        '',
        '── Summary ─────────────────────────────────',
        result.summary,
        '',
        '── Category Scores ─────────────────────────',
        ...Object.entries(result.category_scores).map(
            ([key, data]) => `  ${key.replace(/_/g, ' ')}: ${data.score}/100 — ${data.label}\n    ${data.feedback}`
        ),
        '',
        '── Sections Detected ───────────────────────',
        ...Object.entries(result.sections_detected).map(
            ([section, found]) => `  ${section.replace(/_/g, ' ')}: ${found ? '✔ Found' : '✘ Missing'}`
        ),
        '',
        '── Strengths ───────────────────────────────',
        ...result.strengths.map((s) => `  • ${s}`),
        '',
        '── Keywords Found ──────────────────────────',
        result.keywords_found.length > 0 ? result.keywords_found.join(', ') : '  None detected',
        '',
        '── Missing Keywords ────────────────────────',
        result.missing_keywords.length > 0 ? result.missing_keywords.join(', ') : '  None missing',
        '',
        '── Recommended Improvements ────────────────',
        ...result.improvements.map(
            (imp, i) => `  ${i + 1}. [${imp.issue}]\n     ${imp.description}\n     Suggestion: ${imp.suggestion}`
        ),
        '',
        '── ATS Tips ────────────────────────────────',
        ...result.ats_tips.map((tip) => `  • ${tip}`),
        '',
        `Generated on ${new Date().toLocaleString()}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-resume-scan-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

export default function ResumeScanPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const scanId = searchParams.get('id');
    const [file, setFile] = useState<File | null>(null);

    const {
        isScanning,
        scanResult: storeResult,
        runResumeScan,
        clearResults
    } = useATSStore();

    // Fetch saved scan when navigating from history
    const { data: fetchedScan, isLoading: isFetchingReport } = useQuery({
        queryKey: ['ats-scan', scanId],
        queryFn: () => getScanById(scanId!),
        enabled: !!scanId,
    });

    // Use store result (fresh scan) or fetched result (history)
    const scanResult: ATSScanResult | null = storeResult ?? (fetchedScan?.result as ATSScanResult | undefined) ?? null;

    const handleScan = () => {
        if (!file) return;
        runResumeScan(file);
    };

    const handleBack = () => {
        clearResults();
        router.push('/ats-scanner');
    };

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-4rem)]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-8 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Resume Scanner</h1>
                        <p className="text-sm text-muted-foreground">
                            Analyze your resume for ATS compatibility
                        </p>
                    </div>
                </div>
                {scanResult && (
                    <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => downloadResumeScanReport(scanResult)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden grid md:grid-cols-[400px_1fr] lg:grid-cols-[450px_1fr]">
                {/* Left Panel: Upload & Controls */}
                <div className="h-full md:border-r bg-muted/10 overflow-y-auto p-4 md:p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Upload Resume</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Upload the resume you want to analyze.
                            </p>
                        </div>

                        <ResumeUploadZone
                            onFileSelect={setFile}
                            isLoading={isScanning}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <Button
                            className="w-full"
                            size="lg"
                            disabled={!file || isScanning}
                            onClick={handleScan}
                        >
                            {isScanning ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing Resume...
                                </>
                            ) : (
                                'Analyze Resume'
                            )}
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                            This will consume 10 credits.
                        </p>
                    </div>
                </div>

                {/* Right Panel: Results */}
                <div className="h-full overflow-y-auto bg-background">
                    {!scanResult && !isScanning && !isFetchingReport ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center space-y-4">
                            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <div className="max-w-sm">
                                <h3 className="text-lg font-medium text-foreground">Ready to scan</h3>
                                <p className="text-sm mt-1 text-balance">
                                    Upload your resume and click Analyze to see your ATS compatibility score and detailed feedback.
                                </p>
                            </div>
                        </div>
                    ) : isScanning || isFetchingReport ? (
                        <ATSScanSkeleton variant="resume" />
                    ) : scanResult ? (
                        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

                            {/* Top Section: Score & Summary */}
                            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 bg-card border rounded-xl md:rounded-2xl p-4 md:p-8 shadow-sm">
                                <div className="shrink-0">
                                    <ScoreGauge
                                        score={scanResult.overall_score}
                                        grade={scanResult.grade}
                                        size="lg"
                                    />
                                </div>
                                <div className="space-y-3 flex-1 text-center md:text-left">
                                    <h2 className="text-2xl font-bold">Executive Summary</h2>
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                        {scanResult.summary}
                                    </p>
                                </div>
                            </div>

                            {/* Category Breakdown */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold tracking-tight">Category Breakdown</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {Object.entries(scanResult.category_scores).map(([key, data]) => (
                                        <CategoryScoreCard
                                            key={key}
                                            category={key}
                                            score={data.score}
                                            label={data.label}
                                            feedback={data.feedback}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Sections & Keywords */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold tracking-tight">Sections Detected</h3>
                                    <div className="bg-card border rounded-xl p-5 shadow-sm space-y-3">
                                        {Object.entries(scanResult.sections_detected).map(([section, detected]) => (
                                            <div key={section} className="flex items-center justify-between">
                                                <span className="text-sm font-medium capitalize">
                                                    {section.replace('_', ' ')}
                                                </span>
                                                {detected ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                                                        <span className="block w-2.5 h-0.5 bg-muted-foreground/30 rounded-full" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold tracking-tight">Keyword Analysis</h3>
                                    <div className="bg-card border rounded-xl p-5 shadow-sm space-y-6">
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-muted-foreground">Hard Skills & Keywords Found</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {scanResult.keywords_found.length > 0 ? (
                                                    scanResult.keywords_found.map((kw, i) => (
                                                        <KeywordBadge key={i} keyword={kw} variant="matched" />
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">None detected</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <h4 className="text-sm font-medium text-muted-foreground">Suggested Additions</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {scanResult.missing_keywords.length > 0 ? (
                                                    scanResult.missing_keywords.map((kw, i) => (
                                                        <KeywordBadge key={i} keyword={kw} variant="missing" />
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">None missing</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Improvements */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold tracking-tight">Recommended Improvements</h3>
                                {scanResult.improvements.length > 0 ? (
                                    <div className="space-y-3">
                                        {scanResult.improvements.map((imp, i) => (
                                            <ImprovementCard
                                                key={i}
                                                title={imp.issue}
                                                description={imp.description}
                                                suggestion={imp.suggestion}
                                                severity="Moderate" // Default for general resume scan
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30 rounded-xl p-6 text-center text-green-800 dark:text-green-400">
                                        <p className="font-medium">No major improvements found. Your resume looks great!</p>
                                    </div>
                                )}
                            </div>

                            {/* ATS Tips */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold tracking-tight">General ATS Tips</h3>
                                <ul className="bg-muted/30 border rounded-xl p-6 space-y-3 text-sm text-muted-foreground">
                                    {scanResult.ats_tips.map((tip, i) => (
                                        <li key={i} className="flex gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                            <span className="leading-relaxed">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="pb-12" /> {/* Bottom padding buffer */}

                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
