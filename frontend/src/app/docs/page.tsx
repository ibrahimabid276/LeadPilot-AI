import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, Book, Code, Mail, Users, BarChart3, Key, Globe, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Documentation — LeadPilot AI",
  description: "Complete documentation for the LeadPilot AI platform. Learn how to use our API, integrations, and features.",
  openGraph: {
    title: "Documentation — LeadPilot AI",
    description: "Complete documentation for the LeadPilot AI platform.",
    type: "website",
  },
};

const docSections = [
  {
    title: "Getting Started",
    icon: Book,
    color: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-500/10",
    articles: [
      { title: "Quick Start Guide", description: "Get up and running with LeadPilot in 5 minutes" },
      { title: "Account Setup", description: "Configure your account and team settings" },
      { title: "First Campaign", description: "Create your first outreach campaign" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    color: "text-green-500",
    bg: "bg-green-100 dark:bg-green-500/10",
    articles: [
      { title: "Authentication", description: "Learn about API keys and JWT authentication" },
      { title: "Leads API", description: "Discover, score, and manage leads via API" },
      { title: "Emails API", description: "Send and track emails programmatically" },
      { title: "Webhooks", description: "Receive real-time event notifications" },
    ],
  },
  {
    title: "Lead Discovery",
    icon: Search,
    color: "text-purple-500",
    bg: "bg-purple-100 dark:bg-purple-500/10",
    articles: [
      { title: "Search Filters", description: "Use country, city, and industry filters" },
      { title: "AI Lead Scoring", description: "Understand how AI scores your leads" },
      { title: "Website Audit", description: "Analyze lead websites for talking points" },
      { title: "Import & Export", description: "Import leads from CSV or export your data" },
    ],
  },
  {
    title: "Email Outreach",
    icon: Mail,
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-500/10",
    articles: [
      { title: "AI Email Generator", description: "Generate personalized emails with AI" },
      { title: "Email Templates", description: "Create and manage reusable templates" },
      { title: "Follow-up Strategies", description: "Best practices for follow-up emails" },
      { title: "Tracking & Analytics", description: "Monitor email delivery and open rates" },
    ],
  },
  {
    title: "CRM Pipeline",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-100 dark:bg-indigo-500/10",
    articles: [
      { title: "Pipeline Stages", description: "Understand the CRM pipeline stages" },
      { title: "Drag & Drop", description: "Move leads between stages visually" },
      { title: "AI Suggestions", description: "Get AI-powered next action recommendations" },
      { title: "Notes & Activity", description: "Track interactions with each lead" },
    ],
  },
  {
    title: "Integrations",
    icon: Globe,
    color: "text-cyan-500",
    bg: "bg-cyan-100 dark:bg-cyan-500/10",
    articles: [
      { title: "Overview", description: "Available integrations and how to connect them" },
      { title: "Slack Notifications", description: "Get notified in Slack when leads respond" },
      { title: "Zapier", description: "Connect to 5,000+ apps via Zapier" },
      { title: "API Keys", description: "Manage your API keys for custom integrations" },
    ],
  },
];

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
              <Link href="/blog" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Blog</Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Get Started <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Documentation
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Everything you need to know about LeadPilot AI. From getting started to advanced API usage.
          </p>
          <div className="mt-8 relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Documentation sections */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section) => {
              const Icon = section.icon;
              return (
                <div
                  key={section.title}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md transition-all card-hover"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${section.bg}`}>
                      <Icon size={20} className={section.color} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">{section.title}</h2>
                  </div>
                  <ul className="space-y-3">
                    {section.articles.map((article) => (
                      <li key={article.title}>
                        <button className="w-full text-left group">
                          <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {article.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {article.description}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">LeadPilot AI</span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} LeadPilot AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
