import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and data handling practices for Resume Builder.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to Resume Builder. We respect your privacy and are committed to protecting your personal data. 
                This privacy policy will inform you about how we look after your personal data when you visit our website 
                and tell you about your privacy rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Data We Collect</h2>
              <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                <li><strong>Resume Data</strong> includes employment history, education, skills, and other information you provide for your resume.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Data</h2>
              <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing the resume building service).</li>
                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                <li>Where we need to comply with a legal obligation.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us via our Contact page.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
