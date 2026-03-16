import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';

export const metadata = {
  title: 'Frequently Asked Questions',
  description: 'Answers to common questions about Resume Builder.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "Can I use Resume Builder for free?",
      answer: "Yes! You get 100 free credits when you sign up to build and export your resume. This is generally enough for multiple resume generations."
    },
    {
      question: "How does the ATS scanner work?",
      answer: "Our ATS scanner compares your resume against a job description you provide and gives you a match score along with keywords you are missing."
    },
    {
      question: "Can I download my resume as a Word document?",
      answer: "Currently, we only support high-quality PDF exports as this format ensures your layout stays perfect across all devices and Applicant Tracking Systems."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption and never sell your personal data to third parties. Your data is yours."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your premium subscription at any time from your account settings. You will retain access until the end of your billing period."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 14-day money-back guarantee if you are not satisfied with our premium features. Contact support for assistance."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />
      
      <main className="flex-1 py-20 px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight mb-4 text-center">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground text-center mb-12">
            Find answers to common questions about our platform and services.
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-6 bg-card">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center border-t pt-8">
            <h2 className="text-xl font-semibold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground mb-4">
              Our support team is always ready to help you with any issue.
            </p>
            <a href="/contact" className="text-primary hover:underline font-medium">Contact Us →</a>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
