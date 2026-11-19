"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NFL_TEAMS } from "@/data/teams";
import ThemeToggle from "@/components/ThemeToggle";
import { Search, ChevronDown, Sparkles, X, Compass } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentSlug = pathname.startsWith("/team/")
    ? pathname.replace("/team/", "").toLowerCase()
    : null;
  const currentTeam = NFL_TEAMS.find((t) => t.slug === currentSlug);

  const filteredTeams = NFL_TEAMS.filter((t) =>
    t.displayName.toLowerCase().includes(search.toLowerCase()) ||
    t.abbreviation.toLowerCase().includes(search.toLowerCase()) ||
    t.location.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectTeam = (slug: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(`/team/${slug}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Editorial Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full border border-[var(--border)] bg-[var(--card)] flex items-center justify-center shadow-xs group-hover:border-slate-400 transition-colors">
              {/* Subtle sunburst / compass inspired by image 1 */}
              <Compass className="w-4 h-4 text-[var(--foreground)] group-hover:rotate-45 transition-transform duration-300" />
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

          {/* Center Team Quick Switcher (Pill style from Image 4) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--card)] hover:border-slate-400 dark:hover:border-slate-600 text-xs font-medium text-[var(--foreground)] transition-all shadow-xs"
            >
              {currentTeam ? (
                <>
                  <img
                    src={currentTeam.logo}
                    alt={currentTeam.displayName}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="hidden sm:inline font-semibold">{currentTeam.displayName}</span>
                  <span className="sm:hidden font-bold">{currentTeam.abbreviation}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[var(--muted)]">Choose NFL Team</span>
                </>
              )}
              <ChevronDown
                className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-2">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder="Search all 32 teams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                    className="w-full bg-[var(--input)] border border-[var(--border)] rounded-full pl-8.5 pr-8 py-2 text-xs text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none focus:border-slate-400 transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                  {filteredTeams.length === 0 ? (
                    <div className="p-4 text-center text-xs text-[var(--muted)]">
                      No teams found for "{search}"
                    </div>
                  ) : (
                    filteredTeams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => selectTeam(t.slug)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors text-xs group ${
                          t.slug === currentSlug
                            ? "bg-slate-100 dark:bg-slate-800 font-semibold"
                            : "hover:bg-[var(--input)] text-[var(--foreground)]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={t.logo}
                            alt={t.displayName}
                            className="w-5 h-5 object-contain"
                          />
                          <div>
                            <div className="font-medium text-[var(--foreground)]">
                              {t.displayName}
                            </div>
                            <div className="text-[10px] text-[var(--muted)]">
                              {t.conference} {t.division}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-[var(--muted)]">
                          {t.abbreviation}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Theme Toggle & All Teams Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-block text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors px-2.5 py-1.5 rounded-full hover:bg-[var(--input)]"
            >
              All Teams
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
