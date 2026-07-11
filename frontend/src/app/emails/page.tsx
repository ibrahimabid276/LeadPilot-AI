"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Send,
  Sparkles,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Lightbulb,
} from "lucide-react";
import { emailsApi, EmailDraft, EmailRecord } from "@/lib/api";
import { useToast } from "@/app/components/ui/Toast";

export default function EmailsPage() {
  const [leadName, setLeadName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("professional");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [toEmail, setToEmail] = useState("");
  const [generated, setGenerated] = useState(false);
  const [history, setHistory] = useState<EmailRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { showToast } = useToast();

  const fetchHistory = useCallback(async () => {
    try {
      const { data } = await emailsApi.getHistory();
      setHistory(data.emails);
    } catch {
      // History is optional, don't show error
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const generateDraft = async () => {
    if (!leadName.trim() || !industry.trim()) {
      showToast("warning", "Please fill in lead name and industry");
      return;
    }

    setGenerating(true);
    try {
      const { data } = await emailsApi.generateDraft({
        name: leadName,
        industry,
        tone,
      });
      setSubject(data.subject);
      setBody(data.body);
      setGenerated(true);
      showToast("success", "Email draft generated!");
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to generate draft");
    } finally {
      setGenerating(false);
    }
  };

  const sendEmail = async () => {
    if (!toEmail.trim() || !subject.trim() || !body.trim()) {
      showToast("warning", "Please fill in all required fields");
      return;
    }

    setSending(true);
    try {
      await emailsApi.send({
        to_email: toEmail,
        to_name: leadName,
        subject,
        body,
      });
      showToast("success", "Email sent successfully!");
      // Reset form
      setLeadName("");
      setIndustry("");
      setSubject("");
      setBody("");
      setToEmail("");
      setGenerated(false);
      // Refresh history
      fetchHistory();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "sent":
      case "delivered":
      case "mock_sent":
        return <CheckCircle size={14} className="text-green-400" />;
      case "failed":
        return <AlertCircle size={14} className="text-red-400" />;
      case "opened":
        return <CheckCircle size={14} className="text-blue-400" />;
      case "replied":
        return <CheckCircle size={14} className="text-purple-400" />;
      default:
        return <Clock size={14} className="text-gray-400" />;
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      sent: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      delivered: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      mock_sent: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
      failed: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
      opened: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
      replied: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
      draft: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
    };
    return colors[status] || "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300";
  };

  const followUpSuggestions = [
    "Follow up after 3 days if no response",
    "Try a different angle: share a case study",
    "Send a quick value-add resource",
    "Reference a recent company news item",
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Outreach</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Generate AI-powered outreach emails and send them to your leads.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Generator */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-500" />
              Generate Draft
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Lead Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g., Smile Dental Clinic"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Industry <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  placeholder="e.g., Dentistry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Tone</label>
                <select
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="casual">Casual</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              <button
                onClick={generateDraft}
                disabled={generating || !leadName.trim() || !industry.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
              >
                {generating ? (
                  <><Loader2 size={16} className="animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles size={16} /> Generate Draft</>
                )}
              </button>
            </div>
          </div>

          {/* Send section (shown after generation) */}
          {generated && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Send size={16} className="text-green-500" />
                Send Email
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    Recipient Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="lead@example.com"
                    value={toEmail}
                    onChange={(e) => setToEmail(e.target.value)}
                  />
                </div>
                <button
                  onClick={sendEmail}
                  disabled={sending || !toEmail.trim()}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
                >
                  {sending ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={16} /> Send Email</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Generated email preview */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Mail size={16} className="text-purple-500" />
            Email Preview
          </h2>

          {generated ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Body</label>
                <textarea
                  rows={12}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </div>

              {/* AI Follow-up Suggestions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Lightbulb size={12} className="text-purple-500" />
                  AI Follow-up Tips:
                </p>
                <ul className="space-y-1">
                  {followUpSuggestions.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="text-purple-500 mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <Mail className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Generate a draft to see the preview here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Email history */}
      <div className="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            Email History
          </h2>
          <button
            onClick={fetchHistory}
            disabled={loadingHistory}
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <RefreshCw size={12} className={loadingHistory ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loadingHistory ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 py-6 text-center">
            No emails sent yet. Generate and send your first outreach email!
          </p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map((email) => (
              <div
                key={email.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                    {email.subject}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    To: {email.to_name || email.to_email}
                    {email.sent_at && (
                      <span className="ml-2">
                        · {new Date(email.sent_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <span
                  className={`ml-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium shrink-0 ${statusBadge(
                    email.status
                  )}`}
                >
                  {statusIcon(email.status)}
                  {email.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
