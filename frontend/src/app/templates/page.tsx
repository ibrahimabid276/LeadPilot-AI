"use client";

import { useState } from "react";
import { Mail, Plus, Copy, Edit2, Trash2, Eye, Sparkles, Check } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
  usageCount: number;
  createdAt: string;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Cold Outreach - Professional",
    subject: "Quick question about {{company_name}}",
    body: "Hi {{first_name}},\n\nI came across {{company_name}} and was impressed by your work in {{industry}}. I help businesses like yours {{value_proposition}}.\n\nWould you be open to a brief 15-minute call this week to explore how we might help?\n\nBest regards,\n{{sender_name}}",
    category: "Cold Outreach",
    usageCount: 45,
    createdAt: "2026-06-15",
  },
  {
    id: "2",
    name: "Follow-up - Value Add",
    subject: "Re: Quick question about {{company_name}}",
    body: "Hi {{first_name}},\n\nJust following up on my previous email. I thought you might find this {{resource_type}} helpful — it addresses {{pain_point}} that many {{industry}} businesses face.\n\nHappy to chat if you have any questions.\n\nBest,\n{{sender_name}}",
    category: "Follow-up",
    usageCount: 32,
    createdAt: "2026-06-20",
  },
  {
    id: "3",
    name: "Meeting Request",
    subject: "Scheduling a quick demo for {{company_name}}",
    body: "Hi {{first_name}},\n\nGreat speaking with you earlier! As discussed, I'd love to show you how {{product_name}} can help {{company_name}} {{achieve_goal}}.\n\nHere's my calendar link: {{calendar_link}}\n\nLooking forward to it!\n{{sender_name}}",
    category: "Meeting",
    usageCount: 18,
    createdAt: "2026-07-01",
  },
  {
    id: "4",
    name: "Re-engagement",
    subject: "Still interested in {{topic}}?",
    body: "Hi {{first_name}},\n\nIt's been a while since we last connected. I noticed {{trigger_event}} and thought it might be a good time to revisit our conversation about {{topic}}.\n\nWould you still be interested in exploring this?\n\nBest,\n{{sender_name}}",
    category: "Re-engagement",
    usageCount: 12,
    createdAt: "2026-07-05",
  },
];

const categories = ["All", "Cold Outreach", "Follow-up", "Meeting", "Re-engagement", "Thank You", "Proposal"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: "", subject: "", body: "", category: "Cold Outreach" });

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  const duplicateTemplate = (template: EmailTemplate) => {
    const newTemplate: EmailTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const copyTemplate = (template: EmailTemplate) => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const createTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.subject.trim() || !newTemplate.body.trim()) return;
    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      subject: newTemplate.subject,
      body: newTemplate.body,
      category: newTemplate.category,
      usageCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setTemplates((prev) => [template, ...prev]);
    setNewTemplate({ name: "", subject: "", body: "", category: "Cold Outreach" });
    setShowCreateModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Templates</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Create and manage reusable email templates for your outreach campaigns.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> New Template
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
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

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all card-hover"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
                  <Mail size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{template.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{template.category}</span>
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">Used {template.usageCount}x</span>
            </div>

            <div className="mb-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Subject:</p>
              <p className="text-sm text-slate-900 dark:text-white truncate">{template.subject}</p>
            </div>
            <div className="mb-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">{template.body}</p>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPreviewTemplate(template)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Eye size={12} /> Preview
              </button>
              <button
                onClick={() => copyTemplate(template)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {copiedId === template.id ? <><Check size={12} className="text-green-500" /> Copied</> : <><Copy size={12} /> Copy</>}
              </button>
              <button
                onClick={() => duplicateTemplate(template)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Copy size={12} /> Duplicate
              </button>
              <button
                onClick={() => deleteTemplate(template.id)}
                className="ml-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <Mail className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No templates found</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Create your first email template to get started.
          </p>
        </div>
      )}

      {/* Preview modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{previewTemplate.name}</h2>
              <button onClick={() => setPreviewTemplate(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <span className="text-sm">Close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subject</label>
                <p className="text-sm text-slate-900 dark:text-white mt-1">{previewTemplate.subject}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Body</label>
                <pre className="text-sm text-slate-700 dark:text-slate-300 mt-1 whitespace-pre-wrap font-sans">{previewTemplate.body}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create Template</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Template Name</label>
                <input
                  type="text"
                  placeholder="e.g., Cold Outreach - Friendly"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Category</label>
                <select
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                >
                  {categories.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject Line</label>
                <input
                  type="text"
                  placeholder="Use {{variables}} for personalization"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={newTemplate.subject}
                  onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Body</label>
                <textarea
                  rows={8}
                  placeholder="Write your email template here..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={newTemplate.body}
                  onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                />
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50 p-3">
                <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <Sparkles size={12} /> Available variables: {"{{first_name}}"}, {"{{company_name}}"}, {"{{industry}}"}, {"{{sender_name}}"}
                </p>
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
                onClick={createTemplate}
                disabled={!newTemplate.name.trim() || !newTemplate.subject.trim() || !newTemplate.body.trim()}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Create Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
