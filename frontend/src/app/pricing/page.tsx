'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { billingApi } from '@/lib/api';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowRight, Check, X as XIcon, ChevronDown, ChevronUp } from 'lucide-react';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
        '1 team member',
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
        'Advanced AI (scoring, website intelligence)',
        'Website analyzer',
        'Competitor analysis',
        'Team collaboration (5 seats)',
        'API access',
        'Priority support',
        'CSV import/export',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'For organizations that need full power and control',
      features: [
        'Unlimited leads',
        'Custom AI training',
        'Unlimited team seats',
        'Dedicated account manager',
        'SSO / SAML',
        'API access',
        'Advanced analytics',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  const comparisonFeatures = [
    { name: 'Leads', starter: '500/month', professional: '5,000/month', enterprise: 'Unlimited' },
    { name: 'AI Features', starter: 'Basic email generation', professional: 'Advanced (scoring, website intelligence)', enterprise: 'Custom AI training' },
    { name: 'Team Seats', starter: '1', professional: '5', enterprise: 'Unlimited' },
    { name: 'API Access', starter: false, professional: true, enterprise: true },
    { name: 'Support', starter: 'Email', professional: 'Priority', enterprise: 'Dedicated account manager' },
    { name: 'SSO / SLA', starter: false, professional: false, enterprise: true },
    { name: 'CRM Pipeline', starter: true, professional: true, enterprise: true },
    { name: 'Email Campaigns', starter: true, professional: true, enterprise: true },
    { name: 'Website Intelligence', starter: false, professional: true, enterprise: true },
    { name: 'CSV Import/Export', starter: true, professional: true, enterprise: true },
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

  const faqs = [
    {
      q: 'Can I try before I buy?',
      a: 'Yes! All plans come with a 14-day free trial. No credit card required.',
    },
    {
      q: 'Can I change plans later?',
      a: 'Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
    },
    {
      q: 'Are there any setup fees?',
      a: 'No setup fees or hidden charges. The price you see is the price you pay.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.',
    },
  ];

  const renderCellValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check size={18} className="text-green-500 mx-auto" />
      ) : (
        <span className="text-gray-400 dark:text-gray-600 text-gray-300">&ndash;</span>
      );
    }
    return <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/leadpilot_logo_icon.png" alt="LeadPilot AI" className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20" />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm font-medium text-blue-600 dark:text-blue-400">Pricing</Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Login</Link>
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">Start Free</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20 container mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="mt-20">
          {/* Feature Comparison Table */}
          <div className="max-w-5xl mx-auto mb-20">
            <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white text-center">Compare Plans</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800">
                      <th className="text-left py-4 px-6 text-sm font-medium text-slate-600 dark:text-slate-400 w-1/4">Feature</th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white w-1/4">Starter</th>
                      <th className="text-center py-4 px-6 w-1/4 bg-blue-50 dark:bg-blue-500/5">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Professional</span>
                      </th>
                      <th className="text-center py-4 px-6 text-sm font-semibold text-slate-900 dark:text-white w-1/4">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, idx) => (
                      <tr key={feature.name} className={idx < comparisonFeatures.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''}>
                        <td className="py-3.5 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">{feature.name}</td>
                        <td className="py-3.5 px-6 text-center">{renderCellValue(feature.starter)}</td>
                        <td className="py-3.5 px-6 text-center bg-blue-50/50 dark:bg-blue-500/5">{renderCellValue(feature.professional)}</td>
                        <td className="py-3.5 px-6 text-center">{renderCellValue(feature.enterprise)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">Everything you need to know about our pricing.</p>
            <div className="max-w-3xl mx-auto space-y-3 mt-8">
              {faqs.map((faq, idx) => (
                <div key={faq.q} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{faq.q}</h3>
                    {openFaq === idx ? (
                      <ChevronUp size={20} className="text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6">
                      <p className="text-slate-600 dark:text-slate-400">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <img src="/leadpilot_logo_icon.png" alt="LeadPilot AI" className="h-7 w-7 rounded-lg" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">LeadPilot AI</span>
            </div>
            <p className="text-sm text-slate-500">&copy; 2026 LeadPilot AI. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms</Link>
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy</Link>
              <a href="mailto:sales@leadpilot.ai" className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
