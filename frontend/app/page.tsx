import Link from 'next/link';
import { FileText, Sparkles, Download, Shield, ArrowRight, Zap, Palette, Brain } from 'lucide-react';
import { RedirectIfAuthenticated } from '@/components/auth/RedirectIfAuthenticated';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export default function Home() {
  return (
    <RedirectIfAuthenticated>
      <div className="min-h-screen bg-background text-foreground">
        <PublicHeader />

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2">
            <div className="h-[500px] w-[800px] rounded-full bg-primary/8 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 text-center sm:pt-32">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-8">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI-powered resume building
            </div>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl sm:leading-[1.1]">
              Build professional resumes{' '}
              <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                in minutes
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Create ATS-friendly, beautifully designed resumes with AI-powered suggestions.
              Export polished PDFs and share them with a public link.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Building — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center gap-2 rounded-full border px-8 text-sm font-medium transition-colors hover:bg-muted"
              >
                Sign in to your account
              </Link>
            </div>

            {/* Stats */}
            <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8">
              {[
                { value: '100', label: 'Free credits' },
                { value: 'A4', label: 'Print-ready PDFs' },
                { value: 'AI', label: 'Smart suggestions' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-t bg-muted/30 py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
              <p className="mt-3 text-muted-foreground">
                Professional tools to build, polish, and share your resume.
              </p>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: 'AI Writing Assistant',
                  description:
                    'Improve bullet points, rewrite summaries, and generate professional content with AI.',
                  gradient: 'from-violet-500 to-purple-600',
                },
                {
                  icon: Palette,
                  title: 'Beautiful Templates',
                  description:
                    'Choose from professionally designed templates. Customize colors, fonts, and spacing.',
                  gradient: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: Download,
                  title: 'PDF Export',
                  description:
                    'Export pixel-perfect A4 PDFs optimized for ATS systems and print.',
                  gradient: 'from-emerald-500 to-green-600',
                },
                {
                  icon: Zap,
                  title: 'Live Preview',
                  description:
                    'See changes in real-time with a side-by-side editor and zoomable preview.',
                  gradient: 'from-amber-500 to-orange-500',
                },
                {
                  icon: Shield,
                  title: 'Version History',
                  description:
                    'Every save creates a version snapshot. Restore any previous version instantly.',
                  gradient: 'from-rose-500 to-pink-600',
                },
                {
                  icon: ArrowRight,
                  title: 'Public Sharing',
                  description:
                    'Share your resume with a unique public link. Perfect for portfolios and applications.',
                  gradient: 'from-slate-500 to-slate-700',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div
                    className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${feature.gradient}`}
                  >
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to build your resume?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-muted-foreground">
              Sign up for free and get 100 credits to create resumes, use AI, and export PDFs.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <PublicFooter />
      </div>
    </RedirectIfAuthenticated >
  );
}
