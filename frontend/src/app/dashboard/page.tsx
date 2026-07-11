"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/Card";
import { CardSkeleton } from "../components/ui/Skeleton";
import { Users, Mail, TrendingUp, Target, ArrowUpRight, Sparkles, Brain, Zap } from "lucide-react";
import { dashboardApi, DashboardStats } from "@/lib/api";
import Link from "next/link";
import { AIChatAssistant } from "../components/ui/AIChatAssistant";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardApi.getStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: "Total Leads", value: stats.total_leads.toLocaleString(), icon: Users, color: "text-blue-400" },
        { label: "Emails Sent", value: stats.emails_sent.toLocaleString(), icon: Mail, color: "text-green-400" },
        { label: "Conversion Rate", value: `${stats.conversion_rate}%`, icon: TrendingUp, color: "text-yellow-400" },
        { label: "Active Campaigns", value: stats.active_campaigns.toLocaleString(), icon: Target, color: "text-purple-400" },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Welcome back. Here&apos;s an overview of your lead pipeline.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 card-hover shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.label}
                    </CardTitle>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      {/* Error state */}
      {error && (
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 mb-8">
          <CardContent className="py-4">
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link
            href="/leads"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30"
          >
            Discover New Leads
            <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/emails"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-all shadow-sm shadow-emerald-500/20"
          >
            Send Outreach Emails
            <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/crm"
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-all shadow-sm shadow-purple-500/20"
          >
            View CRM Pipeline
            <ArrowUpRight size={14} />
          </Link>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-500/10 dark:to-blue-500/10 border-purple-200 dark:border-purple-800/50 shadow-sm mb-8">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Sparkles size={18} className="text-purple-500" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20">
                <TrendingUp size={14} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Open Rate Opportunity</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Your open rates could improve by 23% with better subject lines. Try personalizing with lead names.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/20">
                <Brain size={14} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Lead Quality Trend</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  68% of your recent leads score above 70. Focus on high-intent industries like tech and healthcare.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/20">
                <Zap size={14} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">Follow-up Reminder</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  5 leads in your CRM haven't been contacted in 7+ days. Consider sending a follow-up.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-white text-base">Recent Leads</CardTitle>
            <Link
              href="/leads"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : stats?.recent_leads?.length ? (
              <div className="space-y-2">
                {stats.recent_leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                        {lead.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {lead.industry} · {lead.city || lead.country || "Unknown"}
                      </p>
                    </div>
                    {lead.google_rating && (
                      <span className="text-xs text-yellow-400 font-medium shrink-0 ml-2">
                        ★ {lead.google_rating}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">No leads yet. Start discovering!</p>
                <Link
                  href="/leads"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  Discover Leads <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent emails */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-white text-base">Recent Emails</CardTitle>
            <Link
              href="/emails"
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : stats?.recent_emails?.length ? (
              <div className="space-y-2">
                {stats.recent_emails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                        {email.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        To: {email.to_name || email.to_email}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 ml-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        email.status === "sent" || email.status === "delivered"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : email.status === "failed"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {email.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500 mb-3">No emails sent yet.</p>
                <Link
                  href="/emails"
                  className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
                >
                  Send First Email <ArrowUpRight size={14} />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Assistant */}
      <AIChatAssistant />
    </div>
  );
}
