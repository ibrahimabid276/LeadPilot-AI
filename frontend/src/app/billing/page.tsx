"use client";

import { useState } from "react";
import { CreditCard, Check, Download, Zap, TrendingUp, Calendar, ArrowUpRight } from "lucide-react";

const currentPlan = {
  name: "Professional",
  price: 79,
  period: "month",
  status: "active",
  nextBilling: "2026-08-10",
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
};

const usageStats = [
  { label: "Leads Used", current: 2847, limit: 5000, unit: "leads" },
  { label: "Emails Sent", current: 1234, limit: 10000, unit: "emails" },
  { label: "Team Members", current: 3, limit: 5, unit: "members" },
];

const invoices = [
  { id: "INV-001", date: "2026-07-10", amount: 79, status: "paid" },
  { id: "INV-002", date: "2026-06-10", amount: 79, status: "paid" },
  { id: "INV-003", date: "2026-05-10", amount: 79, status: "paid" },
  { id: "INV-004", date: "2026-04-10", amount: 79, status: "paid" },
];

export default function BillingPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-amber-500";
    return "bg-green-500";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Billing & Subscription</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your subscription, view usage, and download invoices.
          </p>
        </div>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Zap size={16} /> Upgrade Plan
        </button>
      </div>

      {/* Current Plan */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentPlan.name}</h2>
              <span className="rounded-full bg-green-100 dark:bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                Active
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ${currentPlan.price}/{currentPlan.period} · Next billing: {new Date(currentPlan.nextBilling).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={20} className="text-slate-400" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Visa ending in 4242</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          {currentPlan.features.slice(0, 4).map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <Check size={14} className="text-green-500 shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {usageStats.map((stat) => {
          const percentage = getUsagePercentage(stat.current, stat.limit);
          return (
            <div key={stat.label} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.label}</h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.current.toLocaleString()} / {stat.limit.toLocaleString()}
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getUsageColor(percentage)}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                {percentage.toFixed(0)}% used · {stat.limit - stat.current} {stat.unit} remaining
              </p>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Invoice History</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <Calendar size={16} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{invoice.id}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(invoice.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">${invoice.amount}</span>
                <span className="rounded-full bg-green-100 dark:bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
                  {invoice.status}
                </span>
                <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <Download size={14} />
                </button>
              </div>
            </div>
          ))}
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
