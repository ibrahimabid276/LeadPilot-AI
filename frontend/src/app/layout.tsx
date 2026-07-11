import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AppShell from "./components/layout/AppShell";
import { ToastProvider } from "./components/ui/Toast";
import { ThemeProvider } from "./components/providers/ThemeProvider";
import { CommandPalette } from "./components/ui/CommandPalette";
import { KeyboardShortcutsModal } from "./components/ui/KeyboardShortcutsModal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeadPilot AI — AI-Powered Lead Generation Platform",
    template: "%s | LeadPilot AI",
  },
  description:
    "Discover, score, and convert leads with AI-powered outreach. LeadPilot AI helps businesses find prospects, generate personalized emails, and manage their sales pipeline — all in one platform.",
  keywords: [
    "lead generation",
    "AI outreach",
    "email marketing",
    "CRM",
    "sales pipeline",
    "business leads",
    "lead scoring",
    "AI email generator",
    "sales automation",
    "outreach platform",
  ],
  authors: [{ name: "LeadPilot AI" }],
  creator: "LeadPilot AI",
  publisher: "LeadPilot AI",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LeadPilot AI",
    title: "LeadPilot AI — AI-Powered Lead Generation Platform",
    description:
      "Discover, score, and convert leads with AI-powered outreach. Find prospects, generate personalized emails, and manage your sales pipeline.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeadPilot AI - AI-Powered Lead Generation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadPilot AI — AI-Powered Lead Generation Platform",
    description:
      "Discover, score, and convert leads with AI-powered outreach.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://leadpilot.ai"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#030712" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full bg-gray-950 dark:bg-gray-950 bg-white text-gray-100 dark:text-gray-100 text-gray-900 font-sans">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
          >
            Skip to main content
          </a>
          <ToastProvider>
            <AppShell>
              {children}
              <CommandPalette />
              <KeyboardShortcutsModal />
            </AppShell>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
