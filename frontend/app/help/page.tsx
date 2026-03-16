import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { FileText, LifeBuoy, Zap, Search } from 'lucide-react';

export const metadata = {
  title: 'Help Center',
  description: 'Find answers, guides and help for Resume Builder.',
};

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help?</h1>
            <div className="relative mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search for articles, guides..." 
                className="w-full flex h-14 rounded-full border border-input bg-background pl-12 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="border rounded-xl p-8 hover:shadow-md transition-shadow cursor-pointer bg-card">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <LifeBuoy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Learn the basics of creating your first resume, choosing templates, and exporting PDFs.
              </p>
              <span className="text-sm font-medium text-primary hover:underline">Read articles →</span>
            </div>

            <div className="border rounded-xl p-8 hover:shadow-md transition-shadow cursor-pointer bg-card">
              <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mb-6">
                <FileText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Templates & Design</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Articles on customizing colors, fonts, margins, and section orders for your resume.
              </p>
              <span className="text-sm font-medium text-primary hover:underline">Read articles →</span>
            </div>

            <div className="border rounded-xl p-8 hover:shadow-md transition-shadow cursor-pointer bg-card">
              <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI & ATS features</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                How to use our AI to write better bullet points and pass Applicant Tracking Systems.
              </p>
              <span className="text-sm font-medium text-primary hover:underline">Read articles →</span>
            </div>
          </div>

          <div className="mt-20 border-t pt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Can I use Resume Builder for free?</h4>
                <p className="text-sm text-muted-foreground">Yes! You get 100 free credits when you sign up to build and export your resume.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">How does the ATS scanner work?</h4>
                <p className="text-sm text-muted-foreground">Our ATS scanner compares your resume against a job description you provide and gives you a match score and keywords to include.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Can I download my resume as a Word document?</h4>
                <p className="text-sm text-muted-foreground">Currently, we only support high-quality PDF exports as this format ensures your layout stays perfect across all devices.</p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Is my data secure?</h4>
                <p className="text-sm text-muted-foreground">Absolutely. We use industry-standard encryption and never sell your personal data to third parties.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
