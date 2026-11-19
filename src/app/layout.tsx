import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import FloatingTeamSwitcher from "@/components/FloatingTeamSwitcher";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "NFL Pulse — Real-Time NFL Intelligence & News Hub",
  description:
    "Calm, editorial NFL command center for all 32 teams. Live 18-week schedules, ESPN FPI computer win probabilities, betting consensus, and real-time aggregated beat reporting.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('nfl-pulse-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = saved || (prefersDark ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-200">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <FloatingTeamSwitcher />
          <footer className="border-t border-[var(--border)] bg-[var(--background)] py-10 text-xs transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-editorial text-sm font-semibold tracking-tight text-[var(--foreground)]">
                  NFL Pulse
                </span>
                <span className="text-[var(--border)]">•</span>
                <span className="text-[var(--muted)] font-sans">
                  A calmer digital sports space
                </span>
              </div>
              <p className="text-[var(--muted)] font-sans">
                Real-time schedules, ESPN FPI model projections & aggregated news for all 32 teams.
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
