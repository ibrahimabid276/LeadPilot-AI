import Link from "next/link";
import { Zap, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="flex items-center gap-2.5 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
      </div>

      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <svg
          className="h-12 w-12 text-slate-400 dark:text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-3 gradient-text">404</h1>
      <p className="text-xl text-slate-700 dark:text-slate-300 mb-2 font-medium">Page not found</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Check the URL or head back to the dashboard.
      </p>
      <div className="flex gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
        >
          <ArrowLeft size={16} />
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
