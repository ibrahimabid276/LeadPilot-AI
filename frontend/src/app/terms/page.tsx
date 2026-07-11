import type { Metadata } from "next";
import Link from "next/link";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using LeadPilot AI.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-white">
      <nav className="border-b border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white dark:text-white text-gray-900">LeadPilot AI</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 11, 2026</p>

        <div className="prose prose-invert dark:prose-invert prose-gray max-w-none space-y-6 text-gray-400 dark:text-gray-400 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LeadPilot AI (&quot;the Service&quot;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p>
              LeadPilot AI provides AI-powered lead generation, email outreach, and CRM tools for businesses.
              The service includes business discovery, AI email generation, lead scoring, and pipeline management.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">3. Account Responsibilities</h2>
            <p>You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring your use complies with applicable laws and regulations</li>
              <li>Obtaining proper consent before sending emails to contacts</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">4. Acceptable Use</h2>
            <p>You agree NOT to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Send spam or unsolicited bulk emails</li>
              <li>Violate CAN-SPAM, GDPR, or other applicable email regulations</li>
              <li>Use the service for fraudulent or deceptive purposes</li>
              <li>Attempt to reverse engineer or exploit the platform</li>
              <li>Share your account credentials with unauthorized users</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">5. Payment & Billing</h2>
            <p>
              Paid plans are billed monthly. You may cancel at any time, and your access will continue
              through the end of your current billing period. Refunds are provided only for service outages
              exceeding 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">6. Intellectual Property</h2>
            <p>
              The LeadPilot AI platform, including its design, code, and AI models, is owned by LeadPilot AI.
              Content you create (emails, lead data) remains yours. We do not claim ownership of your data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">7. Limitation of Liability</h2>
            <p>
              LeadPilot AI is provided &quot;as is&quot; without warranties. We are not liable for any indirect,
              incidental, or consequential damages. Our total liability is limited to the amount you paid
              in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">8. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@leadpilot.ai" className="text-blue-400 hover:text-blue-300">
                legal@leadpilot.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
