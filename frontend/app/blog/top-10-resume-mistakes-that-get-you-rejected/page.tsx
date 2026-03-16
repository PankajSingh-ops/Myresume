import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { ArrowLeft, Calendar, User, XCircle } from 'lucide-react';

export const metadata = {
    title: 'Top 10 Resume Mistakes That Get You Rejected | Resume Builder',
    description: 'Avoid the most common resume mistakes that lead to automatic rejection. Learn what hiring managers hate and how to fix your resume fast.',
    keywords: 'resume mistakes, why am I getting rejected, resume errors, bad resume examples, formatting mistakes, resume advice',
};

export default function BlogPost2() {
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
                            <span className="text-xs font-bold tracking-wider uppercase text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/30 px-3 py-1.5 rounded-md">
                                Career Advice
                            </span>
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                7 min read
                            </span>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
                            Top 10 Resume Mistakes That Get You Rejected
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-10">
                            Are you making these common resume errors? Discover the top mistakes that cause recruiters to instantly pass on your application.
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border/60">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                    SJ
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground m-0">Sarah Jenkins</p>
                                    <p className="text-xs text-muted-foreground m-0">Hiring Manager</p>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-border/60" />
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Published March 10, 2025</span>
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
                            On average, a corporate job opening attracts 250 resumes. Out of those, only 4 to 6 candidates get called for an interview. With recruiters spending an average of just 7 seconds scanning a resume, your margin for error is effectively zero.
                        </p>
                        
                        <p>
                            If you're frustrated by constant rejection emails (or worse, being ghosted), you might be committing one of these cardinal resume sins. Here are the top 10 resume mistakes and how to fix them immediately.
                        </p>

                        <h2>1. Writing Job Descriptions Instead of Achievements</h2>
                        <p>
                            This is the #1 mistake. Saying "Responsible for managing social media" tells a recruiter what your job required, but it doesn't tell them if you were actually <em>good</em> at it. 
                        </p>
                        <p>
                            <strong>The Fix:</strong> Use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]." For example: <em>"Grew Instagram following by 150% (50k new followers) within 6 months by launching a targeted influencer campaign."</em>
                        </p>

                        <h2>2. An Unprofessional Email Address</h2>
                        <p>
                            If your email address is <code>skaterboi99@hotmail.com</code>, you are setting yourself up for failure. It sends an immediate signal of unprofessionalism.
                        </p>
                        <p>
                            <strong>The Fix:</strong> Create a standard, clean email address, ideally <code>firstname.lastname@gmail.com</code>.
                        </p>

                        <h2>3. Glaring Typos and Grammatical Errors</h2>
                        <p>
                            It sounds obvious, but a CareerBuilder survey found that 77% of hiring managers instantly disqualify a resume if it contains poor grammar or typos. It signals a lack of attention to detail.
                        </p>
                        <p>
                            <strong>The Fix:</strong> Don't just rely on spellcheck. Read your resume backward, have a friend read it, or use grammar checking software.
                        </p>

                        <h2>4. The Resume is Too Long</h2>
                        <p>
                            Unless you are applying for a highly technical role, an academic CV, or have 15+ years of highly relevant executive experience, your resume belongs on a single page. 
                        </p>
                        <div className="flex items-start gap-3 bg-rose-500/5 px-6 py-4 rounded-xl my-6 border border-rose-500/20 text-sm">
                            <XCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                            <p className="m-0"><strong>Don't include every job you've ever had.</strong> That summer job making sandwiches in 2012 shouldn't be on your resume if you're applying for a financial analyst role in 2025.</p>
                        </div>

                        <h2>5. Keyword Stuffing (or No Keywords at All)</h2>
                        <p>
                            You need keywords to pass the <Link href="/ats">ATS (Applicant Tracking System)</Link>. However, throwing a random block of text labeled "Keywords" at the bottom of the page will get you flagged by the system and laughed at by humans.
                        </p>
                        <p>
                            <strong>The Fix:</strong> Weave the exact terminology used in the job description naturally into your bullet points and skills section.
                        </p>

                        <h2>6. An Objective Statement</h2>
                        <p>
                            "Looking for a challenging role where I can utilize my skills to grow the company." Sound familiar? It's outdated. An objective statement tells the employer what <em>you</em> want. They don't care what you want—they care what you can do for them.
                        </p>
                        <p>
                            <strong>The Fix:</strong> Replace it with a "Professional Summary"—a 3-sentence elevator pitch highlighting your top skills, key achievements, and current professional focus.
                        </p>

                        <h2>7. Including a Photo</h2>
                        <p>
                            Unless you are an actor, a model, or applying in certain European/Asian countries where it is standard, do not include a photo on a US/UK-based resume. HR departments hate it because it opens the company up to discrimination lawsuits.
                        </p>

                        <h2>8. Poor Formatting and Unreadable Fonts</h2>
                        <p>
                            Using a 9pt font and 0.2-inch margins to cram everything onto one page makes your resume essentially unreadable. If a recruiter has to squint, they just move on to the next candidate.
                        </p>
                        <p>
                            <strong>The Fix:</strong> Use a professional <Link href="/templates">resume template</Link> that balances white space, typography, and structure perfectly.
                        </p>

                        <h2>9. "References Available Upon Request"</h2>
                        <p>
                            Remove this line immediately. It is universally understood that if a company wants references, they will ask for them. This line just wastes valuable space that could be used for another achievement bullet point.
                        </p>

                        <h2>10. Saving as a Word Document</h2>
                        <p>
                            Unless specifically asked for a `.docx` file, always send your resume as a PDF. Word documents can open with completely broken formatting depending on what version of Word (or Apple Pages) the recruiter is using. A PDF freezes your exact formatting in place.
                        </p>

                        <hr className="my-10 border-border" />

                        <div className="bg-muted border border-border rounded-2xl p-8 text-center mt-12">
                            <h3 className="text-2xl font-bold mt-0 mb-3">Fix Your Mistakes Instantly</h3>
                            <p className="text-muted-foreground mb-6">
                                Start with a completely error-free, professionally designed template engineered to highlight your achievements and pass the ATS.
                            </p>
                            <Link 
                                href="/register" 
                                className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:opacity-90 transition-opacity no-underline"
                            >
                                Build a Winning Resume
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <PublicFooter />
        </div>
    );
}
