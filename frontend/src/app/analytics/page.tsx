"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/Card";
import {
  BarChart3,
  Users,
  Mail,
  TrendingUp,
  Reply,
  Eye,
  Sparkles,
  Brain,
  Target,
  Zap,
} from "lucide-react";
import { analyticsApi, AnalyticsOverview } from "@/lib/api";
import { CardSkeleton } from "@/app/components/ui/Skeleton";

const statusColors: Record<string, string> = {
  new: "bg-blue-500",
  contacted: "bg-yellow-500",
  replied: "bg-green-500",
  meeting: "bg-purple-500",
  client: "bg-indigo-500",
  closed: "bg-gray-500",
  draft: "bg-gray-500",
  sent: "bg-green-500",
  delivered: "bg-green-400",
  opened: "bg-blue-400",
  failed: "bg-red-500",
  bounced: "bg-orange-500",
};

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data: analytics } = await analyticsApi.getOverview();
        setData(analytics);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const statCards = data
    ? [
        {
          label: "Total Leads",
          value: data.total_leads,
          icon: Users,
          color: "text-blue-400",
        },
        {
          label: "Emails Sent",
          value: data.total_emails_sent,
          icon: Mail,
          color: "text-green-400",
        },
        {
          label: "Emails Opened",
          value: data.total_emails_opened,
          icon: Eye,
          color: "text-cyan-400",
        },
        {
          label: "Emails Replied",
          value: data.total_emails_replied,
          icon: Reply,
          color: "text-purple-400",
        },
        {
          label: "Conversion Rate",
          value: `${data.conversion_rate}%`,
          icon: TrendingUp,
          color: "text-yellow-400",
        },
      ]
    : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Track your lead generation and email outreach performance.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
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
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString()
                        : stat.value}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by industry */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <BarChart3 size={16} className="text-blue-500" />
              Leads by Industry
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : data && Object.keys(data.leads_by_industry).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.leads_by_industry)
                  .sort(([, a], [, b]) => b - a)
                  .map(([industry, count]) => {
                    const maxCount = Math.max(...Object.values(data.leads_by_industry));
                    const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={industry}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-700 dark:text-slate-300 truncate">{industry}</span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium ml-2">{count}</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No lead data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* CRM Pipeline breakdown */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Users size={16} className="text-purple-500" />
              CRM Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-8 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : data && Object.keys(data.leads_by_status).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(data.leads_by_status)
                  .sort(([, a], [, b]) => b - a)
                  .map(([status, count]) => {
                    const total = Object.values(data.leads_by_status).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="flex items-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${statusColors[status] || "bg-slate-500"}`} />
                            <span className="text-slate-700 dark:text-slate-300 capitalize">{status}</span>
                          </span>
                          <span className="text-slate-500 dark:text-slate-400 font-medium">{count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${statusColors[status] || "bg-slate-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No CRM data available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Email status breakdown */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Mail size={16} className="text-green-500" />
              Email Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : data && Object.keys(data.emails_by_status).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {Object.entries(data.emails_by_status).map(([status, count]) => (
                  <div key={status} className="rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 text-center">
                    <div className={`mx-auto mb-2 h-3 w-3 rounded-full ${statusColors[status] || "bg-slate-500"}`} />
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{count}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 capitalize mt-1">{status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">No email data available yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* AI Predictions */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-500/10 dark:to-blue-500/10 border-purple-200 dark:border-purple-800/50 shadow-sm mt-6">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
            <Brain size={18} className="text-purple-500" />
            AI Predictions & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-blue-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Conversion Forecast</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">+18%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Predicted conversion increase next month</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={14} className="text-green-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Best Send Time</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Tue 10am</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Optimal time for highest open rates</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-purple-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Top Industry</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Healthcare</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Highest response rate industry</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-amber-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Action Required</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">12</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Leads need follow-up this week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
