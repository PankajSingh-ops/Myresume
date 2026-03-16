import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowLeft, Calendar, User, TrendingUp } from 'lucide-react';

export const metadata = {
    title: 'How to Quantify Your Resume Achievements | Resume Builder',
    description: 'Learn how to use data, metrics, and numbers to quantify your resume achievements and make your experience stand out to hiring managers.',
    keywords: 'quantify resume, resume numbers, resume metrics, resume achievements examples, how to write resume bullet points',
};

export default function BlogPost4() {
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
                            <span className="text-xs font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1.5 rounded-md">
                                Resume Tips
                            </span>
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                8 min read
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            The Rule of Numbers: How to Quantify Your Resume Highlights
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-10">
                            Vague statements get ignored. Numbers get interviews. Learn exactly how to attach metrics and data to your experience, even if you aren't in a "numbers" role.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border/60">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    ER
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground m-0">Elena Rodriguez</p>
                                    <p className="text-xs text-muted-foreground m-0">Lead Recruiter</p>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-border/60" />
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Published March 14, 2025</span>
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
                            Put yourself in the shoes of a recruiter looking at two resumes for a Marketing Manager position. 
                        </p>
                        <p>
                            <strong>Candidate A writes:</strong> <em>"Responsible for managing the company's email newsletter and growing the subscriber base."</em>
                        </p>
                        <p>
                            <strong>Candidate B writes:</strong> <em>"Managed a weekly email newsletter, growing the subscriber base by 45% (from 10k to 14.5k) over 6 months, resulting in a 20% increase in lead generation."</em>
                        </p>
                        <p>
                            Who gets the interview? Candidate B, every single time. The difference isn't the experience—it's the <strong>quantification</strong>.
                        </p>

                        <h2>Why Metrics Matter</h2>
                        <p>
                            Numbers provide scope, scale, and context. Saying you "managed a budget" means nothing because a budget could be $500 or $5,000,000. Numbers instantly prove your capability and give hiring managers a concrete understanding of your impact.
                        </p>

                        <h2>"But my job doesn't involve numbers!"</h2>
                        <p>
                            This is the most common pushback from job seekers in qualitative fields like HR, design, administration, or customer service. The truth is, <strong>every job can be quantified</strong> using one of these four metric categories:
                        </p>

                        <h3>1. Scale & Frequency (How much? How often?)</h3>
                        <p>
                            If you don't have revenue or growth numbers, quantify your volume of work. 
                        </p>
                        <ul>
                            <li><strong>Instead of:</strong> <em>"Handled customer support calls."</em></li>
                            <li><strong>Write:</strong> <em>"Managed escalated customer support issues, handling an average of 40+ inbound calls daily while maintaining a 98% positive resolution rate."</em></li>
                            <li><strong>Instead of:</strong> <em>"Wrote blog articles."</em></li>
                            <li><strong>Write:</strong> <em>"Authored and published 3 SEO-optimized articles per week, totaling over 150 pieces of published content."</em></li>
                        </ul>

                        <h3>2. Time & Efficiency (How fast? How much time saved?)</h3>
                        <p>
                            Did you make something faster? Did you automate a manual process? Time is money, and employers love candidates who save time.
                        </p>
                        <ul>
                            <li><strong>Instead of:</strong> <em>"Improved the onboarding process."</em></li>
                            <li><strong>Write:</strong> <em>"Redesigned the new-hire onboarding workflow, reducing the average training time from 3 weeks to 10 days."</em></li>
                        </ul>

                        <h3>3. Money (Revenue, Cost Savings, Budget Size)</h3>
                        <p>
                            If you touch money in any way, state the exact amount. Remember to use approximations if exact figures are confidential.
                        </p>
                        <ul>
                            <li><strong>Instead of:</strong> <em>"Negotiated software contracts."</em></li>
                            <li><strong>Write:</strong> <em>"Renegotiated 5 enterprise software vendor contracts, resulting in an annual cost savings of ~$45,000."</em></li>
                        </ul>

                        <h3>4. People (Team Size, Reach, Client Base)</h3>
                        <p>
                            Quantify your leadership and the scope of your interpersonal interactions.
                        </p>
                        <ul>
                            <li><strong>Instead of:</strong> <em>"Managed a team of designers."</em></li>
                            <li><strong>Write:</strong> <em>"Fostered a cross-functional team of 6 UI/UX designers and 3 front-end developers across 3 different time zones."</em></li>
                        </ul>

                        <h2>The Formula: Metric + Action + Result</h2>
                        <p>
                            As you rewrite your bullet points, try to ensure at least <strong>50% of them</strong> contain a number. A visual trick to make your resume highly scannable is to always use numerals (e.g., "7" instead of "seven") so the numbers pop out in a sea of text.
                        </p>

                        <hr className="my-10 border-border" />

                        <div className="bg-muted border border-border rounded-2xl p-8 text-center flex flex-col items-center mt-12">
                             <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-600">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <h3 className="text-2xl font-bold mt-0 mb-3">Ready to showcase your impact?</h3>
                            <p className="text-muted-foreground mb-6">
                                Choose a resume template designed to perfectly balance your metrics, skills, and experience for maximum readability.
                            </p>
                            <Link 
                                href="/templates" 
                                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:opacity-90 transition-opacity no-underline"
                            >
                                View Resume Templates
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <PublicFooter />
        </div>
    );
}
