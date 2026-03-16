import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
    title: 'Blog | Career Advice & Resume Tips | Resume Builder',
    description: 'Expert career advice, resume writing tips, and interview strategies to help you land your dream job.',
};

const BLOG_POSTS = [
    {
        id: 'how-to-write-an-ats-friendly-resume-in-2025',
        title: 'How to Write an ATS-Friendly Resume in 2025',
        excerpt: 'Applicant Tracking Systems are evolving. Learn the exact strategies to ensure your resume beats the bots and gets seen by human recruiters.',
        date: 'March 15, 2025',
        author: 'Resume Builder Team',
        category: 'Resume Tips',
        readTime: '5 min read',
        imageBg: 'bg-blue-500/10'
    },
    {
        id: 'top-10-resume-mistakes-that-get-you-rejected',
        title: 'Top 10 Resume Mistakes That Get You Rejected',
        excerpt: 'Are you making these common resume errors? Discover the top 10 mistakes that cause recruiters to instantly pass on your application.',
        date: 'March 10, 2025',
        author: 'Sarah Jenkins',
        category: 'Career Advice',
        readTime: '7 min read',
        imageBg: 'bg-rose-500/10'
    },
    {
        id: 'cover-letter-vs-resume-do-you-need-both',
        title: 'Cover Letter vs. Resume: Do You Still Need Both in 2025?',
        excerpt: 'Are cover letters dead? We analyzed data from thousands of recruiters to find out if you actually need a cover letter—and how to write one that gets read.',
        date: 'March 12, 2025',
        author: 'Marcus Chen',
        category: 'Cover Letters',
        readTime: '6 min read',
        imageBg: 'bg-purple-500/10'
    },
    {
        id: 'how-to-quantify-resume-achievements',
        title: 'The Rule of Numbers: How to Quantify Your Resume Highlights',
        excerpt: 'Vague statements get ignored. Numbers get interviews. Learn exactly how to attach metrics and data to your experience, even if you aren\'t in a "numbers" role.',
        date: 'March 14, 2025',
        author: 'Elena Rodriguez',
        category: 'Resume Tips',
        readTime: '8 min read',
        imageBg: 'bg-emerald-500/10'
    }
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <PublicHeader />

            <main className="flex-1 py-20 px-6">
                <div className="mx-auto max-w-5xl">
                    <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                            Career Advice & Tips
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Expert insights on resume writing, passing the ATS, and landing your dream job faster.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {BLOG_POSTS.map((post) => (
                            <Link 
                                key={post.id} 
                                href={`/blog/${post.id}`}
                                className="group relative rounded-2xl border bg-card overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-primary/50"
                            >
                                {/* Placeholder Image Area */}
                                <div className={`h-48 w-full ${post.imageBg} flex items-center justify-center transition-transform duration-500 group-hover:scale-105`}>
                                    <span className="text-2xl font-bold opacity-30 text-foreground mix-blend-overlay">
                                        {post.category}
                                    </span>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col bg-card z-10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-muted-foreground">• {post.readTime}</span>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    
                                    <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                                        {post.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5" />
                                                {post.author}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {post.date}
                                            </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Newsletter Callout */}
                    <div className="mt-20 rounded-3xl bg-primary/5 border border-primary/20 p-8 md:p-12 text-center max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold mb-3">Never miss a career update</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Join over 10,000 job seekers who get our best resume tips and career advice delivered straight to their inbox.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="/blog">
                            <input 
                                type="email" 
                                placeholder="Enter your email" 
                                className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required 
                            />
                            <button className="rounded-full bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <PublicFooter />
        </div>
    );
}
