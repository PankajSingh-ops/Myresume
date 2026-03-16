import { PublicHeader } from '@/components/layout/PublicHeader';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { Check, Star, ArrowRight, TrendingUp, CoinsIcon, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Pricing | Resume Builder',
  description: 'Simple, transparent pricing for Resume Builder.',
};

const PRICING_PLANS = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 500,
    price: 4.99,
    originalPrice: 9.99,
    description: 'Perfect for creating your first professional resume.',
    features: [
      'AI writing assistance',
      'Standard resume templates',
      'Full editing capabilities',
      'Standard support',
    ],
    popular: false,
    savings: '50% Off',
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 1000,
    price: 9.99,
    originalPrice: 19.99,
    description: 'Best value for active job seekers looking to stand out.',
    popular: true,
    features: [
      'Advanced AI bullet generation',
      'Premium resume templates',
      'Cover letter builder',
      'Priority support',
    ],
    savings: '50% Off',
  },
  {
    id: 'power',
    name: 'Power User',
    credits: 2000,
    price: 15.99,
    originalPrice: 31.99,
    description: 'For career coaches and professionals doing heavy iterations.',
    popular: false,
    features: [
      'Unlimited AI revisions',
      'All premium templates & formats',
      'Multiple resume versions',
      '24/7 Premium support',
    ],
    savings: '50% Off',
  },
];

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <PublicHeader />

      <main className="flex-1 py-20 px-6">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Choose Your Plan
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unlock powerful AI-driven resume creation with flexible credit packages.
              Pay once, use anytime—no subscriptions, no surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 bg-card flex flex-col transition-all duration-200 ${plan.popular
                    ? 'border-2 border-primary shadow-lg shadow-primary/10 md:scale-105 z-10'
                    : 'border border-border/50 shadow-sm hover:shadow-md'
                  }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" /> Most Popular
                  </div>
                )}

                {/* Savings Badge */}
                <div className="flex justify-end mb-2 h-6">
                  {plan.savings && (
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${plan.popular
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                        }`}
                    >
                      {plan.savings}
                    </span>
                  )}
                </div>

                {/* Plan Name & Description */}
                <h3 className="text-2xl md:text-3xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed min-h-[3rem] mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-6 space-y-2">
                  {plan.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${plan.originalPrice}
                    </span>
                  )}
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-extrabold tracking-tight">${plan.price}</span>
                    <span className="text-muted-foreground text-lg mb-1">USD</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CoinsIcon className="h-4 w-4" />
                    <span className="font-bold text-foreground">{plan.credits} Credits</span>
                    <span>• ${(plan.price / plan.credits).toFixed(3)} per credit</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm">
                      <div className="shrink-0 mt-0.5 rounded-full p-1 bg-primary/10 text-primary">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`w-full inline-flex h-12 items-center justify-center rounded-lg font-semibold transition-all gap-2 group ${plan.popular
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'border border-input bg-background hover:bg-muted'
                    }`}
                >
                  Get {plan.credits} Credits
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-16 px-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">No Subscription</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CoinsIcon className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium">Instant Access</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Credits never expire • 💳 One-time payment • 🔒 Secure checkout</p>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
