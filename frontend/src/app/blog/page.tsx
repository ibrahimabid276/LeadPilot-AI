import type { Metadata } from "next";
import Link from "next/link";
import { Zap, ArrowRight, Calendar, Clock, User, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — LeadPilot AI",
  description: "Insights, tips, and best practices for lead generation, AI outreach, and sales automation.",
  openGraph: {
    title: "Blog — LeadPilot AI",
    description: "Insights, tips, and best practices for lead generation, AI outreach, and sales automation.",
    type: "website",
  },
};

const blogPosts = [
  {
    slug: "ai-cold-email-best-practices",
    title: "10 AI-Powered Cold Email Best Practices That Actually Work",
    excerpt: "Learn how to craft personalized cold emails using AI that get 3x higher response rates. We share proven strategies from top sales teams.",
    author: "Sarah Chen",
    date: "2026-07-10",
    readTime: "8 min read",
    category: "Email Outreach",
    image: "/blog/email-outreach.jpg",
    featured: true,
  },
  {
    slug: "lead-scoring-guide",
    title: "The Complete Guide to AI Lead Scoring",
    excerpt: "Discover how AI lead scoring can help you prioritize prospects and close more deals. Includes practical examples and implementation tips.",
    author: "Michael Torres",
    date: "2026-07-08",
    readTime: "12 min read",
    category: "Lead Generation",
    image: "/blog/lead-scoring.jpg",
    featured: true,
  },
  {
    slug: "sales-pipeline-optimization",
    title: "How to Optimize Your Sales Pipeline for Maximum Conversion",
    excerpt: "A step-by-step guide to building and optimizing a sales pipeline that converts. Learn from the best SaaS companies in the industry.",
    author: "Emily Rodriguez",
    date: "2026-07-05",
    readTime: "10 min read",
    category: "Sales Strategy",
    image: "/blog/pipeline.jpg",
    featured: false,
  },
  {
    slug: "personalization-at-scale",
    title: "Personalization at Scale: How AI Makes It Possible",
    excerpt: "Personalization increases response rates by 300%. Learn how AI enables true personalization at scale without sacrificing quality.",
    author: "David Kim",
    date: "2026-07-03",
    readTime: "7 min read",
    category: "AI & Automation",
    image: "/blog/personalization.jpg",
    featured: false,
  },
  {
    slug: "follow-up-strategies",
    title: "5 Follow-Up Strategies That Won't Annoy Your Prospects",
    excerpt: "The fortune is in the follow-up. Discover proven strategies to stay top-of-mind without being pushy, backed by data and real examples.",
    author: "Jessica Park",
    date: "2026-06-30",
    readTime: "6 min read",
    category: "Email Outreach",
    image: "/blog/follow-up.jpg",
    featured: false,
  },
  {
    slug: "local-business-leads",
    title: "How to Find and Convert Local Business Leads",
    excerpt: "Local businesses are underserved and hungry for solutions. Learn how to discover, score, and convert local business leads effectively.",
    author: "Alex Johnson",
    date: "2026-06-28",
    readTime: "9 min read",
    category: "Lead Generation",
    image: "/blog/local-leads.jpg",
    featured: false,
  },
];

const categories = [
  "All Posts",
  "Email Outreach",
  "Lead Generation",
  "Sales Strategy",
  "AI & Automation",
  "Case Studies",
];

export default function BlogPage() {
  const featuredPosts = blogPosts.filter((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                LeadPilot AI
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Pricing
              </Link>
              <Link href="/sign-in" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
              >
                Get Started
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-4">
            Insights & Resources
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Expert tips, best practices, and strategies for lead generation, AI outreach, and sales automation.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-lg card-hover"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">📧</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                      <Tag size={12} />
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                        <User size={14} className="text-slate-600 dark:text-slate-300" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-900 dark:text-white">{post.author}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Read more <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Posts */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Latest Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm hover:shadow-lg card-hover"
              >
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-5xl opacity-20">📝</div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock size={10} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{post.author}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1 font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                      Read <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 dark:text-white">LeadPilot AI</span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            AI-powered lead generation and outreach platform
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <Link href="/" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Pricing
            </Link>
            <Link href="/privacy" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              Terms
            </Link>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">
            &copy; {new Date().getFullYear()} LeadPilot AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
