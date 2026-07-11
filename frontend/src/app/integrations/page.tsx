"use client";

import { useState } from "react";
import { Zap, Search, ExternalLink, Check, X, Globe, Mail, Calendar, Database, MessageSquare, BarChart3 } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  connected: boolean;
  popular: boolean;
}

const integrations: Integration[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    description: "Sync leads and contacts with your Salesforce CRM automatically.",
    category: "CRM",
    icon: Database,
    connected: false,
    popular: true,
  },
  {
    id: "hubspot",
    name: "HubSpot",
    description: "Two-way sync with HubSpot CRM, deals, and contacts.",
    category: "CRM",
    icon: Database,
    connected: false,
    popular: true,
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Send emails directly from your Gmail account with tracking.",
    category: "Email",
    icon: Mail,
    connected: true,
    popular: true,
  },
  {
    id: "outlook",
    name: "Microsoft Outlook",
    description: "Connect your Outlook account for email outreach and tracking.",
    category: "Email",
    icon: Mail,
    connected: false,
    popular: true,
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    description: "Schedule meetings and follow-ups directly from LeadPilot.",
    category: "Productivity",
    icon: Calendar,
    connected: false,
    popular: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Get notified when leads respond or move through your pipeline.",
    category: "Communication",
    icon: MessageSquare,
    connected: false,
    popular: true,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect LeadPilot to 5,000+ apps with Zapier automation.",
    category: "Automation",
    icon: Zap,
    connected: false,
    popular: true,
  },
  {
    id: "webhooks",
    name: "Webhooks",
    description: "Send real-time data to your own endpoints via webhooks.",
    category: "Developer",
    icon: Globe,
    connected: false,
    popular: false,
  },
  {
    id: "analytics",
    name: "Google Analytics",
    description: "Track lead sources and measure campaign performance.",
    category: "Analytics",
    icon: BarChart3,
    connected: false,
    popular: false,
  },
];

const categories = ["All", "CRM", "Email", "Productivity", "Communication", "Automation", "Developer", "Analytics"];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = integrations.filter((integration) => {
    const matchesCategory = selectedCategory === "All" || integration.category === selectedCategory;
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Integrations</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Connect LeadPilot with your favorite tools to supercharge your workflow.
        </p>
      </div>

      {/* Search and filters */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-6 shadow-sm">
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Integrations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.id}
              className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                  <Icon size={24} className="text-slate-600 dark:text-slate-300" />
                </div>
                {integration.popular && (
                  <span className="rounded-full bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {integration.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                {integration.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">{integration.category}</span>
                {integration.connected ? (
                  <button className="flex items-center gap-1.5 rounded-lg bg-green-100 dark:bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20 transition-colors">
                    <Check size={12} /> Connected
                  </button>
                ) : (
                  <button className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors">
                    Connect <ExternalLink size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No integrations found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
