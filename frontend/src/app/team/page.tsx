"use client";

import { useState } from "react";
import { Users, Plus, Mail, Shield, UserCheck, UserX, Crown, MoreVertical } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "invited" | "inactive";
  avatar?: string;
  joinedDate: string;
}

const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@leadpilot.ai",
    role: "owner",
    status: "active",
    joinedDate: "2026-01-15",
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah@company.com",
    role: "admin",
    status: "active",
    joinedDate: "2026-02-20",
  },
  {
    id: "3",
    name: "Michael Torres",
    email: "michael@company.com",
    role: "member",
    status: "active",
    joinedDate: "2026-03-10",
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    email: "emily@company.com",
    role: "viewer",
    status: "invited",
    joinedDate: "2026-07-08",
  },
];

const roles = [
  { value: "owner", label: "Owner", description: "Full access, can manage billing and team" },
  { value: "admin", label: "Admin", description: "Can manage team members and settings" },
  { value: "member", label: "Member", description: "Can access all features except billing" },
  { value: "viewer", label: "Viewer", description: "Read-only access to data" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>(mockMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  const inviteMember = () => {
    if (!inviteEmail.trim()) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: inviteRole as TeamMember["role"],
      status: "invited",
      joinedDate: new Date().toISOString().split("T")[0],
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    setInviteRole("member");
    setShowInviteModal(false);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const changeRole = (id: string, newRole: TeamMember["role"]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
  };

  const getRoleBadge = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium text-purple-600 dark:text-purple-400">
            <Crown size={10} /> Owner
          </span>
        );
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <Shield size={10} /> Admin
          </span>
        );
      case "member":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
            <UserCheck size={10} /> Member
          </span>
        );
      case "viewer":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            Viewer
          </span>
        );
    }
  };

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" /> Active
          </span>
        );
      case "invited":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            Invited
          </span>
        );
      case "inactive":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-slate-400" /> Inactive
          </span>
        );
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Team</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Manage your team members and their permissions.
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={16} /> Invite Member
        </button>
      </div>

      {/* Team stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-500/10">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {members.filter((m) => m.status === "active").length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Active Members</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/10">
              <Mail size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {members.filter((m) => m.status === "invited").length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pending Invites</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/10">
              <Shield size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {members.filter((m) => m.role === "admin" || m.role === "owner").length}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Admins & Owners</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members list */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-200 dark:border-slate-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Team Members</h2>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {member.name}
                    </p>
                    {getStatusBadge(member.status)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                {getRoleBadge(member.role)}
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                  Joined {member.joinedDate}
                </span>
                {member.role !== "owner" && (
                  <button
                    onClick={() => removeMember(member.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                    aria-label="Remove member"
                  >
                    <UserX size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite modal */}
      {showInviteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowInviteModal(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Invite Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="colleague@company.com"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Role
                </label>
                <select
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  {roles
                    .filter((r) => r.value !== "owner")
                    .map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={inviteMember}
                disabled={!inviteEmail.trim()}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
