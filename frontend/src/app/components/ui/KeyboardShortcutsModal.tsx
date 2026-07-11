"use client";

import { useEffect, useState } from "react";
import { X, Keyboard } from "lucide-react";

const shortcuts = [
  {
    category: "Navigation",
    items: [
      { keys: ["G", "D"], description: "Go to Dashboard" },
      { keys: ["G", "L"], description: "Go to Leads" },
      { keys: ["G", "C"], description: "Go to CRM" },
      { keys: ["G", "E"], description: "Go to Emails" },
      { keys: ["G", "A"], description: "Go to Analytics" },
      { keys: ["G", "S"], description: "Go to Settings" },
    ],
  },
  {
    category: "Actions",
    items: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["⌘", "/"], description: "Show keyboard shortcuts" },
      { keys: ["N"], description: "New lead (on leads page)" },
      { keys: ["E"], description: "Export CSV (on leads page)" },
      { keys: ["Esc"], description: "Close modal / Clear selection" },
    ],
  },
  {
    category: "General",
    items: [
      { keys: ["⌘", "J"], description: "Toggle theme (dark/light)" },
      { keys: ["?"], description: "Show this help dialog" },
      { keys: ["⌘", "Enter"], description: "Submit form" },
    ],
  },
];

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
          return;
        }
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full max-h-[80vh] overflow-y-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-500/10">
              <Keyboard size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6">
          {shortcuts.map((category) => (
            <div key={category.category}>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-2"
                  >
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <kbd className="rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                            {key}
                          </kbd>
                          {i < shortcut.keys.length - 1 && (
                            <span className="text-xs text-slate-400">then</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800/50 p-3">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            <strong>Tip:</strong> Press <kbd className="rounded border border-blue-300 dark:border-blue-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium">⌘K</kbd> to open the command palette for quick navigation.
          </p>
        </div>
      </div>
    </div>
  );
}
