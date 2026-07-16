import type { Metadata } from "next";
import Link from "next/link";
import { Database, Brain, Mail, MapPin, Eye, Edit, Trash2, Download, ShieldOff, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how LeadPilot AI collects, uses, and protects your data. Your privacy matters to us.",
};

const services = [
  {
    name: "Supabase",
    purpose: "Authentication & database",
    description: "Stores your account data, lead records, and campaign information with enterprise-grade encryption.",
    icon: Database,
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  {
    name: "OpenRouter",
    purpose: "AI model access",
    description: "Powers our AI email generation and lead scoring features through state-of-the-art language models.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
  {
    name: "Resend",
    purpose: "Email delivery",
    description: "Sends outreach emails on your behalf and delivers transactional emails (password resets, notifications).",
    icon: Mail,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    name: "OpenStreetMap",
    purpose: "Business discovery data",
    description: "Provides geographic and business location data for our Smart Lead Discovery feature.",
    icon: MapPin,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
];

const userRights = [
  { icon: Eye, label: "Access", description: "View all personal data we hold about you" },
  { icon: Edit, label: "Correct", description: "Update inaccurate or incomplete data" },
  { icon: Trash2, label: "Delete", description: "Request deletion of your personal data" },
  { icon: Download, label: "Export", description: "Download your data in a portable format" },
  { icon: ShieldOff, label: "Withdraw", description: "Revoke consent at any time" },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/leadpilot_logo_icon.png" alt="LeadPilot AI" className="h-8 w-8 rounded-lg" />
              <span className="text-lg font-bold text-white dark:text-white text-gray-900 tracking-tight">LeadPilot AI</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors">Login</Link>
              <Link href="/sign-up" className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all">Start Free</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-4">Last updated: July 11, 2026</p>
          <p className="text-sm text-blue-400">
            Questions? Contact us at{" "}
            <a href="mailto:privacy@leadpilot.ai" className="underline hover:text-blue-300">privacy@leadpilot.ai</a>
          </p>
        </div>

        {/* Quick Summary */}
        <div className="mb-8 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
          <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-3">Quick Summary</h2>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><strong className="text-white dark:text-white text-gray-900">What we collect:</strong> Account info (name, email), business data (leads, campaigns), usage data, and communication data</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><strong className="text-white dark:text-white text-gray-900">Why we collect it:</strong> To provide our services, generate AI emails, send communications, and improve the platform</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><strong className="text-white dark:text-white text-gray-900">Where it's stored:</strong> Encrypted databases via Supabase (PostgreSQL), with TLS in transit and encryption at rest</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">&#8226;</span>
              <span><strong className="text-white dark:text-white text-gray-900">Your rights:</strong> Access, correct, delete, export your data, or withdraw consent at any time</span>
            </li>
          </ul>
        </div>

        <div className="space-y-8">
          {/* Section 1: Information We Collect */}
          <section className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
            <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 mb-3">We collect information you provide directly, including:</p>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white dark:text-white text-gray-900">Account information</strong> — name, email address, password</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white dark:text-white text-gray-900">Business data</strong> — lead information, campaign details you input</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white dark:text-white text-gray-900">Usage data</strong> — how you interact with our platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white dark:text-white text-gray-900">Communication data</strong> — emails sent through our platform</span>
              </li>
            </ul>
          </section>

          {/* Section 2: How We Use Your Information */}
          <section className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
            <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 mb-3">We use collected information to:</p>
            <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span>Provide and maintain our services</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span>Generate AI-powered email drafts and lead insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span>Send emails on your behalf through our platform</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span>Improve our AI models and platform features</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">&#8226;</span>
                <span>Communicate with you about updates and support</span>
              </li>
            </ul>
          </section>

          {/* Section 3: Data Storage & Security */}
          <section className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
            <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-4">3. Data Storage & Security</h2>
            <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 leading-relaxed">
              Your data is stored securely using industry-standard encryption. We use Supabase for authentication
              and PostgreSQL for data storage, both with enterprise-grade security measures. All data is encrypted
              in transit (TLS) and at rest.
            </p>
          </section>

          {/* Section 4: Third-Party Services (Diagram) */}
          <section className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
            <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-2">4. Third-Party Services</h2>
            <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 mb-6">
              We integrate with the following trusted third-party services:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.name} className={`rounded-lg border ${service.border} ${service.bg} p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={18} className={service.color} />
                      <span className="font-semibold text-white dark:text-white text-gray-900 text-sm">{service.name}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 mb-1">{service.purpose}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{service.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 5: Your Rights (with icons) */}
          <section className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
            <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900 mb-2">5. Your Rights</h2>
            <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600 mb-6">
              You have the following rights regarding your personal data:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userRights.map((right) => {
                const Icon = right.icon;
                return (
                  <div key={right.label} className="flex items-start gap-3 rounded-lg border border-gray-800 dark:border-gray-800 border-gray-200 p-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 flex-shrink-0">
                      <Icon size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white dark:text-white text-gray-900">{right.label}</p>
                      <p className="text-xs text-gray-500">{right.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-sm text-gray-500">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:privacy@leadpilot.ai" className="text-blue-400 hover:text-blue-300 underline">privacy@leadpilot.ai</a>.
            </p>
          </section>

          {/* Section 6: Contact Us */}
          <section className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Phone size={18} className="text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900">6. Contact Us</h2>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600">
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:privacy@leadpilot.ai" className="text-blue-400 hover:text-blue-300 underline font-medium">
                privacy@leadpilot.ai
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 text-center rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
          <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600">
            Have questions about your privacy?{" "}
            <a href="mailto:privacy@leadpilot.ai" className="text-blue-400 hover:text-blue-300 underline font-medium">
              privacy@leadpilot.ai
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 dark:border-gray-800 border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2026 LeadPilot AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Terms</Link>
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Privacy</Link>
            <a href="mailto:ibrahimabid276@gmail.com" className="text-xs text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
