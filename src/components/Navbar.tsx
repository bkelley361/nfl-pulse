"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { NFL_TEAMS } from "@/data/teams";
import { Search, ChevronDown, Trophy, Activity, ExternalLink, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Find currently selected team if on a team page
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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-amber-500 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-wider text-white">NFL</span>
                <span className="font-extrabold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400">
                  PULSE
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold border border-blue-500/20">
                  2026
                </span>
              </div>
            </div>
          </Link>

          {/* Center / Team Quick Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-slate-700/80 bg-slate-900/80 hover:bg-slate-800/90 text-sm font-medium text-slate-200 transition-all shadow-sm hover:border-slate-600"
            >
              {currentTeam ? (
                <>
                  <img
                    src={currentTeam.logo}
                    alt={currentTeam.displayName}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="hidden sm:inline font-semibold">{currentTeam.displayName}</span>
                  <span className="sm:hidden font-bold">{currentTeam.abbreviation}</span>
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span>Select NFL Team</span>
                </>
              )}
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-80 sm:w-96 rounded-xl border border-slate-700/80 bg-[#0d1322] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="relative mb-2">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search all 32 teams..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoFocus
                    className="w-full bg-slate-900/90 border border-slate-750 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                  {filteredTeams.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No teams found for "{search}"
                    </div>
                  ) : (
                    filteredTeams.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => selectTeam(t.slug)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-sm group ${
                          t.slug === currentSlug
                            ? "bg-blue-600/20 text-blue-300 border border-blue-500/30 font-medium"
                            : "hover:bg-slate-800/70 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={t.logo}
                            alt={t.displayName}
                            className="w-6 h-6 object-contain"
                          />
                          <div>
                            <div className="font-medium text-slate-100 group-hover:text-white">
                              {t.displayName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {t.conference} {t.division}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {t.abbreviation}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-slate-800/60"
            >
              All Teams
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
