"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { Building2, Mail, Phone, Star, MapPin, Loader2, RefreshCw, Sparkles, Lightbulb } from "lucide-react";
import { crmApi, CrmLeadEntry } from "@/lib/api";
import { CardSkeleton } from "@/app/components/ui/Skeleton";
import { useToast } from "@/app/components/ui/Toast";

// Lazy load drag-and-drop library (heavy)
const DragDropContext = dynamic(() => import("@hello-pangea/dnd").then((mod) => mod.DragDropContext), { ssr: false });
const Droppable = dynamic(() => import("@hello-pangea/dnd").then((mod) => mod.Droppable), { ssr: false });
const Draggable = dynamic(() => import("@hello-pangea/dnd").then((mod) => mod.Draggable), { ssr: false });
type DropResult = { draggableId: string; destination: { droppableId: string } | null };

type LeadStatus = "new" | "contacted" | "replied" | "meeting" | "client" | "closed";

const statusConfig: Record<LeadStatus, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "New Leads", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500", border: "border-blue-500" },
  contacted: { label: "Contacted", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500", border: "border-amber-500" },
  replied: { label: "Replied", color: "text-green-600 dark:text-green-400", bg: "bg-green-500", border: "border-green-500" },
  meeting: { label: "Meeting", color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500", border: "border-purple-500" },
  client: { label: "Client", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500", border: "border-indigo-500" },
  closed: { label: "Closed", color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500", border: "border-slate-500" },
};

export default function CrmPage() {
  const [leads, setLeads] = useState<CrmLeadEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchLeads = useCallback(async () => {
    try {
      const { data } = await crmApi.getLeads();
      setLeads(data.leads);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load CRM leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const leadsByStatus = leads.reduce((acc, lead) => {
    if (!acc[lead.status as LeadStatus]) acc[lead.status as LeadStatus] = [];
    acc[lead.status as LeadStatus].push(lead);
    return acc;
  }, {} as Record<LeadStatus, CrmLeadEntry[]>);

  const onDragEnd = async (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;

    const newStatus = destination.droppableId as LeadStatus;

    // Optimistic update
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === draggableId ? { ...lead, status: newStatus } : lead
      )
    );

    setMovingId(draggableId);
    try {
      await crmApi.updateLead(draggableId, { status: newStatus });
      showToast("success", "Lead moved successfully");
    } catch (err) {
      // Revert on error
      fetchLeads();
      showToast("error", "Failed to update lead status");
    } finally {
      setMovingId(null);
    }
  };

  const getAISuggestion = (status: LeadStatus, lead: CrmLeadEntry): string => {
    switch (status) {
      case "new":
        return "Send initial outreach email";
      case "contacted":
        return "Follow up in 3 days";
      case "replied":
        return "Schedule a discovery call";
      case "meeting":
        return "Send proposal or case study";
      case "client":
        return "Request testimonial or referral";
      default:
        return "Archive or re-engage";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">CRM Pipeline</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Drag and drop leads between stages to update their status.
          </p>
        </div>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20 p-4">
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Building2 className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">
            Your pipeline is empty
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4">
            Add leads from the Lead Discovery page to start building your sales
            pipeline.
          </p>
          <a
            href="/leads"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            Discover Leads
          </a>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 lg:-mx-6 lg:px-6">
            {Object.entries(statusConfig).map(([status, config]) => {
              const columnLeads = leadsByStatus[status as LeadStatus] || [];
              return (
                <div key={status} className="min-w-[260px] w-[260px] shrink-0">
                  {/* Column header */}
                  <div
                    className={`${config.bg} text-white px-3 py-2 rounded-t-lg flex items-center justify-between`}
                  >
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-xs font-bold bg-white/20 rounded-full px-2 py-0.5">
                      {columnLeads.length}
                    </span>
                  </div>

                  {/* Droppable area */}
                  <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`bg-slate-50 dark:bg-slate-800/50 rounded-b-lg p-2 min-h-[200px] border border-slate-200 dark:border-slate-700/50 transition-colors ${
                          snapshot.isDraggingOver ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-500/5" : ""
                        }`}
                      >
                        {columnLeads.map((lead, index) => (
                          <Draggable
                            key={lead.id}
                            draggableId={lead.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 mb-2 rounded-lg border transition-all ${
                                  snapshot.isDragging
                                    ? "bg-white dark:bg-slate-700 border-blue-500 shadow-lg shadow-blue-500/10"
                                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                } ${movingId === lead.id ? "opacity-50" : ""}`}
                              >
                                <div className="font-medium text-slate-900 dark:text-white text-sm mb-1.5 truncate">
                                  {lead.lead.name}
                                </div>
                                {lead.lead.industry && (
                                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                    <Building2 size={11} />
                                    <span className="truncate">{lead.lead.industry}</span>
                                  </div>
                                )}
                                {(lead.lead.city || lead.lead.country) && (
                                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                    <MapPin size={11} />
                                    <span className="truncate">
                                      {[lead.lead.city, lead.lead.country].filter(Boolean).join(", ")}
                                    </span>
                                  </div>
                                )}
                                {lead.lead.email && (
                                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1">
                                    <Mail size={11} />
                                    <span className="truncate">{lead.lead.email}</span>
                                  </div>
                                )}
                                {lead.lead.phone && (
                                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs">
                                    <Phone size={11} />
                                    <span>{lead.lead.phone}</span>
                                  </div>
                                )}
                                {lead.lead.google_rating && (
                                  <div className="flex items-center gap-1 mt-2 text-amber-500 text-xs">
                                    <Star size={11} fill="currentColor" />
                                    <span className="font-medium">
                                      {lead.lead.google_rating}
                                    </span>
                                    {lead.lead.review_count && (
                                      <span className="text-slate-500">
                                        ({lead.lead.review_count})
                                      </span>
                                    )}
                                  </div>
                                )}
                                {/* AI Suggestion */}
                                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                  <div className="flex items-start gap-1.5">
                                    <Lightbulb size={10} className="text-purple-500 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-purple-600 dark:text-purple-400 leading-tight">
                                      {getAISuggestion(status as LeadStatus, lead)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}
