"use client";

import { useState, useEffect } from "react";
import { CreditCard, Check, Download, Zap, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";
import { billingApi } from "@/lib/api";
import Link from "next/link";

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await billingApi.getSubscription();
        setSubscription(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscription data');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const getPlanDetails = (plan: string) => {
    const plans: Record<string, { name: string; price: number; features: string[] }> = {
      starter: {
        name: "Starter",
        price: 29,
        features: [
          "500 leads/month",
          "Basic AI email generation",
          "CRM with drag-and-drop",
          "Email campaign manager",
          "CSV export",
          "1 team member",
          "Email support",
        ],
      },
      professional: {
        name: "Professional",
        price: 79,
        features: [
          "5,000 leads/month",
          "AI email sequences",
          "Advanced CRM + analytics",
          "Website intelligence",
          "Lead scoring AI",
          "5 team members",
          "Priority support",
          "CSV import/export",
        ],
      },
      enterprise: {
        name: "Enterprise",
        price: 199,
        features: [
          "Unlimited leads",
          "AI campaign generator",
          "Custom integrations",
          "API access",
          "White-label options",
          "Unlimited team members",
          "Dedicated support",
          "SLA guarantee",
        ],
      },
    };
    return plans[plan] || plans.starter;
  };

  const isActiveSubscription = subscription && (subscription.subscription_status === 'active' || subscription.subscription_status === 'trialing');

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-600 dark:text-slate-400">Loading subscription data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600 dark:text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Billing & Subscription</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your subscription, view usage, and download invoices.
          </p>
        </div>
        {!isActiveSubscription && (
          <Link
            href="/pricing"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Zap size={16} /> View Plans
          </Link>
        )}
      </div>

      {/* Current Plan */}
      {isActiveSubscription ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{getPlanDetails(subscription.plan).name}</h2>
                <span className="rounded-full bg-green-100 dark:bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                  {subscription.subscription_status === 'trialing' ? 'Trial' : 'Active'}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                ${getPlanDetails(subscription.plan).price}/month
                {subscription.trial_ends_at && subscription.subscription_status === 'trialing' && (
                  <> · Trial ends: {new Date(subscription.trial_ends_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Managed via Lemon Squeezy</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            {getPlanDetails(subscription.plan).features.slice(0, 4).map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <Check size={14} className="text-green-500 shrink-0" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10">
              <Zap size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Subscription</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
            You don't have an active subscription yet. Choose a plan to unlock all features and start generating leads.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <ArrowUpRight size={16} /> View Pricing Plans
          </Link>
        </div>
      )}

      {/* Usage Stats - Only show for active subscriptions */}
      {isActiveSubscription && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Usage Statistics</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Detailed usage statistics will be available once usage tracking is implemented.
          </p>
        </div>
      )}

      {/* Invoices */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Invoice History</h2>
        </div>
        <div className="px-5 py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <Calendar size={24} className="text-slate-400" />
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Invoice history will appear here once Lemon Squeezy integration is complete.
          </p>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upgrade Your Plan</h2>
            <div className="space-y-3 mb-6">
              {[
                { name: "Starter", price: 29, features: ["500 leads/month", "Basic CRM", "Email support"] },
                { name: "Professional", price: 79, features: ["5,000 leads/month", "Advanced CRM", "Priority support"], current: true },
                { name: "Enterprise", price: 199, features: ["Unlimited leads", "API access", "Dedicated support"] },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-xl border p-4 ${
                    plan.current
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                  } transition-colors`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
                      {plan.current && (
                        <span className="rounded-full bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">${plan.price}/mo</span>
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Check size={12} className="text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
