import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { FileSearch, Target, ArrowRight, Check, ShieldCheck, Zap, BarChart3 } from 'lucide-react';

export const metadata = {
    title: 'ATS Scanner | Resume Builder',
    description: 'Analyze your resume against Applicant Tracking Systems. Get an instant ATS score, keyword analysis, and actionable improvement tips.',
};

export default function ATSScannerPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-20 px-6">
                    <div className="mx-auto max-w-4xl text-center space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 rounded-full text-sm font-medium">
                            <Zap className="h-3.5 w-3.5" />
                            AI-Powered Analysis
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                            Smart ATS Scanner
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Analyze your resume and see how it matches up against Applicant Tracking Systems.
                            Get an instant score, identify gaps, and land more interviews.
                        </p>
                        <div className="pt-4">
                            <Link
                                href="/register"
                                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity gap-2"
                            >
                                Try ATS Scanner Free
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Feature Cards */}
                <section className="py-16 px-6 bg-muted/20">
                    <div className="mx-auto max-w-5xl">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Resume Scanner Card */}
                            <div className="relative overflow-hidden rounded-2xl border bg-card p-8 flex flex-col group hover:border-primary/50 transition-colors">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FileSearch className="w-32 h-32" />
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-6">
                                    <FileSearch className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">ATS Resume Scanner</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Get an instant score on how well your resume is formatted for ATS systems. We check for missing sections, keyword optimization, and formatting issues.
                                </p>
                                <ul className="space-y-3 text-sm text-muted-foreground flex-1">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        Comprehensive score (0-100)
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        Formatting and syntax checks
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                        Actionable improvement tips
                                    </li>
                                </ul>
                            </div>

                            {/* Job Match Card */}
                            <div className="relative overflow-hidden rounded-2xl border bg-card p-8 flex flex-col group hover:border-primary/50 transition-colors">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Target className="w-32 h-32" />
                                </div>
                                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mb-6">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Job Match Analyzer</h3>
                                <p className="text-muted-foreground mb-6 leading-relaxed">
                                    Compare your resume side-by-side with a specific job description. Find missing keywords and get tailoring suggestions.
                                </p>
                                <ul className="space-y-3 text-sm text-muted-foreground flex-1">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                        Detailed match percentage
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                        Missing keyword identification
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                        Targeted tailoring recommendations
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-20 px-6">
                    <div className="mx-auto max-w-4xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                Three simple steps to optimize your resume for ATS systems.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                                    1
                                </div>
                                <h3 className="text-lg font-semibold">Upload Resume</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Select one of your resumes or upload a new one for analysis.
                                </p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                                    2
                                </div>
                                <h3 className="text-lg font-semibold">AI Analysis</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Our AI scans for formatting, keywords, structure, and ATS compatibility.
                                </p>
                            </div>
                            <div className="text-center space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-xl font-bold">
                                    3
                                </div>
                                <h3 className="text-lg font-semibold">Get Results</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Receive a detailed score with actionable tips to beat the ATS.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Trust Badges */}
                <section className="py-12 px-6 bg-muted/20">
                    <div className="flex flex-wrap items-center justify-center gap-8 max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ShieldCheck className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium">Secure & Private</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">Detailed Reports</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-5 w-5 text-green-500" />
                            <span className="text-sm font-medium">ATS Optimized</span>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 px-6">
                    <div className="mx-auto max-w-2xl text-center bg-card border rounded-2xl p-12">
                        <h2 className="text-3xl font-bold mb-4">Ready to beat the ATS?</h2>
                        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                            Sign up for free and get 100 AI credits to start scanning your resume.
                            No credit card required.
                        </p>
                        <Link
                            href="/register"
                            className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity gap-2"
                        >
                            Get Started Free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </main>

            <PublicFooter />
        </div>
    );
}
