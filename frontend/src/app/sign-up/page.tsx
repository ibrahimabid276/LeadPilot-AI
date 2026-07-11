"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { Loader2, ArrowRight, Check, X, AlertCircle } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const router = useRouter();
  const supabase = createClient();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordLengthOk = password.length >= 8;
  const passwordHasLetters = /[a-zA-Z]/.test(password);
  const passwordHasNumbers = /\d/.test(password);
  const passwordValid = passwordLengthOk && passwordHasLetters && passwordHasNumbers;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid || !passwordValid) {
      setTouched({ email: true, password: true });
      return;
    }
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  };

  const passwordChecks = [
    { label: "At least 8 characters", met: passwordLengthOk },
    { label: "Contains letters", met: passwordHasLetters },
    { label: "Contains a number", met: passwordHasNumbers },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <img
            src="/leadpilot_logo_icon.png"
            alt="LeadPilot AI"
            className="h-10 w-10 rounded-xl shadow-lg shadow-blue-500/20"
          />
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">14-day free trial. No credit card required. Cancel anytime.</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-lg text-red-600 dark:text-red-300 text-sm flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all ${
                  touched.email && !emailValid ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-700"
                }`}
                placeholder="you@company.com"
              />
              {touched.email && email.length > 0 && !emailValid && (
                <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                  <X size={12} /> Please enter a valid email address
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all ${
                  touched.password && !passwordValid ? "border-red-400 dark:border-red-500" : "border-slate-300 dark:border-slate-700"
                }`}
                placeholder="Minimum 8 characters"
              />
              {(touched.password || password.length > 0) && (
                <div className="mt-2 space-y-1">
                  {passwordChecks.map((check) => (
                    <div key={check.label} className="flex items-center gap-1.5 text-xs">
                      {check.met ? (
                        <Check size={12} className="text-green-500" />
                      ) : (
                        <X size={12} className="text-slate-400" />
                      )}
                      <span className={check.met ? "text-green-600 dark:text-green-400" : "text-slate-500"}>{check.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 active:scale-[0.98]"
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Creating account...</>
              ) : (
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            After signing up, you&apos;ll be redirected to your dashboard where you can start discovering leads.
          </p>

          <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-slate-700 dark:hover:text-slate-300">Terms of Service</Link> and{" "}
          <Link href="/privacy" className="underline hover:text-slate-700 dark:hover:text-slate-300">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
