"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Users,
  Mail,
  BarChart3,
  Settings,
  Moon,
  Sun,
  LogOut,
  Zap,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
  section?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClient();

  const navigate = (path: string) => {
    router.push(path);
    setOpen(false);
    setQuery("");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/sign-in");
    setOpen(false);
  };

  const commands: CommandItem[] = [
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "View your overview and stats",
      icon: <LayoutDashboard size={16} />,
      action: () => navigate("/"),
      keywords: ["home", "overview", "stats"],
      section: "Navigation",
    },
    {
      id: "leads",
      label: "Discover Leads",
      description: "Find new business leads",
      icon: <Users size={16} />,
      action: () => navigate("/leads"),
      keywords: ["search", "find", "business", "discovery"],
      section: "Navigation",
    },
    {
      id: "crm",
      label: "Open CRM Pipeline",
      description: "Manage your lead pipeline",
      icon: <Users size={16} />,
      action: () => navigate("/crm"),
      keywords: ["pipeline", "kanban", "manage"],
      section: "Navigation",
    },
    {
      id: "emails",
      label: "Email Outreach",
      description: "Generate and send emails",
      icon: <Mail size={16} />,
      action: () => navigate("/emails"),
      keywords: ["outreach", "send", "generate", "draft"],
      section: "Navigation",
    },
    {
      id: "analytics",
      label: "View Analytics",
      description: "Track performance metrics",
      icon: <BarChart3 size={16} />,
      action: () => navigate("/analytics"),
      keywords: ["metrics", "stats", "performance", "reports"],
      section: "Navigation",
    },
    {
      id: "settings",
      label: "Open Settings",
      description: "Manage your account",
      icon: <Settings size={16} />,
      action: () => navigate("/settings"),
      keywords: ["preferences", "account", "profile"],
      section: "Navigation",
    },
    {
      id: "signout",
      label: "Sign Out",
      description: "Log out of your account",
      icon: <LogOut size={16} />,
      action: handleSignOut,
      keywords: ["logout", "exit", "leave"],
      section: "Actions",
    },
  ];

  const filteredCommands = commands.filter((cmd) => {
    if (!query) return true;
    const searchStr = `${cmd.label} ${cmd.description || ""} ${(cmd.keywords || []).join(" ")}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  // Group commands by section
  const grouped = filteredCommands.reduce((acc, cmd) => {
    const section = cmd.section || "Other";
    if (!acc[section]) acc[section] = [];
    acc[section].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  let globalIndex = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Command palette */}
      <div className="relative w-full max-w-lg rounded-xl border border-gray-700 bg-gray-800 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-700 px-4">
          <Search size={18} className="text-gray-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="w-full bg-transparent py-4 text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-600 bg-gray-700 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Zap size={24} className="text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No commands found</p>
              <p className="text-xs text-gray-600 mt-1">Try a different search term</p>
            </div>
          ) : (
            Object.entries(grouped).map(([section, items]) => (
              <div key={section} className="mb-2">
                <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  {section}
                </div>
                {items.map((cmd) => {
                  const idx = globalIndex++;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        setOpen(false);
                        setQuery("");
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`
                        w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left
                        transition-colors duration-75
                        ${selectedIndex === idx
                          ? "bg-blue-600/15 text-blue-400"
                          : "text-gray-300 hover:bg-gray-700/50"
                        }
                      `}
                    >
                      <span className={`
                        flex h-7 w-7 items-center justify-center rounded-md
                        ${selectedIndex === idx ? "bg-blue-600/20" : "bg-gray-700"}
                      `}>
                        {cmd.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{cmd.label}</div>
                        {cmd.description && (
                          <div className="text-xs text-gray-500 truncate">{cmd.description}</div>
                        )}
                      </div>
                      {selectedIndex === idx && (
                        <ArrowRight size={14} className="text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-700 px-4 py-2">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-600 bg-gray-700 px-1 py-0.5">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-gray-600 bg-gray-700 px-1 py-0.5">↵</kbd>
              Select
            </span>
          </div>
          <span className="text-[10px] text-gray-600">LeadPilot AI</span>
        </div>
      </div>
    </div>
  );
}
