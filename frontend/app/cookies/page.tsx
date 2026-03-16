import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Cookie Policy',
  description: 'Cookie Policy for Resume Builder.',
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Cookie Policy</h1>
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            
            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">What Are Cookies</h2>
              <p>
                As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. 
                This page describes what information they gather, how we use it, and why we sometimes need to store these cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">How We Use Cookies</h2>
              <p>
                We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Types of Cookies We Use</h2>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Account related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration.
                </li>
                <li>
                  <strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page.
                </li>
                <li>
                  <strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">Disabling Cookies</h2>
              <p>
                You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this).
                Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.
              </p>
            </section>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
