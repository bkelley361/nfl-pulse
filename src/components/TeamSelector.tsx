"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NFL_TEAMS, type NFLTeam } from "@/data/teams";
import { getReadableDarkColor, hexToRgb } from "@/lib/colors";
import type { TeamDivisionStats, ScheduleGame, DivisionStandingsGroup } from "@/types";
import {
  Search,
  ArrowRight,
  SlidersHorizontal,
  Trophy,
  Calendar,
  LayoutGrid,
  Table as TableIcon,
} from "lucide-react";
import { SunburstIcon } from "@/components/icons/EditorialIcons";

interface TeamSelectorProps {
  standingsMap?: Record<string, TeamDivisionStats>;
  remainingSchedules?: Record<string, ScheduleGame[]>;
  divisions?: DivisionStandingsGroup[];
}

export default function TeamSelector({
  standingsMap = {},
  remainingSchedules = {},
  divisions = [],
}: TeamSelectorProps) {
  const [search, setSearch] = useState("");
  const [conferenceFilter, setConferenceFilter] = useState<"ALL" | "AFC" | "NFC">("ALL");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"cards" | "divisions">("cards");

  const filteredTeams = useMemo(() => {
    return NFL_TEAMS.filter((team) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        team.displayName.toLowerCase().includes(q) ||
        team.name.toLowerCase().includes(q) ||
        team.location.toLowerCase().includes(q) ||
        team.abbreviation.toLowerCase().includes(q);

      const matchesConf =
        conferenceFilter === "ALL" || team.conference === conferenceFilter;

      const matchesDiv =
        divisionFilter === "ALL" || team.division === divisionFilter;

      return matchesSearch && matchesConf && matchesDiv;
    });
  }, [search, conferenceFilter, divisionFilter]);

  const filteredDivisions = useMemo(() => {
    return divisions.filter((div) => {
      const matchesConf =
        conferenceFilter === "ALL" || div.conference === conferenceFilter;
      const matchesDiv =
        divisionFilter === "ALL" || div.division === divisionFilter;

      if (!matchesConf || !matchesDiv) return false;

      if (!search.trim()) return true;

      const q = search.toLowerCase().trim();
      return (
        div.name.toLowerCase().includes(q) ||
        div.teams.some(
          (t) =>
            t.displayName.toLowerCase().includes(q) ||
            t.abbreviation.toLowerCase().includes(q)
        )
      );
    });
  }, [divisions, conferenceFilter, divisionFilter, search]);

  const conferences = ["ALL", "AFC", "NFC"] as const;
  const divisionsList = ["ALL", "East", "North", "South", "West"];

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="calm-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Pill Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search franchise, city, code, or remaining opponent..."
              className="calm-input w-full pl-10 pr-10 py-2.5 text-xs placeholder:text-[var(--muted)] shadow-inner"
            />
            <SlidersHorizontal className="w-3.5 h-3.5 absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-light)] pointer-events-none" />
          </div>

          {/* View Mode Toggle: Cards vs Division Standings */}
          <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] shadow-inner self-start md:self-auto">
            <button
              onClick={() => setViewMode("cards")}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Franchise Cards</span>
            </button>
            <button
              onClick={() => setViewMode("divisions")}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "divisions"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Division Standings</span>
            </button>
          </div>
        </div>

        {/* Conference & Division Filter Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
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
              {divisionsList.map((div) => (
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

          <div className="text-xs text-[var(--muted)] font-mono">
            Showing {filteredTeams.length} franchises
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: Franchise Cards with Division Rank & Remaining Schedule */}
      {viewMode === "cards" && (
        <>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTeams.map((team) => {
                const stats = standingsMap[team.id];
                const remaining = remainingSchedules[team.id] || [];
                const rankText = stats ? `#${stats.rank} in ${team.division}` : `${team.division}`;

                const readableColor = getReadableDarkColor(team.color);
                const readableRgb = hexToRgb(readableColor);

                return (
                  <Link
                    key={team.id}
                    href={`/team/${team.slug}`}
                    className="group calm-card p-5 relative overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    style={
                      {
                        "--team-primary": team.color,
                        "--team-primary-readable": readableColor,
                        "--team-primary-readable-rgb": `${readableRgb.r}, ${readableRgb.g}, ${readableRgb.b}`,
                      } as React.CSSProperties
                    }
                  >
                    {/* Soft atmospheric glow */}
                    <div
                      className="absolute -right-10 -bottom-10 w-28 h-28 rounded-full blur-2xl opacity-12 group-hover:opacity-28 transition-opacity pointer-events-none"
                      style={{ backgroundColor: team.color }}
                    />

                    <div>
                      {/* Top Bar: Division Rank Badge & Abbr */}
                      <div className="flex items-center justify-between gap-2 mb-3.5">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-team-tint text-team border border-team-tint">
                          {rankText}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {stats && (
                            <span className="text-[11px] font-mono font-bold text-[var(--foreground)]">
                              {stats.wins}-{stats.losses}
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--input)] text-[var(--muted)] border border-[var(--border)]">
                            {team.abbreviation}
                          </span>
                        </div>
                      </div>

                      {/* Team Logo & Name */}
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
                            {team.location} • {team.conference}
                          </p>
                        </div>
                      </div>

                      {/* Remaining Schedule Slate (Show remaining games preview) */}
                      <div className="mt-4 pt-3 border-t border-[var(--border)]">
                        <div className="flex items-center justify-between text-[11px] text-[var(--muted)] mb-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[var(--muted)]" />
                            Remaining Slate
                          </span>
                          <span className="font-mono text-[10px] text-[var(--foreground)] font-semibold">
                            {remaining.length} games left
                          </span>
                        </div>

                        {remaining.length === 0 ? (
                          <div className="text-[11px] text-[var(--muted)] italic py-1">
                            Schedule completed
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {remaining.slice(0, 3).map((g) => (
                              <div
                                key={g.id}
                                className="px-2.5 py-1.5 rounded-lg bg-[var(--input)]/60 border border-[var(--border)] flex items-center justify-between text-[11px]"
                              >
                                <div className="flex items-center gap-1.5 truncate pr-2">
                                  <span className="font-semibold text-[var(--muted)]">
                                    {g.isHome ? "vs" : "@"}
                                  </span>
                                  <span className="font-medium text-[var(--foreground)] truncate">
                                    {g.opponent.abbreviation || g.opponent.name}
                                  </span>
                                </div>
                                <span className="font-mono text-[10px] text-[var(--muted)] flex-shrink-0">
                                  {g.shortDate}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--muted)] group-hover:text-team transition-colors">
                      <span className="text-[11px] font-medium">Open Team Pulse</span>
                      <span className="w-5 h-5 rounded-full bg-[var(--input)] flex items-center justify-center group-hover:bg-team group-hover:text-white transition-all shadow-2xs">
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: Division Standings & Remaining Slate Tables */}
      {viewMode === "divisions" && (
        <div className="space-y-6">
          {filteredDivisions.map((divGroup) => (
            <div key={divGroup.name} className="calm-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                <div className="flex items-center gap-2">
                  <SunburstIcon className="w-4 h-4 text-amber-500" />
                  <h3 className="font-editorial text-xl font-medium text-[var(--foreground)]">
                    {divGroup.name}
                  </h3>
                </div>
                <span className="text-xs text-[var(--muted)] font-mono">
                  {divGroup.conference} Division
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border)] text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
                      <th className="py-2.5 px-3">Rank</th>
                      <th className="py-2.5 px-3">Franchise</th>
                      <th className="py-2.5 px-2 text-center">Record</th>
                      <th className="py-2.5 px-2 text-center">Diff</th>
                      <th className="py-2.5 px-2 text-center">Streak</th>
                      <th className="py-2.5 px-3 text-left">Next Matchup</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {divGroup.teams.map((teamStat) => {
                      const remaining = remainingSchedules[teamStat.teamId] || [];
                      const nextMatch = remaining[0];

                      return (
                        <tr
                          key={teamStat.teamId}
                          className="hover:bg-[var(--input)]/40 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <span
                              className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-editorial font-bold text-xs ${
                                teamStat.rank === 1
                                  ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25"
                                  : "text-[var(--muted)]"
                              }`}
                            >
                              {teamStat.rank}
                            </span>
                          </td>

                          <td className="py-3 px-3">
                            <Link
                              href={`/team/${teamStat.slug}`}
                              className="inline-flex items-center gap-2.5 font-semibold text-[var(--foreground)] hover:underline"
                            >
                              <img
                                src={teamStat.logo}
                                alt={teamStat.displayName}
                                className="w-5 h-5 object-contain"
                              />
                              <span>{teamStat.displayName}</span>
                            </Link>
                          </td>

                          <td className="py-3 px-2 text-center font-editorial font-bold text-sm">
                            {teamStat.wins}-{teamStat.losses}
                          </td>

                          <td className="py-3 px-2 text-center font-mono text-xs">
                            <span
                              className={
                                teamStat.differential.startsWith("+")
                                  ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                                  : teamStat.differential.startsWith("-")
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-[var(--muted)]"
                              }
                            >
                              {teamStat.differential}
                            </span>
                          </td>

                          <td className="py-3 px-2 text-center font-mono text-xs font-semibold">
                            {teamStat.streak}
                          </td>

                          <td className="py-3 px-3">
                            {nextMatch ? (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-[var(--muted)] font-semibold">
                                  {nextMatch.isHome ? "vs" : "@"}
                                </span>
                                <span className="font-medium text-[var(--foreground)]">
                                  {nextMatch.opponent.displayName}
                                </span>
                                <span className="text-[10px] text-[var(--muted)] font-mono">
                                  ({nextMatch.shortDate})
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-[var(--muted)] italic">
                                Season Completed
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right">
                            <Link
                              href={`/team/${teamStat.slug}`}
                              className="px-3 py-1 rounded-full bg-[var(--input)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition-colors inline-flex items-center gap-1 cursor-pointer"
                            >
                              <span>View</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
