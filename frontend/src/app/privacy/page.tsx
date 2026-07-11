import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how LeadPilot AI collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-white">
      {/* Header */}
      <nav className="border-b border-gray-800 dark:border-gray-800 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2.5">
              <img
                src="/leadpilot_logo_icon.png"
                alt="LeadPilot AI"
                className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20"
              />
              <span className="text-lg font-bold text-white dark:text-white text-gray-900">LeadPilot AI</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-white dark:text-white text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Last updated: July 11, 2026</p>

        <div className="prose prose-invert dark:prose-invert prose-gray max-w-none space-y-6 text-gray-400 dark:text-gray-400 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
            <p>We collect information you provide directly, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address, password)</li>
              <li>Business data you input (lead information, campaign details)</li>
              <li>Usage data (how you interact with our platform)</li>
              <li>Communication data (emails sent through our platform)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain our services</li>
              <li>Generate AI-powered email drafts and lead insights</li>
              <li>Send emails on your behalf through our platform</li>
              <li>Improve our AI models and platform features</li>
              <li>Communicate with you about updates and support</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">3. Data Storage & Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use Supabase for authentication
              and PostgreSQL for data storage, both with enterprise-grade security measures. All data is encrypted
              in transit (TLS) and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">4. Third-Party Services</h2>
            <p>We integrate with the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase</strong> — Authentication and database</li>
              <li><strong>OpenRouter</strong> — AI model access for email generation</li>
              <li><strong>Resend</strong> — Email delivery</li>
              <li><strong>OpenStreetMap</strong> — Business discovery data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white dark:text-white text-gray-900 mt-8 mb-4">6. Contact Us</h2>
            <p>
              For privacy-related questions or requests, contact us at{" "}
              <a href="mailto:privacy@leadpilot.ai" className="text-blue-400 hover:text-blue-300">
                privacy@leadpilot.ai
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
