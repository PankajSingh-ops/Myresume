import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowLeft, Calendar, User, CheckCircle2 } from 'lucide-react';

export const metadata = {
    title: 'How to Write an ATS-Friendly Resume in 2025 | Resume Builder',
    description: 'Learn exactly how to format, structure, and keyword-optimize your resume to beat Applicant Tracking Systems (ATS) in 2025.',
    keywords: 'ATS resume, applicant tracking system, resume formatting, resume keywords, 2025 resume tips, pass ATS',
};

export default function BlogPost1() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 py-16 px-6 sm:px-12">
                <article className="mx-auto max-w-[800px]">
                    <div className="mb-12">
                        <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 bg-muted/50 px-4 py-2 rounded-full border">
                            <ArrowLeft className="h-4 w-4" /> Back to all articles
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            <span className="text-xs font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1.5 rounded-md">
                                Resume Tips
                            </span>
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                5 min read
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            How to Write an ATS-Friendly Resume in 2025
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-10">
                            Applicant Tracking Systems are evolving. Learn the exact strategies to ensure your resume beats the bots and gets seen by human recruiters.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border/60">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    RB
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground m-0">Resume Builder Team</p>
                                    <p className="text-xs text-muted-foreground m-0">Editorial Staff</p>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-border/60" />
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Published March 15, 2025</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                                  prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                                  prose-h2:mt-16 prose-h2:mb-6 prose-h2:text-3xl
                                  prose-h3:mt-10 prose-h3:mb-4 prose-h3:text-2xl
                                  prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:mb-8
                                  prose-a:text-primary prose-a:font-medium hover:prose-a:text-primary/80 prose-a:underline-offset-4
                                  prose-li:text-muted-foreground prose-li:leading-relaxed
                                  prose-strong:text-foreground prose-strong:font-semibold">
                        <p>
                            If you've been applying to jobs online and hearing nothing but crickets, your resume might not be the problem—your formatting might be. Over <strong>98% of Fortune 500 companies</strong> use Applicant Tracking Systems (ATS) to filter resumes before a human ever sets eyes on them.
                        </p>
                        
                        <p>
                            In 2025, ATS software has become smarter, heavily relying on AI to parse and rank candidates. Here is exactly how to build an ATS-friendly resume that guarantees you make it to the "yes" pile.
                        </p>

                        <h2>1. Stick to Standard Section Headers</h2>
                        <p>
                            Creativity is great, but not when it comes to naming your resume sections. An ATS is programmed to look for specific, standard keywords to categorize your information. If you use "My Journey" instead of "Experience," the system might completely ignore your work history.
                        </p>
                        <div className="bg-muted px-6 py-4 rounded-xl my-6 border border-border">
                            <h4 className="font-semibold text-foreground mb-2 mt-0">Standard Headers to Use:</h4>
                            <ul className="list-none pl-0 space-y-2 m-0 text-sm">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Work Experience / Professional Experience</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Education</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Skills / Core Competencies</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Certifications</li>
                            </ul>
                        </div>

                        <h2>2. Optimize for Target Keywords</h2>
                        <p>
                            Modern ATS software doesn't just parse text; it ranks candidates based on keyword density and context matching the job description.
                        </p>
                        <p>
                            Read the job posting carefully. If the employer asks for "Project Management," don't just write "managed projects." Use the exact phrasing. Better yet, use our <Link href="/ats">Smart ATS Scanner</Link> to automatically compare your resume against a job description to find missing keywords.
                        </p>

                        <h2>3. Avoid Complex Formatting (Tables, Columns, Graphics)</h2>
                        <p>
                            While multi-column designs with progress bars for skills look beautiful to human eyes, they often look like gibberish to an ATS. 
                        </p>
                        <ul>
                            <li><strong>Don't use:</strong> Tables, text boxes, headers/footers, or images.</li>
                            <li><strong>Do use:</strong> Standard bullet points, standard fonts (Arial, Calibri, Times New Roman), and clean single or two-column layouts that linearize well.</li>
                        </ul>
                        <p>
                            <em>Note: All <Link href="/templates">Resume Builder templates</Link> are specifically engineered under-the-hood to be easily parsed by ATS systems, even our multi-column designs!</em>
                        </p>

                        <h2>4. Chronological Formatting is King</h2>
                        <p>
                            Functional resumes (grouping by skills rather than chronological work history) confuse ATS parsers. They struggle to attach specific skills to a timeframe or employer. Always use a <strong>reverse-chronological format</strong>, listing your most recent experience first.
                        </p>

                        <h2>5. Save as a Standard PDF or Docx</h2>
                        <p>
                            Unless the job application explicitly requests a Word document, exporting your resume as a standard, text-selectable PDF is the safest bet in 2025. Ensure it is a "text PDF" (one created from a word processor) rather than an "image PDF" (like a scanned document).
                        </p>

                        <hr className="my-10 border-border" />

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                            <h3 className="text-2xl font-bold mt-0 mb-3">Is your resume ATS-friendly?</h3>
                            <p className="text-muted-foreground mb-6">
                                Don't leave it to chance. Scan your resume through our AI-powered ATS checker and get an instant compatibility score.
                            </p>
                            <Link 
                                href="/ats" 
                                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:opacity-90 transition-opacity no-underline"
                            >
                                Scan My Resume
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <PublicFooter />
        </div>
    );
}
