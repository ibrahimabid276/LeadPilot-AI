"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/components/ui/Card";
import { useToast } from "@/app/components/ui/Toast";
import { createClient } from "@/lib/supabase";
import {
  User,
  Mail,
  Shield,
  Bell,
  Save,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [emailSettings, setEmailSettings] = useState({
    fromName: "LeadPilot AI",
    dailyLimit: "50",
  });
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          name: user.user_metadata?.full_name || "",
          email: user.email || "",
        });
      }
    };
    getUser();
  }, []);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profile.name },
      });
      if (error) throw error;
      showToast("success", "Profile updated successfully");
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Manage your account, preferences, and application settings.
        </p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Profile section */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <User size={16} className="text-blue-500" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3 py-2.5 text-sm text-slate-500 dark:text-slate-400 cursor-not-allowed"
                value={profile.email}
                disabled
                title="Email cannot be changed here"
              />
              <p className="text-xs text-slate-500 mt-1">Email is managed through your authentication provider.</p>
            </div>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              {loading ? (<><Loader2 size={14} className="animate-spin" /> Saving...</>) : (<><Save size={14} /> Save Profile</>)}
            </button>
          </CardContent>
        </Card>

        {/* Email settings */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Mail size={16} className="text-green-500" />
              Email Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Default From Name</label>
              <input
                type="text"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={emailSettings.fromName}
                onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                placeholder="e.g., John from LeadPilot"
              />
              <p className="text-xs text-slate-500 mt-1">This name appears in the &quot;From&quot; field of sent emails.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Daily Email Limit</label>
              <input
                type="number"
                min="1"
                max="500"
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={emailSettings.dailyLimit}
                onChange={(e) => setEmailSettings({ ...emailSettings, dailyLimit: e.target.value })}
              />
              <p className="text-xs text-slate-500 mt-1">Maximum number of emails you can send per day.</p>
            </div>
            <button
              onClick={() => showToast("success", "Email settings saved")}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <Save size={14} /> Save Email Settings
            </button>
          </CardContent>
        </Card>

        {/* Security section */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Shield size={16} className="text-amber-500" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Password</p>
                <p className="text-xs text-slate-500 mt-0.5">Change your account password</p>
              </div>
              <a href="/forgot-password" className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                Reset Password
              </a>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">Two-Factor Authentication</p>
                <p className="text-xs text-slate-500 mt-0.5">Add an extra layer of security</p>
              </div>
              <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">Coming Soon</span>
            </div>
          </CardContent>
        </Card>

        {/* Notifications section */}
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Bell size={16} className="text-purple-500" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Email delivered", desc: "Get notified when an email is delivered" },
              { label: "Lead replied", desc: "Get notified when a lead replies to your email" },
              { label: "Weekly summary", desc: "Receive a weekly summary of your activity" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 p-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full bg-slate-300 dark:bg-slate-600 peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
