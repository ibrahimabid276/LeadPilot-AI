import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Target, Mail, Users, BarChart3, Globe, Brain, ArrowRight, Heart, Shield, Lightbulb } from "lucide-react";

export const metadata: Metadata = {
  title: "About - LeadPilot.ai",
  description: "Learn about LeadPilot AI's mission to revolutionize B2B lead generation with artificial intelligence.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
          </Link>
          <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            Sign In
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-20">
        {/* Hero */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 mb-6">
            <Heart size={14} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-400">Our Story</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            We&apos;re building the future of{" "}
            <span className="gradient-text">B2B outreach</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            LeadPilot AI was born from a simple observation: finding leads and writing personalized emails takes too much time. 
            We&apos;re using AI to eliminate the busywork so sales teams can focus on what matters — building relationships.
          </p>
        </div>

        {/* Mission & Values */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
          {[
            {
              icon: Target,
              title: "Our Mission",
              description: "Make world-class sales tools accessible to every business, regardless of size or budget. We believe AI should empower, not replace.",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Lightbulb,
              title: "Our Approach",
              description: "We combine cutting-edge AI with intuitive design. Every feature is built to save time, reduce friction, and deliver measurable results.",
              color: "text-amber-500",
              bg: "bg-amber-500/10",
            },
            {
              icon: Shield,
              title: "Our Promise",
              description: "Your data is sacred. We implement enterprise-grade security, never share your data, and are transparent about how AI powers our platform.",
              color: "text-green-500",
              bg: "bg-green-500/10",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-800 card-hover">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} mb-4`}>
                  <Icon size={24} className={item.color} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 max-w-5xl mx-auto mb-20 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Leads Generated" },
              { value: "50,000+", label: "Emails Sent" },
              { value: "98%", label: "Customer Satisfaction" },
              { value: "3x", label: "Avg. Response Rate Increase" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-10">
            Powered by cutting-edge technology
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Brain, title: "Advanced AI Models", desc: "We use the latest large language models for hyper-personalized outreach." },
              { icon: Globe, title: "Global Business Data", desc: "Access millions of businesses worldwide with real-time data enrichment." },
              { icon: Mail, title: "Smart Email Engine", desc: "AI-crafted emails that sound human, with built-in deliverability optimization." },
              { icon: BarChart3, title: "Predictive Analytics", desc: "Machine learning models that score leads and predict conversion probability." },
              { icon: Users, title: "CRM Integration", desc: "Seamless pipeline management with drag-and-drop simplicity." },
              { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant infrastructure with end-to-end encryption." },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="flex-shrink-0">
                    <Icon size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            Ready to transform your outreach?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto">
            Join thousands of sales professionals who trust LeadPilot AI to find and convert leads.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
          >
            Get Started Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 mt-20">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} LeadPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
