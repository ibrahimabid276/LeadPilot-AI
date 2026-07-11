"use client";

import { useState, useEffect, useCallback } from "react";
import { leadsApi, crmApi, BusinessLead } from "@/lib/api";
import { LeadCardSkeleton } from "@/app/components/ui/Skeleton";
import { useToast } from "@/app/components/ui/Toast";
import {
  Search,
  MapPin,
  Building2,
  Star,
  Globe,
  UserPlus,
  Loader2,
  ExternalLink,
  Sparkles,
  Download,
  Upload,
  Filter,
  Brain,
  FileSearch,
  X,
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<BusinessLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCrm, setAddingToCrm] = useState<Set<string>>(new Set());
  const [scoringLead, setScoringLead] = useState<string | null>(null);
  const [auditingLead, setAuditingLead] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [leadScore, setLeadScore] = useState<{ score: number; factors: string[]; recommendation: string } | null>(null);
  const [websiteAudit, setWebsiteAudit] = useState<{ observations: string[]; pain_points: string[]; talking_points: string[]; score: number } | null>(null);
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    industry: "",
  });
  const { showToast } = useToast();

  const searchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await leadsApi.discover(filters);
      setLeads(data.leads);
      if (data.leads.length === 0) {
        showToast("info", "No leads found. Try different search criteria.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to search leads";
      setError(msg);
      showToast("error", msg);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    searchLeads();
  }, []);

  const addToCrm = async (lead: BusinessLead) => {
    setAddingToCrm((prev) => new Set(prev).add(lead.id));
    try {
      await crmApi.addLead({ lead_id: lead.id, status: "new" });
      showToast("success", `${lead.name} added to CRM`);
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to add lead to CRM"
      );
    } finally {
      setAddingToCrm((prev) => {
        const next = new Set(prev);
        next.delete(lead.id);
        return next;
      });
    }
  };

  const scoreLead = async (lead: BusinessLead) => {
    setScoringLead(lead.id);
    try {
      const { data } = await leadsApi.score({
        business_name: lead.name,
        industry: lead.industry || "",
        google_rating: lead.google_rating || undefined,
        review_count: lead.review_count || undefined,
        has_website: !!lead.website,
      });
      setLeadScore(data);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to score lead");
    } finally {
      setScoringLead(null);
    }
  };

  const auditWebsite = async (lead: BusinessLead) => {
    if (!lead.website) {
      showToast("warning", "This lead doesn't have a website");
      return;
    }
    setAuditingLead(lead.id);
    try {
      const { data } = await leadsApi.auditWebsite({
        url: lead.website,
        business_name: lead.name,
        industry: lead.industry || "",
      });
      setWebsiteAudit(data);
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to audit website");
    } finally {
      setAuditingLead(null);
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ["Name", "Industry", "City", "Country", "Website", "Rating", "Reviews"];
    const rows = leads.map((l) => [
      l.name, l.industry, l.city, l.country, l.website || "", l.google_rating || "", l.review_count || ""
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${filters.city || filters.country || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", `Exported ${leads.length} leads to CSV`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Lead Discovery</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Find businesses by location and industry using global business data.
          </p>
        </div>
        {leads.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Upload size={14} />
              Import CSV
            </button>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* Search bar */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Search Filters</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Country
            </label>
            <input
              type="text"
              placeholder="e.g., United States"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && searchLeads()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              City
            </label>
            <input
              type="text"
              placeholder="e.g., New York"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && searchLeads()}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Industry
            </label>
            <input
              type="text"
              placeholder="e.g., Dentistry"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && searchLeads()}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={searchLeads}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            {loading ? (
              <><Loader2 size={16} className="animate-spin" /> Searching...</>
            ) : (
              <><Search size={16} /> Search Leads</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Results count */}
      {!initialLoad && !loading && leads.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={14} className="text-blue-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {leads.length} leads found
          </span>
        </div>
      )}

      {/* Results */}
      <div className="space-y-3">
        {initialLoad || loading
          ? Array.from({ length: 5 }).map((_, i) => <LeadCardSkeleton key={i} />)
          : leads.map((lead) => (
              <div
                key={lead.id}
                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-md card-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-base truncate">
                      {lead.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm text-slate-600 dark:text-slate-400">
                      {lead.industry && (
                        <span className="flex items-center gap-1.5">
                          <Building2 size={13} />
                          {lead.industry}
                        </span>
                      )}
                      {(lead.city || lead.country) && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} />
                          {[lead.city, lead.country].filter(Boolean).join(", ")}
                        </span>
                      )}
                    </div>
                    {lead.website && (
                      <a
                        href={lead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors truncate max-w-full"
                      >
                        <Globe size={12} />
                        <span className="truncate">{lead.website}</span>
                        <ExternalLink size={10} className="shrink-0" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {lead.google_rating != null && (
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="font-semibold text-sm">{lead.google_rating}</span>
                      </div>
                    )}
                    {lead.review_count != null && (
                      <span className="text-xs text-slate-500">{lead.review_count} reviews</span>
                    )}
                    <button
                      onClick={() => addToCrm(lead)}
                      disabled={addingToCrm.has(lead.id)}
                      className="mt-1 flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white disabled:opacity-50 transition-all active:scale-[0.98]"
                      title="Add to CRM"
                    >
                      {addingToCrm.has(lead.id) ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <UserPlus size={12} />
                      )}
                      Add to CRM
                    </button>
                    <div className="flex gap-1 mt-1">
                      <button
                        onClick={() => scoreLead(lead)}
                        disabled={scoringLead === lead.id}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 disabled:opacity-50 transition-all"
                        title="AI Lead Score"
                      >
                        {scoringLead === lead.id ? <Loader2 size={11} className="animate-spin" /> : <Brain size={11} />}
                        Score
                      </button>
                      {lead.website && (
                        <button
                          onClick={() => auditWebsite(lead)}
                          disabled={auditingLead === lead.id}
                          className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 disabled:opacity-50 transition-all"
                          title="AI Website Audit"
                        >
                          {auditingLead === lead.id ? <Loader2 size={11} className="animate-spin" /> : <FileSearch size={11} />}
                          Audit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {/* Empty state */}
      {!initialLoad && !loading && leads.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No leads found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
            Try adjusting your search filters or search for businesses in a different location.
          </p>
        </div>
      )}

      {/* AI Lead Score Modal */}
      {(leadScore || websiteAudit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => { setLeadScore(null); setWebsiteAudit(null); }}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {leadScore ? <><Brain size={20} className="text-purple-500" /> AI Lead Score</> : <><FileSearch size={20} className="text-indigo-500" /> Website Audit</>}
              </h3>
              <button onClick={() => { setLeadScore(null); setWebsiteAudit(null); }} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {leadScore && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold ${
                    leadScore.score >= 70 ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400" :
                    leadScore.score >= 40 ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                    "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                    {leadScore.score}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{leadScore.recommendation}</p>
                    <p className="text-sm text-slate-500">Lead quality score</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Key Factors:</p>
                  <ul className="space-y-1">
                    {leadScore.factors.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="text-blue-500 mt-0.5">•</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {websiteAudit && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold ${
                    websiteAudit.score >= 70 ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400" :
                    websiteAudit.score >= 40 ? "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" :
                    "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                  }`}>
                    {websiteAudit.score}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Website Health Score</p>
                    <p className="text-sm text-slate-500">Based on AI analysis</p>
                  </div>
                </div>
                {websiteAudit.observations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Observations:</p>
                    <ul className="space-y-1">{websiteAudit.observations.map((o, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"><span className="text-blue-500 mt-0.5">•</span> {o}</li>
                    ))}</ul>
                  </div>
                )}
                {websiteAudit.pain_points.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Pain Points:</p>
                    <ul className="space-y-1">{websiteAudit.pain_points.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"><span className="mt-0.5">⚠</span> {p}</li>
                    ))}</ul>
                  </div>
                )}
                {websiteAudit.talking_points.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Talking Points for Outreach:</p>
                    <ul className="space-y-1">{websiteAudit.talking_points.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-green-600 dark:text-green-400"><span className="mt-0.5">💡</span> {t}</li>
                    ))}</ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowImportModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload size={20} className="text-blue-500" />
                Import Leads from CSV
              </h2>
              <button onClick={() => setShowImportModal(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center">
                <Upload size={32} className="mx-auto mb-3 text-slate-400" />
                <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">Drop your CSV file here</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">or click to browse</p>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  id="csv-import"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      showToast("success", `File "${file.name}" selected. Import feature coming soon!`);
                      setShowImportModal(false);
                    }
                  }}
                />
                <label
                  htmlFor="csv-import"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Browse Files
                </label>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50 p-3">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-200 mb-1">Expected CSV format:</p>
                <code className="text-xs text-blue-700 dark:text-blue-300 font-mono">
                  name, industry, city, country, website, phone
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
