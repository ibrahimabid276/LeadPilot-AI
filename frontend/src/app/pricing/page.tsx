'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { billingApi } from '@/lib/api';
import { createClient } from '@/lib/supabase';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for solopreneurs and small teams getting started',
      features: [
        '500 leads per month',
        'Basic AI email generation',
        'CRM with drag-and-drop',
        'Email campaign manager',
        'CSV export',
        'Email support',
      ],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$79',
      period: '/month',
      description: 'For growing teams that need advanced features',
      features: [
        '5,000 leads per month',
        'Advanced AI features',
        'Website analyzer',
        'Competitor analysis',
        'Team collaboration (5 seats)',
        'Priority support',
        'API access',
        'Custom integrations',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For large teams with advanced needs',
      features: [
        'Unlimited leads',
        'All AI features',
        'Unlimited team seats',
        'Dedicated account manager',
        'Custom AI training',
        'SSO & SAML',
        'Advanced analytics',
        'SLA guarantee',
        'On-premise deployment',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const handlePlanClick = async (planId: string, cta: string) => {
    if (cta === 'Contact Sales') {
      window.location.href = 'mailto:sales@leadpilot.ai?subject=Enterprise%20Plan%20Inquiry%20-%20LeadPilot%20AI';
      return;
    }

    setLoading(planId);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.push('/sign-up');
        return;
      }

      const response = await billingApi.createCheckout(planId as 'starter' | 'professional' | 'enterprise');
      window.location.href = response.data.checkout_url;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create checkout session';
      setError(message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees. Cancel anytime.
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border-2 transition-all hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? 'border-blue-500 dark:border-blue-400' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">{plan.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-5xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700 dark:text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanClick(plan.id, plan.cta)}
                disabled={loading !== null}
                className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
                    : 'bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900'
                }`}
              >
                {loading === plan.id ? 'Redirecting...' : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4 mt-8">
            {[
              {
                q: 'Can I try before I buy?',
                a: 'Yes! All plans come with a 14-day free trial. No credit card required.',
              },
              {
                q: 'Can I change plans later?',
                a: 'Absolutely. You can upgrade or downgrade your plan at any time.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
              },
              {
                q: 'Is there a setup fee?',
                a: 'No setup fees. Cancel anytime with no penalties.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
