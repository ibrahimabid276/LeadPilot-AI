import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
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
} from "lucide-react";

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
      "Find businesses by location, industry, and criteria using our intelligent search engine powered by global business data.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "AI Lead Scoring",
    description:
      "Automatically score and prioritize leads based on online presence, reviews, industry fit, and conversion potential.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Mail,
    title: "AI Email Generator",
    description:
      "Generate personalized outreach emails in seconds. Our AI crafts compelling messages tailored to each lead's business.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Users,
    title: "Visual CRM Pipeline",
    description:
      "Drag-and-drop Kanban board to manage leads through every stage — from discovery to closed deal.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track email performance, conversion rates, and pipeline health with beautiful, actionable dashboards.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Globe,
    title: "Website Intelligence",
    description:
      "AI-powered website analysis reveals pain points, tech stack, and talking points for personalized outreach.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
];

const stats = [
  { value: "10x", label: "Faster Lead Research" },
  { value: "85%", label: "Email Personalization" },
  { value: "3x", label: "Higher Response Rates" },
  { value: "24/7", label: "AI-Powered Outreach" },
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
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 dark:border-gray-800/50 border-gray-200 bg-gray-950/80 dark:bg-gray-950/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="/leadpilot-logo.png"
                alt="LeadPilot AI"
                className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20"
              />
              <span className="text-lg font-bold text-white dark:text-white text-gray-900 tracking-tight">
                LeadPilot AI
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <Link href="/docs" className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">
                Docs
              </Link>
              <Link href="/blog" className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <a href="/privacy" className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">
                Terms
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                Get Started Free
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

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white dark:text-white text-gray-900 tracking-tight leading-[1.1] mb-6">
            Find leads. Generate emails.{" "}
            <span className="gradient-text">Close deals.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-gray-400 dark:text-gray-400 text-gray-600 mb-10 leading-relaxed">
            LeadPilot AI discovers businesses, scores them with AI, and generates personalized outreach emails — so you can focus on closing deals instead of researching prospects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start Free — No Credit Card
              <ArrowRight size={18} />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-700 dark:border-gray-700 border-gray-300 bg-gray-800/50 dark:bg-gray-800/50 bg-gray-50 px-8 py-4 text-base font-semibold text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-100 transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-white text-gray-900 mb-4">
              Everything you need to generate leads
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 dark:text-gray-400 text-gray-600">
              From discovery to delivery, LeadPilot AI handles the entire outreach workflow with intelligent automation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/50 dark:bg-gray-900/50 bg-white p-6 hover:border-gray-700 dark:hover:border-gray-700 hover:border-gray-300 transition-all duration-300 hover:-translate-y-1 card-hover"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                    <Icon size={24} className={feature.color} />
                  </div>
                  <h3 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-white text-gray-900 mb-4">
              Three steps to more customers
            </h2>
            <p className="text-lg text-gray-400 dark:text-gray-400 text-gray-600">
              Get started in minutes, not weeks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Discover Leads",
                description: "Search by location, industry, and criteria. Our AI finds businesses matching your ideal customer profile.",
              },
              {
                step: "02",
                title: "AI Generates Emails",
                description: "Our AI analyzes each lead and crafts personalized outreach emails that resonate with their specific business.",
              },
              {
                step: "03",
                title: "Track & Convert",
                description: "Monitor opens, replies, and conversions. Move leads through your pipeline and close more deals.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/20 mb-6">
                  <span className="text-2xl font-bold gradient-text">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-white dark:text-white text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-white text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-400 dark:text-gray-400 text-gray-600">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? "border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-transparent shadow-xl shadow-blue-500/10"
                    : "border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/50 dark:bg-gray-900/50 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-blue-500/30">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-4xl font-bold text-white dark:text-white text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 mb-6">
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-gray-300 dark:text-gray-300 text-gray-700">
                      <Check size={16} className="text-blue-400 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.cta === 'Contact Sales' ? 'mailto:sales@leadpilot.ai?subject=Enterprise%20Plan%20Inquiry%20-%20LeadPilot%20AI' : `/pricing?plan=${plan.id}`}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                      : "border border-gray-700 dark:border-gray-700 border-gray-300 text-gray-300 dark:text-gray-300 text-gray-700 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white dark:text-white text-gray-900 mb-4">
            Ready to supercharge your outreach?
          </h2>
          <p className="text-lg text-gray-400 dark:text-gray-400 text-gray-600 mb-8">
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
      <footer className="border-t border-gray-800 dark:border-gray-800 border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white dark:text-white text-gray-900">LeadPilot AI</span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                AI-powered lead generation and outreach platform for modern sales teams.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white dark:text-white text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Pricing</a></li>
                <li><Link href="/sign-up" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Get Started</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white dark:text-white text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">About</Link></li>
                <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Blog</Link></li>
                <li><Link href="/docs" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Documentation</Link></li>
                <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white dark:text-white text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@leadpilot.ai" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Contact Us</a></li>
                <li><Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Sign In</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-800 border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} LeadPilot AI. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "LeadPilot AI",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            description: "AI-powered lead generation and outreach platform",
            offers: {
              "@type": "Offer",
              price: "29",
              priceCurrency: "USD",
              priceValidUntil: "2026-12-31",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "150",
            },
          }),
        }}
      />
    </div>
  );
}
