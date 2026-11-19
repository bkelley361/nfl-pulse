"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { NFL_TEAMS } from "@/data/teams";
import { Search, X, ChevronUp, Layers } from "lucide-react";
import { SunburstIcon } from "@/components/icons/EditorialIcons";

export default function FloatingTeamSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentSlug = pathname.startsWith("/team/")
    ? pathname.replace("/team/", "").toLowerCase()
    : null;
  const currentTeam = NFL_TEAMS.find((t) => t.slug === currentSlug);

  const filteredTeams = NFL_TEAMS.filter((t) => {
    const q = search.toLowerCase().trim();
    return (
      q === "" ||
      t.displayName.toLowerCase().includes(q) ||
      t.abbreviation.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const selectTeam = (slug: string) => {
    setIsOpen(false);
    setSearch("");
    router.push(`/team/${slug}`);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {/* Popover Menu floating directly above the button */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-team" />
              <span className="font-editorial text-base font-semibold text-[var(--foreground)]">
                Select NFL Franchise
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--input)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search all 32 franchises..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="calm-input w-full pl-9 pr-8 py-2 text-xs placeholder:text-[var(--muted)] shadow-inner"
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

          {/* Teams list */}
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
            {filteredTeams.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--muted)]">
                No franchises matched "{search}"
              </div>
            ) : (
              filteredTeams.map((t) => (
                <button
                  key={t.id}
                  onClick={() => selectTeam(t.slug)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors text-xs group cursor-pointer ${
                    t.slug === currentSlug
                      ? "bg-team-tint text-team font-semibold border border-team-tint"
                      : "hover:bg-[var(--input)] text-[var(--foreground)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={t.logo}
                      alt={t.displayName}
                      className="w-5.5 h-5.5 object-contain"
                    />
                    <div>
                      <div className="font-medium text-[var(--foreground)] group-hover:text-team transition-colors">
                        {t.displayName}
                      </div>
                      <div className="text-[10px] text-[var(--muted)]">
                        {t.conference} {t.division}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-[var(--muted)]">
                    {t.abbreviation}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button (FAB) on Bottom Right */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[var(--card)] hover:bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-500 shadow-xl transition-all duration-200 hover:scale-103 cursor-pointer"
        aria-label="Select NFL Franchise"
      >
        {currentTeam ? (
          <>
            <div className="w-6 h-6 rounded-full bg-[var(--input)] p-0.5 flex items-center justify-center border border-[var(--border)]">
              <img
                src={currentTeam.logo}
                alt={currentTeam.displayName}
                className="w-4.5 h-4.5 object-contain"
              />
            </div>
            <span className="font-semibold text-xs text-[var(--foreground)]">
              {currentTeam.shortDisplayName || currentTeam.name}
            </span>
          </>
        ) : (
          <>
            <SunburstIcon className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-xs text-[var(--foreground)]">
              Switch Team
            </span>
          </>
        )}
        <ChevronUp
          className={`w-3.5 h-3.5 text-[var(--muted)] transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
