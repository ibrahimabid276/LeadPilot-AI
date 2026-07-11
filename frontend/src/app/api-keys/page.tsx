"use client";

import { useState } from "react";
import { Key, Plus, Copy, Eye, EyeOff, Trash2, Shield, AlertCircle, Check } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string | null;
  status: "active" | "revoked";
}

const mockKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "lp_live_sk_1a2b3c4d5e6f7g8h9i0j",
    created: "2026-06-15",
    lastUsed: "2026-07-10",
    status: "active",
  },
  {
    id: "2",
    name: "Development Key",
    key: "lp_test_sk_9z8y7x6w5v4u3t2s1r0q",
    created: "2026-07-01",
    lastUsed: "2026-07-09",
    status: "active",
  },
  {
    id: "3",
    name: "Old Integration",
    key: "lp_live_sk_old_key_revoked",
    created: "2026-05-01",
    lastUsed: "2026-06-01",
    status: "revoked",
  },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(mockKeys);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const toggleReveal = (keyId: string) => {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(keyId)) {
        next.delete(keyId);
      } else {
        next.add(keyId);
      }
      return next;
    });
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const revokeKey = (keyId: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, status: "revoked" as const } : k))
    );
  };

  const createKey = () => {
    if (!newKeyName.trim()) return;
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: `lp_live_sk_${Math.random().toString(36).substring(2, 22)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: null,
      status: "active",
    };
    setKeys((prev) => [newKey, ...prev]);
    setNewKeyName("");
    setShowCreateModal(false);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + "•".repeat(20) + key.substring(key.length - 4);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">API Keys</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your API keys to access the LeadPilot API.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> Create API Key
        </button>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-900/20 p-4 mb-6">
        <div className="flex gap-3">
          <Shield size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-1">API Security</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Keep your API keys secure. Never share them publicly or commit them to version control. Use environment variables in production.
            </p>
          </div>
        </div>
      </div>

      {/* API Keys list */}
      <div className="space-y-3">
        {keys.map((apiKey) => (
          <div
            key={apiKey.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Key size={16} className="text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {apiKey.name}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      apiKey.status === "active"
                        ? "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {apiKey.status === "active" ? "Active" : "Revoked"}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <code className="flex-1 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-hidden">
                    {revealedKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <button
                    onClick={() => toggleReveal(apiKey.id)}
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label={revealedKeys.has(apiKey.id) ? "Hide API key" : "Show API key"}
                  >
                    {revealedKeys.has(apiKey.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => copyKey(apiKey.key)}
                    className="shrink-0 rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Copy API key"
                  >
                    {copiedKey === apiKey.key ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span>Created: {apiKey.created}</span>
                  <span>Last used: {apiKey.lastUsed || "Never"}</span>
                </div>
              </div>
              {apiKey.status === "active" && (
                <button
                  onClick={() => revokeKey(apiKey.id)}
                  className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  aria-label="Revoke API key"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {keys.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Key className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No API keys</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Create your first API key to start using the LeadPilot API.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all"
          >
            <Plus size={16} /> Create API Key
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
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create API Key</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Key Name
              </label>
              <input
                type="text"
                placeholder="e.g., Production API Key"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createKey}
                disabled={!newKeyName.trim()}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
