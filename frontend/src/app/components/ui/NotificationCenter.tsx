"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Mail, Users, TrendingUp, AlertCircle, Sparkles } from "lucide-react";

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "ai";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "Email Delivered",
    message: "Your email to John at Acme Corp was delivered successfully.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    icon: Mail,
  },
  {
    id: "2",
    type: "ai",
    title: "AI Insight",
    message: "3 leads in your pipeline are ready for follow-up. AI recommends contacting them today.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    icon: Sparkles,
  },
  {
    id: "3",
    type: "info",
    title: "New Lead Added",
    message: "Tech Solutions Inc. was added to your CRM pipeline.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    icon: Users,
  },
  {
    id: "4",
    type: "warning",
    title: "Low Open Rate",
    message: "Your recent campaign has a 12% open rate. Consider optimizing subject lines.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    icon: TrendingUp,
  },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400";
      case "warning":
        return "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "ai":
        return "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400";
      default:
        return "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white dark:border-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl animate-scale-in z-50">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-5 py-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/10 px-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <Bell size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">No notifications</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {notifications.map((notification) => {
                  const Icon = notification.icon || Bell;
                  return (
                    <div
                      key={notification.id}
                      className={`flex gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        !notification.read ? "bg-blue-50/50 dark:bg-blue-500/5" : ""
                      }`}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${getIconColor(notification.type)}`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium ${!notification.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="shrink-0 rounded p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                              aria-label="Mark as read"
                            >
                              <Check size={14} />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="shrink-0 rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                        aria-label="Delete notification"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800 px-5 py-3">
              <button className="w-full text-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
