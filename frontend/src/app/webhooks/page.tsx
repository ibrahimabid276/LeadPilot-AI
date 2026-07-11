"use client";

import { useState } from "react";
import { Globe, Plus, Trash2, Edit2, Check, X, Zap, AlertCircle } from "lucide-react";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  created: string;
  lastTriggered: string | null;
}

const availableEvents = [
  "lead.created",
  "lead.updated",
  "lead.deleted",
  "email.sent",
  "email.delivered",
  "email.failed",
  "email.opened",
  "crm.status_changed",
  "campaign.created",
  "campaign.completed",
];

const mockWebhooks: Webhook[] = [
  {
    id: "1",
    url: "https://api.example.com/webhooks/leadpilot",
    events: ["lead.created", "email.sent"],
    active: true,
    created: "2026-06-15",
    lastTriggered: "2026-07-10",
  },
  {
    id: "2",
    url: "https://hooks.slack.com/services/T0001/B0001/XXX",
    events: ["email.delivered", "email.failed"],
    active: true,
    created: "2026-07-01",
    lastTriggered: "2026-07-09",
  },
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(mockWebhooks);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const createWebhook = () => {
    if (!newUrl.trim() || selectedEvents.length === 0) return;
    const newWebhook: Webhook = {
      id: Date.now().toString(),
      url: newUrl,
      events: selectedEvents,
      active: true,
      created: new Date().toISOString().split("T")[0],
      lastTriggered: null,
    };
    setWebhooks((prev) => [newWebhook, ...prev]);
    setNewUrl("");
    setSelectedEvents([]);
    setShowCreateModal(false);
  };

  const deleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
  };

  const toggleActive = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Webhooks</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Receive real-time notifications when events occur in LeadPilot.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> Add Webhook
        </button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 p-4 mb-6">
        <div className="flex gap-3">
          <AlertCircle size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">How Webhooks Work</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Webhooks send HTTP POST requests to your endpoint when selected events occur. Include a secret header to verify authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* Webhooks list */}
      <div className="space-y-3">
        {webhooks.map((webhook) => (
          <div
            key={webhook.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-slate-400" />
                  <code className="text-sm font-mono text-slate-900 dark:text-white truncate">
                    {webhook.url}
                  </code>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      webhook.active
                        ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {webhook.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {webhook.events.map((event) => (
                    <span
                      key={event}
                      className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-600 dark:text-slate-400"
                    >
                      {event}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>Created: {webhook.created}</span>
                  <span>Last triggered: {webhook.lastTriggered || "Never"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleActive(webhook.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    webhook.active
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                      : "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-500/20"
                  }`}
                >
                  {webhook.active ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => deleteWebhook(webhook.id)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  aria-label="Delete webhook"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {webhooks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Globe className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No webhooks</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Create your first webhook to receive real-time event notifications.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
          >
            <Plus size={16} /> Add Webhook
          </button>
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add Webhook</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  placeholder="https://your-api.com/webhooks/leadpilot"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Events
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {availableEvents.map((event) => (
                    <button
                      key={event}
                      onClick={() => toggleEvent(event)}
                      className={`rounded-lg border px-3 py-2 text-xs font-mono text-left transition-colors ${
                        selectedEvents.includes(event)
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      {event}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createWebhook}
                disabled={!newUrl.trim() || selectedEvents.length === 0}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create Webhook
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
