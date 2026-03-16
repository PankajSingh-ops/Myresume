import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for using Resume Builder.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Resume Builder, you accept and agree to be bound by the terms and provision of this agreement.
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. User Accounts</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for safeguarding the password that you use to access the service.</li>
                <li>We reserve the right to suspend or terminate your account if any information provided proves to be inaccurate, not current, or incomplete.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Prohibited Uses</h2>
              <p>You may use our Service only for lawful purposes. You may not use our Service:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>In any way that breaches any applicable local, national or international law or regulation.</li>
                <li>In any way that is unlawful or fraudulent, or has any unlawful or fraudulent purpose or effect.</li>
                <li>For the purpose of harming or attempting to harm minors in any way.</li>
                <li>To transmit, or procure the sending of, any unsolicited or unauthorised advertising or promotional material.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Intellectual Property</h2>
              <p>
                The Service and its original content, features, and functionality are and will remain the exclusive property of Resume Builder and its licensors.
                The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Disclaimer</h2>
              <p>
                Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis.
                The Service is provided without warranties of any kind, whether express or implied.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
