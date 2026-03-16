'use client';

import { useState } from 'react';
import { ShieldCheck, Check, ArrowRight, TrendingUp, CoinsIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { useCreditsStore } from '@/store/creditsStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { loadRazorpayScript } from '@/lib/razorpay';
import { api } from '@/lib/api';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
            'Standard support'
        ],
        popular: false,
        savings: '50% Off'
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
            'Priority support'
        ],
        savings: '50% Off'
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
            '24/7 Premium support'
        ],
        savings: '50% Off'
    }
];

export default function PricingPage() {
    const { theme } = useTheme();
    const balance = useCreditsStore((s) => s.balance);
    const setBalance = useCreditsStore((s) => s.setBalance);
    const user = useAuthStore((s) => s.user);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handlePurchase = async (planId: string) => {
        const plan = PRICING_PLANS.find(p => p.id === planId);
        if (!plan) return;

        try {
            setIsProcessing(planId);

            // 1. Load Razorpay script
            const res = await loadRazorpayScript();
            if (!res) {
                toast.error('Failed to load Razorpay SDK. Are you online?');
                return;
            }

            // 2. Create Order on Backend
            // Razorpay expects amounts in cents/paise
            const amountCents = Math.round(plan.price * 100);

            const { data: orderData } = await api.post('/payments/create-order', {
                planId: plan.id,
                credits: plan.credits,
                amount: amountCents
            });

            // 3. Initialize Razorpay Checkout
            // Provide a fallback NEXT_PUBLIC_RAZORPAY_KEY_ID just in case, or expect it in env
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'RAZORPAY_KEY_ID_NOT_SET',
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: 'MyResume',
                description: `Purchase ${plan.credits} Credits - ${plan.name}`,
                order_id: orderData.order.razorpay_order_id,
                theme: {
                    color: theme === 'dark' ? '#0f172a' : '#2563eb',
                },
                prefill: {
                    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
                    email: user?.email || '',
                },
                handler: async function (response: any) {
                    try {
                        setIsProcessing(planId); // Set back to processing while verifying

                        // 4. Verify Payment Server-Side
                        const { data: verificationData } = await api.post('/payments/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        toast.success(`Success! Added ${plan.credits} credits to your account.`);

                        // Optimistically update the local credits store
                        if (balance !== null) {
                            setBalance(balance + plan.credits);
                        }

                    } catch (error: any) {
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                    } finally {
                        setIsProcessing(null);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(null);
                        toast.info('Payment cancelled');
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error(response.error.description || 'Payment failed');
                setIsProcessing(null);
            });
            rzp.open();

        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to start payment process');
            setIsProcessing(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                {/* Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
                    <Badge
                        variant="outline"
                        className="mb-2 bg-primary/5 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium"
                    >
                        <CoinsIcon className="h-3.5 w-3.5 mr-2 inline-block" />
                        Current Balance: <span className="font-bold ml-1.5">{balance ?? '...'} Credits</span>
                    </Badge>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                        Choose Your Plan
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Unlock powerful AI-driven resume creation with flexible credit packages.
                        Pay once, use anytime—no subscriptions, no surprises.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-7xl mx-auto mb-12">
                    {PRICING_PLANS.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`
                                relative flex flex-col overflow-hidden transition-all duration-200
                                ${plan.popular
                                    ? 'border-2 border-primary shadow-md lg:scale-105 z-10'
                                    : 'border border-border/50 shadow-sm hover:shadow-md'
                                }
                                bg-card
                            `}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-0 left-0 right-0">
                                    <div className="bg-primary text-primary-foreground text-center py-1.5 px-4">
                                        <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
                                            <TrendingUp className="h-4 w-4" />
                                            Most Popular Choice
                                        </div>
                                    </div>
                                </div>
                            )}

                            <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-8'} pb-4 px-6`}>
                                <div className="flex justify-end mb-2 h-6">
                                    {plan.savings && (
                                        <Badge variant={plan.popular ? "default" : "secondary"} className="font-semibold text-xs py-1">
                                            {plan.savings}
                                        </Badge>
                                    )}
                                </div>

                                {/* Plan Name */}
                                <CardTitle className="text-2xl sm:text-3xl font-bold mb-2">
                                    {plan.name}
                                </CardTitle>

                                {/* Description */}
                                <CardDescription className="text-sm sm:text-base leading-relaxed min-h-[3rem]">
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="grow px-6 space-y-6">
                                {/* Price */}
                                <div className="space-y-3">
                                    <div className="flex flex-col gap-1">
                                        {plan.originalPrice && (
                                            <span className="text-lg text-muted-foreground line-through">
                                                ${plan.originalPrice}
                                            </span>
                                        )}
                                        <div className="flex items-end gap-2 text-foreground">
                                            <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                                                ${plan.price}
                                            </span>
                                            <span className="text-muted-foreground text-lg mb-2">
                                                USD
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="h-px flex-1 bg-border/50"></div>
                                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50">
                                            <CoinsIcon className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-bold text-sm text-foreground">
                                                {plan.credits} Credits
                                            </span>
                                        </div>
                                        <div className="h-px flex-1 bg-border/50"></div>
                                    </div>

                                    {/* Cost per credit */}
                                    <div className="text-center">
                                        <p className="text-xs text-muted-foreground">
                                            ${(plan.price / plan.credits).toFixed(3)} per credit
                                        </p>
                                    </div>
                                </div>

                                {/* Features List */}
                                <ul className="space-y-4 pt-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="shrink-0 mt-0.5 rounded-full p-1 bg-primary/10 text-primary">
                                                <Check className="h-3.5 w-3.5" />
                                            </div>
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>

                            <CardFooter className="px-6 pb-8 pt-6">
                                <Button
                                    className="w-full text-base font-semibold py-6 cursor-pointer group"
                                    variant={plan.popular ? 'default' : 'outline'}
                                    disabled={isProcessing === plan.id}
                                    onClick={() => handlePurchase(plan.id)}
                                >
                                    {isProcessing === plan.id ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Get {plan.credits} Credits
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-12 px-4">
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

                {/* FAQ / Contact Section */}
                <div className="mt-16 text-center">
                    <Card className="max-w-2xl mx-auto border-border/50 bg-card">
                        <CardContent className="pt-8 pb-8 px-6">
                            <h3 className="text-lg font-semibold mb-2 text-foreground">Need a custom solution?</h3>
                            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                                Looking for team licenses, educational pricing, or enterprise volumes?
                                We'd love to help you find the perfect plan.
                            </p>
                            <Button variant="outline" className="gap-2" asChild>
                                <a href="mailto:support@myresume.com">
                                    Contact Sales Team
                                    <ArrowRight className="h-4 w-4" />
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-xs sm:text-sm text-muted-foreground">
                    <p>Credits never expire • 💳 One-time payment • 🔒 Secure checkout</p>
                </div>
            </div>
        </div>
    );
}