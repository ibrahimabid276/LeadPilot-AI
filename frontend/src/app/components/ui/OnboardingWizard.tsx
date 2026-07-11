"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Building2,
  Mail,
  Target,
  Users,
  Globe,
  Sparkles,
  Loader2,
  SkipForward,
} from "lucide-react";

const steps = [
  { id: 1, title: "Welcome", icon: Zap },
  { id: 2, title: "Your Business", icon: Building2 },
  { id: 3, title: "Target Audience", icon: Target },
  { id: 4, title: "Email Setup", icon: Mail },
  { id: 5, title: "Ready!", icon: Sparkles },
];

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    targetCountry: "",
    targetIndustry: "",
    targetRole: "",
    emailTone: "professional",
    emailGoal: "generate_leads",
  });

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    // Store onboarding data in localStorage for now
    localStorage.setItem("onboarding_complete", "true");
    localStorage.setItem("onboarding_data", JSON.stringify(data));
    setTimeout(() => {
      router.push("/dashboard");
      router.refresh();
    }, 500);
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_complete", "true");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">LeadPilot AI</span>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isComplete = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-9 w-9 rounded-full border-2 transition-all ${
                      isComplete
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCurrent
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "border-slate-300 dark:border-slate-700 text-slate-400"
                    }`}
                  >
                    {isComplete ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-1 ${isComplete ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {steps[currentStep - 1].title}
            </p>
            <p className="text-xs text-slate-500">Step {currentStep} of {totalSteps}</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-xl border border-slate-200 dark:border-slate-800">
          {/* Step 1: Welcome */}
          {currentStep === 1 && (
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 mb-6">
                <Sparkles size={32} className="text-blue-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Welcome to LeadPilot AI!
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Let&apos;s set up your account in just a few steps. We&apos;ll personalize your experience so you can start generating leads right away.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { icon: Target, label: "Discover leads" },
                  { icon: Mail, label: "AI emails" },
                  { icon: Users, label: "Track in CRM" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <Icon size={20} className="text-blue-500" />
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Your Business */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Tell us about your business</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">This helps us personalize your experience.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="Acme Inc."
                    value={data.companyName}
                    onChange={(e) => setData({ ...data, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Industry</label>
                  <select
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white transition-all"
                    value={data.industry}
                    onChange={(e) => setData({ ...data, industry: e.target.value })}
                  >
                    <option value="">Select your industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="real_estate">Real Estate</option>
                    <option value="marketing">Marketing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["1-10", "11-50", "51-200", "200+"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setData({ ...data, companySize: size })}
                        className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                          data.companySize === size
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-600"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Target Audience */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Who are your ideal customers?</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">We&apos;ll use this to find relevant leads for you.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Country</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="e.g., United States"
                    value={data.targetCountry}
                    onChange={(e) => setData({ ...data, targetCountry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Target Industry</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="e.g., Dentistry, Restaurants, Gyms"
                    value={data.targetIndustry}
                    onChange={(e) => setData({ ...data, targetIndustry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Decision Maker Role</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                    placeholder="e.g., Owner, CEO, Marketing Director"
                    value={data.targetRole}
                    onChange={(e) => setData({ ...data, targetRole: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Email Setup */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Email preferences</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Customize how AI generates your outreach emails.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Tone</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: "professional", label: "Professional", desc: "Formal & polished" },
                      { value: "friendly", label: "Friendly", desc: "Warm & approachable" },
                      { value: "persuasive", label: "Persuasive", desc: "Compelling & direct" },
                      { value: "casual", label: "Casual", desc: "Relaxed & natural" },
                    ].map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => setData({ ...data, emailTone: tone.value })}
                        className={`px-4 py-3 rounded-lg border text-left transition-all ${
                          data.emailTone === tone.value
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                            : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
                        }`}
                      >
                        <span className={`text-sm font-medium ${data.emailTone === tone.value ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                          {tone.label}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">{tone.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Primary Goal</label>
                  <div className="space-y-2">
                    {[
                      { value: "generate_leads", label: "Generate new leads", icon: Target },
                      { value: "book_meetings", label: "Book meetings", icon: Globe },
                      { value: "promote_product", label: "Promote a product", icon: Sparkles },
                    ].map((goal) => {
                      const Icon = goal.icon;
                      return (
                        <button
                          key={goal.value}
                          onClick={() => setData({ ...data, emailGoal: goal.value })}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-all ${
                            data.emailGoal === goal.value
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10"
                              : "border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600"
                          }`}
                        >
                          <Icon size={18} className={data.emailGoal === goal.value ? "text-blue-500" : "text-slate-400"} />
                          <span className={`text-sm font-medium ${data.emailGoal === goal.value ? "text-blue-600 dark:text-blue-400" : "text-slate-700 dark:text-slate-300"}`}>
                            {goal.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Ready */}
          {currentStep === 5 && (
            <div className="text-center">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mb-6">
                <Check size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">You&apos;re all set!</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Your account is configured and ready to go. Here&apos;s what you can do next:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                {[
                  { icon: Target, title: "Discover Leads", desc: "Find businesses by location & industry" },
                  { icon: Mail, title: "Generate Emails", desc: "AI-crafted personalized outreach" },
                  { icon: Users, title: "Manage Pipeline", desc: "Track leads in your CRM" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <Icon size={20} className="text-blue-500 mb-2" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {currentStep < totalSteps - 1 && (
                <button
                  onClick={handleSkip}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <SkipForward size={14} />
                  Skip
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium text-white transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Setting up...</>
                ) : currentStep === totalSteps ? (
                  <>Go to Dashboard <ArrowRight size={16} /></>
                ) : (
                  <>Continue <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
