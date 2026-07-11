import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Bug, Wrench, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Changelog — LeadPilot AI",
  description: "Track all updates, improvements, and fixes to the LeadPilot AI platform.",
};

const changelog = [
  {
    version: "2.5.0",
    date: "2026-07-10",
    highlights: ["AI Chat Assistant", "Webhook Management", "Email Templates"],
    changes: [
      { type: "feature", description: "AI Chat Assistant on dashboard for real-time sales guidance" },
      { type: "feature", description: "Webhook management page with event subscriptions" },
      { type: "feature", description: "Email templates with variable personalization" },
      { type: "feature", description: "AI predictions panel on analytics page" },
      { type: "improvement", description: "CRM cards now show AI-powered next action suggestions" },
      { type: "improvement", description: "Email page includes AI follow-up tips" },
    ],
  },
  {
    version: "2.4.0",
    date: "2026-07-05",
    highlights: ["Team Management", "Billing Dashboard", "Audit History"],
    changes: [
      { type: "feature", description: "Team management with roles (Owner, Admin, Member, Viewer)" },
      { type: "feature", description: "Billing dashboard with usage stats and invoice history" },
      { type: "feature", description: "Audit history page with searchable activity log" },
      { type: "feature", description: "API keys management with create/reveal/revoke" },
      { type: "improvement", description: "Sidebar navigation expanded with all new sections" },
    ],
  },
  {
    version: "2.3.0",
    date: "2026-06-28",
    highlights: ["Integrations Page", "CSV Import", "Keyboard Shortcuts"],
    changes: [
      { type: "feature", description: "Integrations marketplace with 9+ platform connections" },
      { type: "feature", description: "CSV import modal for bulk lead uploads" },
      { type: "feature", description: "Keyboard shortcuts help modal (press / to open)" },
      { type: "feature", description: "Notification center with real-time alerts" },
      { type: "improvement", description: "Performance: lazy-loaded drag-and-drop library" },
      { type: "bugfix", description: "Fixed theme provider SSR prerendering issue" },
    ],
  },
  {
    version: "2.2.0",
    date: "2026-06-20",
    highlights: ["AI Lead Scoring", "Website Audit", "Blog"],
    changes: [
      { type: "feature", description: "AI lead scoring with detailed factor analysis" },
      { type: "feature", description: "AI website audit with pain points and talking points" },
      { type: "feature", description: "Blog page with featured articles and categories" },
      { type: "feature", description: "Documentation portal with searchable sections" },
      { type: "improvement", description: "Dashboard includes AI insights panel" },
    ],
  },
  {
    version: "2.1.0",
    date: "2026-06-12",
    highlights: ["Onboarding Wizard", "Command Palette", "Dark/Light Mode"],
    changes: [
      { type: "feature", description: "5-step onboarding wizard for new users" },
      { type: "feature", description: "Command palette (Cmd+K) for quick navigation" },
      { type: "feature", description: "Complete dark/light mode theme system" },
      { type: "feature", description: "Pricing page with 3 tiers and FAQ" },
      { type: "improvement", description: "All pages polished with premium design" },
    ],
  },
  {
    version: "2.0.0",
    date: "2026-06-01",
    highlights: ["Complete Redesign", "CRM Pipeline", "Email Outreach"],
    changes: [
      { type: "feature", description: "Complete UI redesign with premium design system" },
      { type: "feature", description: "Drag-and-drop CRM pipeline with 6 stages" },
      { type: "feature", description: "AI-powered email generation and sending" },
      { type: "feature", description: "Analytics dashboard with charts and breakdowns" },
      { type: "feature", description: "Landing page with hero, features, pricing, and CTA" },
      { type: "improvement", description: "Security: JWT auth, rate limiting, input sanitization" },
    ],
  },
];

const typeConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  feature: { label: "Feature", color: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10", icon: Sparkles },
  improvement: { label: "Improvement", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10", icon: TrendingUp },
  bugfix: { label: "Bug Fix", color: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10", icon: Bug },
};

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/leadpilot_logo_icon.png"
                alt="LeadPilot AI"
                className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20"
              />
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
              <Link href="/docs" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Docs</Link>
              <Link href="/blog" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link>
              <Link href="/sign-up" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">Changelog</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            All the latest updates, improvements, and fixes to LeadPilot AI.
          </p>
        </div>
      </section>

      {/* Changelog */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            <div className="space-y-12">
              {changelog.map((release, idx) => (
                <div key={release.version} className="relative sm:pl-16">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-1 h-4 w-4 rounded-full border-2 hidden sm:block ${idx === 0 ? "border-blue-500 bg-blue-500" : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"}`} />

                  {/* Version header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">v{release.version}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(release.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    {idx === 0 && (
                      <span className="rounded-full bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">Latest</span>
                    )}
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {release.highlights.map((h) => (
                      <span key={h} className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Changes */}
                  <div className="space-y-2">
                    {release.changes.map((change, i) => {
                      const config = typeConfig[change.type];
                      const Icon = config.icon;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 mt-0.5 ${config.color}`}>
                            <Icon size={10} />
                            {config.label}
                          </span>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{change.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img
              src="/leadpilot_logo_icon.png"
              alt="LeadPilot AI"
              className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20"
            />
            <span className="text-lg font-bold text-slate-900 dark:text-white">LeadPilot AI</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} LeadPilot AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
