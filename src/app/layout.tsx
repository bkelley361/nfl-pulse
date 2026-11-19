import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NFL Pulse — Team Schedules, Win Probabilities & News Aggregator",
  description:
    "Real-time NFL command center for all 32 teams. Track schedules, computer win probabilities, betting odds, and aggregated team news.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-blue-600 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-slate-800/80 bg-[#070a11] py-8 text-center text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-slate-200">NFL PULSE</span>
              <span className="text-slate-500">•</span>
              <span>All 32 Teams Intelligence Hub</span>
            </div>
            <p className="text-slate-400">
              Data powered by ESPN API, FPI Predictor & Aggregated Media Feeds.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
