"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { FanSunburstLogo } from "@/components/icons/EditorialIcons";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Editorial Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center shadow-xs group-hover:border-slate-400 transition-colors">
              <FanSunburstLogo className="w-4 h-4 text-team group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-editorial text-xl font-medium tracking-tight text-[var(--foreground)]">
                  NFL
                </span>
                <span className="text-xs font-light text-[var(--muted)]">/</span>
                <span className="font-editorial italic text-xl font-medium text-[var(--foreground)]">
                  Pulse
                </span>
              </div>
            </div>
          </Link>

          {/* Right: All Teams link & Theme Toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-3 py-1.5 rounded-full hover:bg-[var(--input)]"
            >
              All Franchises
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
