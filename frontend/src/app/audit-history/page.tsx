"use client";

import { useState } from "react";
import { History, Search, Filter, Download, User, Mail, Users, Settings, Globe, Calendar } from "lucide-react";

interface AuditEntry {
  id: string;
  action: string;
  user: string;
  resource: string;
  details: string;
  timestamp: string;
  type: "lead" | "email" | "crm" | "settings" | "system";
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    action: "Lead Created",
    user: "John Doe",
    resource: "Smile Dental Clinic",
    details: "Added via Lead Discovery search",
    timestamp: "2026-07-10T14:30:00Z",
    type: "lead",
  },
  {
    id: "2",
    action: "Email Sent",
    user: "John Doe",
    resource: "outreach@smiledental.com",
    details: "AI-generated outreach email sent",
    timestamp: "2026-07-10T14:35:00Z",
    type: "email",
  },
  {
    id: "3",
    action: "CRM Status Changed",
    user: "Sarah Chen",
    resource: "Tech Solutions Inc.",
    details: "Moved from 'New' to 'Contacted'",
    timestamp: "2026-07-10T13:20:00Z",
    type: "crm",
  },
  {
    id: "4",
    action: "Settings Updated",
    user: "John Doe",
    resource: "Email Configuration",
    details: "Updated SMTP settings",
    timestamp: "2026-07-10T11:00:00Z",
    type: "settings",
  },
  {
    id: "5",
    action: "Lead Scored",
    user: "System",
    resource: "Acme Corporation",
    details: "AI lead score: 85/100",
    timestamp: "2026-07-09T16:45:00Z",
    type: "lead",
  },
  {
    id: "6",
    action: "Website Audited",
    user: "System",
    resource: "acmecorp.com",
    details: "Website health score: 72/100",
    timestamp: "2026-07-09T16:50:00Z",
    type: "system",
  },
  {
    id: "7",
    action: "Email Delivered",
    user: "System",
    resource: "outreach@techsolutions.com",
    details: "Email successfully delivered",
    timestamp: "2026-07-09T15:30:00Z",
    type: "email",
  },
  {
    id: "8",
    action: "Team Member Added",
    user: "John Doe",
    resource: "michael@company.com",
    details: "Invited as team member",
    timestamp: "2026-07-09T10:00:00Z",
    type: "settings",
  },
];

const typeIcons: Record<AuditEntry["type"], React.ComponentType<{ size?: number; className?: string }>> = {
  lead: Users,
  email: Mail,
  crm: Users,
  settings: Settings,
  system: Globe,
};

const typeColors: Record<AuditEntry["type"], string> = {
  lead: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
  email: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400",
  crm: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400",
  settings: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  system: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

export default function AuditHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const filteredLogs = mockAuditLog.filter((entry) => {
    const matchesSearch =
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || entry.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const exportCSV = () => {
    const headers = ["Action", "User", "Resource", "Details", "Timestamp"];
    const rows = filteredLogs.map((e) => [e.action, e.user, e.resource, e.details, e.timestamp]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Audit History</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Track all actions and changes across your LeadPilot account.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search audit log..."
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <select
              className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="lead">Leads</option>
              <option value="email">Emails</option>
              <option value="crm">CRM</option>
              <option value="settings">Settings</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit log */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredLogs.map((entry) => {
            const Icon = typeIcons[entry.type];
            return (
              <div key={entry.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${typeColors[entry.type]}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{entry.action}</p>
                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">
                      {entry.type}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{entry.details}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={10} /> {entry.user}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} /> {formatTimestamp(entry.timestamp)}
                    </span>
                    <span className="truncate">{entry.resource}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredLogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <History className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No audit entries</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}
