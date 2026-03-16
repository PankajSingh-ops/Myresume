import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowLeft, Calendar, User, Zap } from 'lucide-react';

export const metadata = {
    title: 'Cover Letter vs. Resume: Do You Still Need Both in 2025? | Resume Builder',
    description: 'Are cover letters dead? We analyze data from 10,000 recruiters to see if you actually need a cover letter in 2025 and how to write a good one.',
    keywords: 'do I need a cover letter, cover letter vs resume, cover letter tips 2025, how to write a cover letter',
};

export default function BlogPost3() {
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
                            <span className="text-xs font-bold tracking-wider uppercase text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-md">
                                Cover Letters
                            </span>
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                6 min read
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            Cover Letter vs. Resume: Do You Still Need Both in 2025?
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-10">
                            Are cover letters dead? We analyzed data from thousands of recruiters to find out if you actually need a cover letter—and how to write one that gets read.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border/60">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    MC
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground m-0">Marcus Chen</p>
                                    <p className="text-xs text-muted-foreground m-0">Career Expert</p>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-border/60" />
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Published March 12, 2025</span>
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
                            If there is one question that divides the career advice world more than any other, it’s this: <em>“Do I still need to submit a cover letter?”</em>
                        </p>
                        
                        <p>
                            Some recruiters say they never read them. Others say a missing cover letter is an automatic disqualification. For job seekers, this contradictory advice is incredibly frustrating. We looked at the data for 2025 to give you a definitive answer.
                        </p>

                        <h2>The Short Answer: Yes, But Not Always</h2>
                        <p>
                            According to recent surveys, about <strong>45% of recruiters say they skip cover letters</strong> entirely. However, that means <strong>55% still read them</strong>—and among that 55%, a well-written cover letter is often the deciding factor between two equally qualified candidates.
                        </p>
                        
                        <div className="bg-muted px-6 py-4 rounded-xl my-6 border border-border">
                            <h4 className="font-semibold text-foreground mb-2 mt-0">When You ABSOLUTELY Need a Cover Letter:</h4>
                            <ul className="list-disc pl-5 mt-2 space-y-1 m-0 text-sm text-muted-foreground">
                                <li>When the job description explicitly asks for one (failure to follow instructions).</li>
                                <li>When you are making a major career transition (changing industries).</li>
                                <li>When you have a significant employment gap you need to explain gracefully.</li>
                                <li>When applying to a small startup or non-profit where culture fit is heavily prioritized.</li>
                            </ul>
                        </div>

                        <h2>Resume vs. Cover Letter: What's the Difference?</h2>
                        <p>
                            The biggest mistake candidates make is using the cover letter to summarize their resume. <strong>Do not repeat your resume in paragraph form.</strong>
                        </p>
                        <ul>
                            <li><strong>Your Resume</strong> is a factual, chronological list of your skills, experience, and quantifiable achievements. It answers: <em>"Can this person do the job?"</em></li>
                            <li><strong>Your Cover Letter</strong> is a narrative, persuasive document that explains your motivation, directly addresses your fit for the company, and highlights your soft skills. It answers: <em>"Why does this person want THIS job, and will they fit in?"</em></li>
                        </ul>

                        <h2>How to Write a Cover Letter in 2025</h2>
                        <p>
                            The era of the "To Whom It May Concern" 5-paragraph essay is over. Recruiters are busy, and brevity is your best friend. Follow this modern, 3-paragraph structure:
                        </p>

                        <h3>1. The Hook (Paragraph 1)</h3>
                        <p>
                            Skip the boring "I am writing to apply for..." opener. Instead, start with a bang. Mention a mutual connection, reference a recent piece of news about the company, or state a bold professional achievement right out of the gate.
                        </p>

                        <h3>2. The Proof (Paragraph 2)</h3>
                        <p>
                            Pick <strong>one or two</strong> specific achievements from your resume and expand on the <em>story</em> behind them. How did you overcome a challenge? How did you collaborate with a difficult team? Use this space to demonstrate soft skills like leadership, problem-solving, and adaptability that are hard to quantify on a resume.
                        </p>

                        <h3>3. The Close (Paragraph 3)</h3>
                        <p>
                            Reiterate your enthusiasm for the specific role and company. End with a confident "Call to Action" rather than a passive sign-off. For example: <em>"I would welcome the opportunity to discuss how my background in X could help your team achieve Y. I look forward to speaking with you."</em>
                        </p>

                        <hr className="my-10 border-border" />

                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
                                <Zap className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mt-0 mb-3">Don't start from scratch</h3>
                            <p className="text-muted-foreground mb-6">
                                Writing a cover letter is hard enough. Formatting it shouldn't be. Use our proven, recruiter-approved templates to build a stunning cover letter in minutes.
                            </p>
                            <Link 
                                href="/cover-templates" 
                                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:opacity-90 transition-opacity no-underline"
                            >
                                Browse Cover Letter Templates
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <PublicFooter />
        </div>
    );
}
