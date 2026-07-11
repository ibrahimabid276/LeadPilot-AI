"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Auth pages and public pages render without sidebar
  const isAuthPage =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  const isPublicPage =
    pathname === "/" ||
    pathname === "/pricing" ||
    pathname === "/privacy" ||
    pathname === "/terms" ||
    pathname === "/about" ||
    pathname === "/blog" ||
    pathname === "/docs" ||
    pathname === "/changelog";

  if (isAuthPage || isPublicPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 dark:bg-gray-950 bg-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main content */}
      <main
        className="flex-1 overflow-y-auto"
        id="main-content"
        role="main"
      >
        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-800 dark:border-gray-800 border-gray-200 bg-gray-950/80 dark:bg-gray-950/80 bg-white/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Open navigation menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <span className="text-sm font-semibold text-white">LeadPilot AI</span>
        </div>

        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
