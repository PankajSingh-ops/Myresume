import Link from 'next/link';
import { FileText } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t bg-muted/10 pt-16 pb-8 mt-auto">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <FileText className="h-4 w-4" />
              </div>
              Resume Builder
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              Build professional, ATS-friendly resumes in minutes with AI-powered suggestions. Stand out from the crowd and land your dream job.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Product</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/templates" className="hover:text-foreground transition-colors">Resume Templates</Link></li>
              <li><Link href="/plans" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/cover-templates" className="hover:text-foreground transition-colors">Cover Templates</Link></li>
              <li><Link href="/ats" className="hover:text-foreground transition-colors">ATS Scanner</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
