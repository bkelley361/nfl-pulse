"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NFL_TEAMS } from "@/data/teams";
import { Search, ArrowRight, SlidersHorizontal, Trophy } from "lucide-react";

export default function TeamSelector() {
  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState<"ALL" | "AFC" | "NFC">("ALL");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");

  const filteredTeams = useMemo(() => {
    return NFL_TEAMS.filter((team) => {
      const matchesSearch =
        team.displayName.toLowerCase().includes(search.toLowerCase()) ||
        team.name.toLowerCase().includes(search.toLowerCase()) ||
        team.location.toLowerCase().includes(search.toLowerCase()) ||
        team.abbreviation.toLowerCase().includes(search.toLowerCase());

      const matchesConf =
        conferenceFilter === "ALL" || team.conference === conferenceFilter;

      const matchesDiv =
        divisionFilter === "ALL" || team.division === divisionFilter;

      return matchesSearch && matchesConf && matchesDiv;
    });
  }, [search, conferenceFilter, divisionFilter]);

  const conferences = ["ALL", "AFC", "NFC"] as const;
  const divisions = ["ALL", "East", "North", "South", "West"];

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar (Inspired by Image 4 Component 04 & 07) */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between calm-card p-4">
        {/* Pill Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search franchise, city, or code (e.g. Lions, Buccaneers, KC)..."
            className="calm-input w-full pl-10 pr-10 py-2.5 text-xs placeholder:text-[var(--muted)] shadow-inner"
          />
          <SlidersHorizontal className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
        </div>

        {/* Conference & Division Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Conference Toggles */}
          <div className="inline-flex rounded-full bg-[var(--input)] p-1 border border-[var(--border)] shadow-inner">
            {conferences.map((conf) => (
              <button
                key={conf}
                onClick={() => setConferenceFilter(conf)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  conferenceFilter === conf
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {conf === "ALL" ? "All NFL" : conf}
              </button>
            ))}
          </div>

          {/* Division Toggles */}
          <div className="inline-flex rounded-full bg-[var(--input)] p-1 border border-[var(--border)] shadow-inner">
            {divisions.map((div) => (
              <button
                key={div}
                onClick={() => setDivisionFilter(div)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  divisionFilter === div
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {div}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Teams */}
      {filteredTeams.length === 0 ? (
        <div className="calm-card p-12 text-center">
          <Trophy className="w-8 h-8 mx-auto text-[var(--muted-light)] mb-3" />
          <h3 className="font-editorial text-lg font-medium text-[var(--foreground)]">
            No franchises found
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1">
            Try adjusting your search query or reset your filters.
          </p>
          <button
            onClick={() => {
              setSearch("");
              setConferenceFilter("ALL");
              setDivisionFilter("ALL");
            }}
            className="mt-4 px-4 py-2 rounded-full bg-[var(--input)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTeams.map((team, idx) => {
            const indexStr = String(idx + 1).padStart(2, "0");

            return (
              <Link
                key={team.id}
                href={`/team/${team.slug}`}
                className="group calm-card p-5 relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                style={
                  {
                    "--team-primary": team.color,
                  } as React.CSSProperties
                }
              >
                {/* Soft ambient tint glow in team's official hex color */}
                <div
                  className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-2xl opacity-12 group-hover:opacity-28 transition-opacity pointer-events-none"
                  style={{ backgroundColor: team.color }}
                />

                {/* Top: Number prefix & division badge */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="font-editorial text-xs font-semibold text-[var(--muted)]">
                    {indexStr}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--input)] text-[var(--muted)] border border-[var(--border)]">
                      {team.abbreviation}
                    </span>
                    <span className="text-[10px] text-[var(--muted)] font-medium">
                      {team.conference} {team.division}
                    </span>
                  </div>
                </div>

                {/* Center: Logo & Name */}
                <div className="flex items-center gap-3.5 my-2">
                  <div
                    className="w-13 h-13 rounded-2xl p-2 bg-[var(--input)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs"
                    style={{
                      boxShadow: `0 6px 16px -4px ${team.color}25`,
                    }}
                  >
                    <img
                      src={team.logo}
                      alt={team.displayName}
                      className="w-9 h-9 object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div>
                    <h3 className="font-editorial text-lg font-semibold text-[var(--foreground)] group-hover:text-team transition-colors leading-tight">
                      {team.displayName}
                    </h3>
                    <p className="text-[11px] text-[var(--muted)] mt-0.5">
                      {team.location}
                    </p>
                  </div>
                </div>

                {/* Bottom: Pill Action (Image 4 Component 03: Continue ->) */}
                <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)] group-hover:text-team transition-colors">
                  <span className="text-[11px] font-medium">Select Franchise</span>
                  <span className="w-5 h-5 rounded-full bg-[var(--input)] flex items-center justify-center group-hover:bg-team group-hover:text-white transition-all shadow-2xs">
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
