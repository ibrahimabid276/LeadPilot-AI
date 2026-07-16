"use client";

import { useEffect } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Mail,
  BarChart3,
  Shield,
  Sparkles,
  ArrowRight,
  Check,
  Users,
  Globe,
  Brain,
  Zap,
  TrendingUp,
  Clock,
  Search,
  Wand2,
} from "lucide-react";
import { useTheme } from "./components/providers/ThemeProvider";

export const metadata: Metadata = {
  title: "LeadPilot AI — AI-Powered Lead Generation & Outreach Platform",
  description:
    "Discover, score, and convert leads with AI-powered outreach. Find prospects using smart business discovery, generate personalized emails, and manage your sales pipeline — all in one platform.",
  openGraph: {
    title: "LeadPilot AI — AI-Powered Lead Generation Platform",
    description:
      "Discover, score, and convert leads with AI-powered outreach. All in one platform.",
    type: "website",
    locale: "en_US",
    siteName: "LeadPilot AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadPilot AI — AI-Powered Lead Generation Platform",
    description: "Discover, score, and convert leads with AI-powered outreach.",
  },
};

const features = [
  {
    icon: Target,
    title: "Smart Lead Discovery",
    description:
      "Search by location, industry, keywords, and tech stack to find businesses matching your ideal customer profile.",
    benefit: "Save hours on lead research",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "AI Lead Scoring",
    description:
      "Automatically score leads based on online presence and engagement signals to prioritize high-value prospects.",
    benefit: "Focus on leads most likely to convert",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Mail,
    title: "AI Email Generator",
    description:
      "Generate personalized outreach emails in seconds. AI crafts compelling messages tailored to each lead's business.",
    benefit: "Write 10x more outreach in less time",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Visual CRM Pipeline",
    description:
      "Drag-and-drop Kanban board to manage leads and deals through every stage of your sales process.",
    benefit: "Never lose track of a deal again",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track open rates, reply rates, and conversion metrics with beautiful, actionable dashboards.",
    benefit: "Know exactly what's working",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Globe,
    title: "Website Intelligence",
    description:
      "Analyze competitor websites and identify pain points, tech stack, and talking points for personalized outreach.",
    benefit: "Uncover insights your competitors miss",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
];

const stats = [
  { value: "10x", label: "Faster Lead Research", description: "Find qualified leads 10x faster than manual research", icon: Zap },
  { value: "85%", label: "Email Personalization", description: "AI-crafted messages tailored to each prospect", icon: Mail },
  { value: "3x", label: "Higher Response Rates", description: "Personalized outreach that gets real replies", icon: TrendingUp },
  { value: "24/7", label: "AI-Powered Outreach", description: "Automated campaigns running around the clock", icon: Clock },
];

const pricingPlans = [
  {
    id: 'starter',
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for solopreneurs and small teams getting started.",
    features: [
      "500 leads/month",
      "AI email generation",
      "Basic CRM pipeline",
      "Email tracking",
      "1 team member",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: 'professional',
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For growing teams that need advanced features.",
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
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: 'enterprise',
    name: "Enterprise",
    price: "$199",
    period: "/month",
    description: "For organizations that need full power and control.",
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
    cta: "Contact Sales",
    popular: false,
  },
];

export default function LandingPage() {
  const { theme } = useTheme();
  
  // Ensure dark class is applied immediately to root for dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/leadpilot_logo_icon.png"
                alt="LeadPilot AI"
                className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                LeadPilot AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Start Free
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 mb-8">
            <Sparkles size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-400">AI-Powered Lead Generation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            Find leads. Generate emails.{" "}
            <span className="gradient-text">Close deals.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
            AI-powered lead research and outreach platform for sales teams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start Free Trial
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 bg-gray-800/50 px-8 py-4 text-base font-semibold text-gray-300 hover:bg-gray-700 transition-all"
            >
              See Demo
            </a>
          </div>

          {/* Dashboard Illustration */}
          <div className="mx-auto max-w-4xl mb-16">
            <div className="relative rounded-2xl border border-gray-800 bg-gray-900/50 p-2 shadow-2xl shadow-blue-500/10">
              <div className="rounded-xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 min-h-[320px] flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                  <div className="col-span-2 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-blue-500/20" />
                    <div className="h-3 w-full rounded bg-gray-700/30" />
                    <div className="h-3 w-5/6 rounded bg-gray-700/30" />
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 p-3">
                        <div className="h-3 w-12 rounded bg-blue-400/40 mb-2" />
                        <div className="h-6 w-8 rounded bg-blue-500/30" />
                      </div>
                      <div className="h-20 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 p-3">
                        <div className="h-3 w-12 rounded bg-green-400/40 mb-2" />
                        <div className="h-6 w-8 rounded bg-green-500/30" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-28 rounded-lg bg-gradient-to-b from-purple-500/10 to-transparent border border-purple-500/20 p-3">
                      <div className="h-3 w-10 rounded bg-purple-400/40 mb-2" />
                      <div className="space-y-1.5">
                        <div className="h-2 w-full rounded bg-gray-700/20" />
                        <div className="h-2 w-3/4 rounded bg-gray-700/20" />
                      </div>
                    </div>
                    <div className="h-16 rounded-lg bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/20 p-3">
                      <div className="h-3 w-8 rounded bg-cyan-400/40 mb-2" />
                      <div className="h-2 w-full rounded bg-gray-700/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center p-4 rounded-xl border border-gray-800 bg-gray-900/30">
                  <Icon size={20} className="text-blue-400 mx-auto mb-2" />
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-white mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to generate leads
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400">
              From discovery to delivery, LeadPilot AI handles the entire outreach workflow with intelligent automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-6 hover:border-gray-700 transition-all duration-300 hover:-translate-y-1 card-hover"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                    <Icon size={24} className={feature.color} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <p className="text-xs font-medium text-blue-400">
                    {feature.benefit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three steps to more customers
            </h2>
            <p className="text-lg text-gray-400">
              Get started in minutes, not weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Discover Leads",
                description: "Search by location, industry, and criteria. Our AI finds businesses matching your ideal customer profile.",
              },
              {
                step: "02",
                icon: Wand2,
                title: "AI Generates Emails",
                description: "Our AI analyzes each lead and crafts personalized outreach emails that resonate with their specific business.",
              },
              {
                step: "03",
                icon: BarChart3,
                title: "Track & Convert",
                description: "Monitor opens, replies, and conversions. Move leads through your pipeline and close more deals.",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative text-center">
                  {/* Connector arrow (not on last item) */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4 z-10">
                      <ArrowRight size={24} className="text-blue-500/40" />
                    </div>
                  )}
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 mb-6">
                    <Icon size={28} className="text-blue-400" />
                  </div>
                  <div className="absolute top-0 right-1/2 translate-x-[52px] -translate-y-2">
                    <span className="text-xs font-bold text-blue-500/60">STEP {item.step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-400">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-transparent shadow-xl shadow-blue-500/10"
                    : "border-gray-800 bg-gray-900/50"
                }`}
              >
                {plan.popular && (
                  <div className="mb-3">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/30">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white mb-1">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  {plan.features[0]}
                </p>
                <a
                  href={plan.cta === 'Contact Sales' ? 'mailto:ibrahimabid276@gmail.com?subject=Enterprise%20Plan%20Inquiry%20-%20LeadPilot%20AI' : `/pricing?plan=${plan.id}`}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                      : "border border-gray-700 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-all"
            >
              View Full Pricing
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to supercharge your outreach?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of businesses using LeadPilot AI to find leads and close deals faster.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            No credit card required. 14-day free trial.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img
                  src="/leadpilot_logo_icon.png"
                  alt="LeadPilot AI"
                  className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20"
                />
                <span className="text-lg font-bold text-white">LeadPilot AI</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                AI-powered lead generation and outreach platform for modern sales teams.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Features</a></li>
                <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Pricing</a></li>
                <li><Link href="/sign-up" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Get Started</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">About</a></li>
                <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal & Support</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</a></li>
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</a></li>
                <li><a href="mailto:ibrahimabid276@gmail.com" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2026 LeadPilot AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Privacy
              </Link>
              <a href="mailto:ibrahimabid276@gmail.com" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
