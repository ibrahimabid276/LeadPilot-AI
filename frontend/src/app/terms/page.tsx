import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, AlertTriangle, CreditCard, Lightbulb, Ban, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using LeadPilot AI. Learn about your rights, our policies, and how we operate.",
};

const sections = [
  {
    id: "acceptance",
    icon: FileText,
    title: "1. Acceptance of Terms",
    tldr: "By using LeadPilot AI, you agree to these terms. If you don't agree, please don't use the service.",
    content: (
      <>
        <p>
          By accessing or using LeadPilot AI (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
          If you do not agree to these terms, do not use the Service.
        </p>
        <p>
          These terms apply to all users, including free trial users, paying subscribers, and enterprise customers.
        </p>
      </>
    ),
  },
  {
    id: "description",
    icon: Lightbulb,
    title: "2. Description of Service",
    tldr: "LeadPilot AI helps you find leads, generate outreach emails, and manage your sales pipeline.",
    content: (
      <>
        <p>
          LeadPilot AI provides AI-powered lead generation, email outreach, and CRM tools for businesses.
          The service includes:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Smart Lead Discovery</strong> — Find businesses by location, industry, and criteria</li>
          <li><strong>AI Email Generation</strong> — Create personalized outreach emails automatically</li>
          <li><strong>Lead Scoring</strong> — AI-powered prioritization of your leads</li>
          <li><strong>CRM Pipeline</strong> — Visual Kanban board to manage deals</li>
        </ul>
      </>
    ),
  },
  {
    id: "account",
    icon: Shield,
    title: "3. Account Responsibilities",
    tldr: "Keep your account secure. You're responsible for everything that happens under your account.",
    content: (
      <>
        <p>You are responsible for:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Maintaining the confidentiality</strong> of your account credentials</li>
          <li><strong>All activities</strong> that occur under your account</li>
          <li>Ensuring your use complies with applicable laws and regulations</li>
          <li><strong>Obtaining proper consent</strong> before sending emails to contacts</li>
        </ul>
      </>
    ),
  },
  {
    id: "acceptable-use",
    icon: Ban,
    title: "4. Acceptable Use",
    tldr: "No spam, no fraud, no abuse. Use the service responsibly and legally.",
    content: (
      <>
        <p>You agree <strong>NOT</strong> to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Send spam</strong> or unsolicited bulk emails</li>
          <li>Violate CAN-SPAM, GDPR, or other applicable email regulations</li>
          <li>Use the service for <strong>fraudulent or deceptive purposes</strong></li>
          <li>Attempt to reverse engineer or exploit the platform</li>
          <li>Share your account credentials with unauthorized users</li>
        </ul>
        <p className="mt-3">
          Violation of these rules may result in <strong>immediate account termination</strong> without refund.
        </p>
      </>
    ),
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "5. Payment & Billing",
    tldr: "Pay monthly, cancel anytime. Refunds only for outages over 24 hours.",
    content: (
      <>
        <p>
          Paid plans are billed monthly. You may <strong>cancel at any time</strong>, and your access will continue
          through the end of your current billing period.
        </p>
        <p className="mt-3">
          <strong>Refund policy:</strong> Refunds are provided only for service outages exceeding 24 hours.
          No partial-month refunds. Contact{" "}
          <a href="mailto:sales@leadpilot.ai" className="text-blue-400 hover:text-blue-300 underline">sales@leadpilot.ai</a>{" "}
          for billing inquiries.
        </p>
      </>
    ),
  },
  {
    id: "ip",
    icon: Lightbulb,
    title: "6. Intellectual Property",
    tldr: "We own the platform. You own your data (emails, lead data, campaigns).",
    content: (
      <>
        <p>
          The LeadPilot AI platform, including its design, code, and AI models, is owned by LeadPilot AI.
        </p>
        <p className="mt-3">
          <strong>Your data remains yours.</strong> Content you create (emails, lead data, campaign details) belongs to you.
          We do not claim ownership of your data.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    icon: AlertTriangle,
    title: "7. Limitation of Liability",
    tldr: 'The service is provided "as is." Our liability is capped at 12 months of fees.',
    content: (
      <>
        <p>
          LeadPilot AI is provided <strong>&quot;as is&quot; without warranties</strong>. We are not liable for any indirect,
          incidental, or consequential damages.
        </p>
        <p className="mt-3">
          Our total liability is limited to the amount you paid in the <strong>12 months</strong> preceding the claim.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    icon: Phone,
    title: "8. Contact",
    tldr: "Questions? Reach us at legal@leadpilot.ai.",
    content: (
      <>
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:legal@leadpilot.ai" className="text-blue-400 hover:text-blue-300 underline font-medium">
            legal@leadpilot.ai
          </a>
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-4">Last updated: July 11, 2026</p>
          <p className="text-sm text-blue-400">
            Questions? Contact us at{" "}
            <a href="mailto:legal@leadpilot.ai" className="underline hover:text-blue-300">legal@leadpilot.ai</a>
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.id} className="rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                    <Icon size={18} className="text-blue-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white dark:text-white text-gray-900">{section.title}</h2>
                </div>
                <div className="mb-4 rounded-lg bg-blue-500/5 border border-blue-500/10 px-4 py-2.5">
                  <p className="text-sm text-blue-300 dark:text-blue-300 text-blue-600">
                    <strong>TL;DR:</strong> {section.tldr}
                  </p>
                </div>
                <div className="prose prose-invert dark:prose-invert prose-gray max-w-none space-y-3 text-gray-400 dark:text-gray-400 text-gray-600 text-sm leading-relaxed">
                  {section.content}
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-12 text-center rounded-xl border border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-900/30 dark:bg-gray-900/30 bg-white p-6">
          <p className="text-sm text-gray-400 dark:text-gray-400 text-gray-600">
            Have questions about these terms?{" "}
            <a href="mailto:legal@leadpilot.ai" className="text-blue-400 hover:text-blue-300 underline font-medium">
              legal@leadpilot.ai
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
            <a href="mailto:sales@leadpilot.ai" className="text-xs text-gray-500 hover:text-gray-300 dark:hover:text-gray-300 hover:text-gray-700 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
