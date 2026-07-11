"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Mail,
  Users,
  BarChart3,
  Settings,
  LogIn,
  LogOut,
  X,
  Sun,
  Moon,
  Command,
  Key,
  Plug,
  Users2,
  CreditCard,
  Globe,
  History,
  FileText,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useTheme } from "./providers/ThemeProvider";
import { NotificationCenter } from "./ui/NotificationCenter";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Lead Discovery", icon: Search },
  { href: "/crm", label: "CRM Pipeline", icon: Users },
  { href: "/emails", label: "Email Outreach", icon: Mail },
  { href: "/templates", label: "Templates", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/webhooks", label: "Webhooks", icon: Globe },
  { href: "/team", label: "Team", icon: Users2 },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/api-keys", label: "API Keys", icon: Key },
  { href: "/audit-history", label: "Audit Log", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserEmail(user?.email ?? null);
      setUserName(user?.user_metadata?.full_name ?? null);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setUserName(null);
    router.push("/sign-in");
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="flex h-full flex-col bg-gray-900 dark:bg-gray-900 bg-white border-r border-gray-800 dark:border-gray-800 border-gray-200">
      {/* Header / Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-gray-800 dark:border-gray-800 border-gray-200">
        <Link href="/" className="flex items-center gap-2.5 group" onClick={handleNavClick}>
          <img
            src="/leadpilot_logo_icon.png"
            alt="LeadPilot AI Logo"
            className="h-8 w-8 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow"
          />
          <span className="text-lg font-bold text-white dark:text-white text-gray-900 tracking-tight">
            LeadPilot
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors lg:hidden"
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-blue-600/15 text-blue-400 shadow-sm"
                  : "text-gray-400 dark:text-gray-400 text-gray-600 hover:bg-gray-800/70 dark:hover:bg-gray-800/70 hover:bg-gray-100 hover:text-gray-200 dark:hover:text-gray-200 hover:text-gray-900"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={18}
                className={isActive ? "text-blue-400" : "text-gray-500 dark:text-gray-500 text-gray-400"}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />
              )}
            </Link>
          );
        })}

        {/* Command palette shortcut */}
        <button
          onClick={() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            handleNavClick();
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-500 text-gray-400 hover:bg-gray-800/70 dark:hover:bg-gray-800/70 hover:bg-gray-100 hover:text-gray-200 dark:hover:text-gray-200 hover:text-gray-900 transition-all duration-150 mt-4 border-t border-gray-800 dark:border-gray-800 border-gray-200 pt-4"
        >
          <Command size={16} />
          <span className="flex-1 text-left">Command Palette</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-gray-700 dark:border-gray-700 border-gray-300 bg-gray-800 dark:bg-gray-800 bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            ⌘K
          </kbd>
        </button>
      </nav>

      {/* User section */}
      <div className="border-t border-gray-800 dark:border-gray-800 border-gray-200 p-3 space-y-2">
        {/* Notifications */}
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Notifications</span>
          <NotificationCenter />
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 dark:text-gray-400 text-gray-600 hover:bg-gray-800/70 dark:hover:bg-gray-800/70 hover:bg-gray-100 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {userEmail ? (
          <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
              {(userName?.[0] || userEmail[0]).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {userName && (
                <p className="text-sm font-medium text-gray-200 dark:text-gray-200 text-gray-900 truncate">
                  {userName}
                </p>
              )}
              <p className="text-xs text-gray-500 truncate">{userEmail}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 rounded-lg p-1.5 text-gray-500 hover:bg-gray-800 dark:hover:bg-gray-800 hover:bg-gray-100 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            onClick={handleNavClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 dark:text-gray-400 text-gray-600 hover:bg-gray-800/70 dark:hover:bg-gray-800/70 hover:bg-gray-100 hover:text-gray-200 dark:hover:text-gray-200 hover:text-gray-900 transition-colors"
          >
            <LogIn size={18} />
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
