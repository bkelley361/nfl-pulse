"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import type { DivisionStandingsGroup, TeamDivisionStats } from "@/types";
import { ArrowRight, Trophy } from "lucide-react";
import { SunburstIcon, DivisionRankIcon } from "@/components/icons/EditorialIcons";

interface DivisionStandingsProps {
  division: DivisionStandingsGroup;
  currentTeamId?: string;
  teamColor?: string;
  conferenceTeams?: TeamDivisionStats[];
}

export default function DivisionStandings({
  division,
  currentTeamId,
  teamColor,
  conferenceTeams = [],
}: DivisionStandingsProps) {
  const [viewMode, setViewMode] = useState<"division" | "conference">("division");

  // Sort conference teams by official playoff seeding
  const sortedConferenceTeams = useMemo(() => {
    if (!conferenceTeams || conferenceTeams.length === 0) return [];
    return [...conferenceTeams].sort((a, b) => {
      const seedA = a.seed ? parseInt(a.seed) : 99;
      const seedB = b.seed ? parseInt(b.seed) : 99;
      if (seedA !== seedB) return seedA - seedB;
      if (b.winPct !== a.winPct) return b.winPct - a.winPct;
      return parseInt(b.differential) - parseInt(a.differential);
    });
  }, [conferenceTeams]);

  const activeTeams = viewMode === "division" ? division.teams : sortedConferenceTeams;

  return (
    <div className="space-y-4">
      {/* Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <SunburstIcon className="w-4 h-4 text-team" />
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              {viewMode === "division" ? `${division.name} Standings` : `${division.conference} Playoff Picture`}
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            {viewMode === "division"
              ? "Official 2026 divisional race, tiebreakers, point differentials, and streaks."
              : `Full 16-team ${division.conference} playoff seeding with top 7 advance cutline.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {conferenceTeams.length > 0 && (
            <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] shadow-inner text-xs">
              <button
                onClick={() => setViewMode("division")}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  viewMode === "division"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Divisional Pod (4)
              </button>
              <button
                onClick={() => setViewMode("conference")}
                className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                  viewMode === "conference"
                    ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {division.conference} Playoff Seeding (16)
              </button>
            </div>
          )}

          <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-[var(--input)] border border-[var(--border)] text-[var(--muted)] flex items-center gap-1">
            <span>Scroll</span>
            <ArrowRight className="w-2.5 h-2.5 text-team" />
          </span>
        </div>
      </div>

      {/* Standings Table - Smooth horizontal scroll with full detailed stats */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xs overflow-x-auto overscroll-x-contain scroll-table pb-1.5">
        <table className="w-full text-left text-xs min-w-[880px]">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--input)]/60 text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
              <th className="py-3 px-3 w-12 text-center">
                {viewMode === "conference" ? "Seed" : "#"}
              </th>
              <th className="py-3 px-4 min-w-[190px]">Franchise</th>
              <th className="py-3 px-2 text-center min-w-[68px]">W-L</th>
              <th className="py-3 px-2 text-center min-w-[60px]">Win%</th>
              <th className="py-3 px-2 text-center min-w-[50px]">GB</th>
              <th className="py-3 px-2 text-center min-w-[55px]">Div</th>
              <th className="py-3 px-2 text-center min-w-[55px]">Conf</th>
              <th className="py-3 px-2 text-center min-w-[55px]">PF</th>
              <th className="py-3 px-2 text-center min-w-[55px]">PA</th>
              <th className="py-3 px-2 text-center min-w-[55px]">Diff</th>
              <th className="py-3 px-2 text-center min-w-[55px]">Home</th>
              <th className="py-3 px-2 text-center min-w-[55px]">Road</th>
              <th className="py-3 px-3 text-center min-w-[75px]">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {activeTeams.map((t, index) => {
              const isSelected = t.teamId === currentTeamId;
              const isDiffPositive = t.differential.startsWith("+") && t.differential !== "+0";
              const seedNum = t.seed ? parseInt(t.seed) : index + 1;

              return (
                <React.Fragment key={t.teamId}>
                  {/* Playoff Cutline divider between Seed #7 and Seed #8 */}
                  {viewMode === "conference" && index === 7 && (
                    <tr className="bg-[var(--input)]/70 border-y-2 border-amber-500/30">
                      <td colSpan={13} className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-px bg-amber-500/50 flex-1" />
                          <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-amber-600 dark:text-amber-400">
                            ▲ TOP 7 TEAMS ADVANCE TO POSTSEASON • PLAYOFF CUTLINE ▼
                          </span>
                          <div className="h-px bg-amber-500/50 flex-1" />
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr
                    className={`transition-colors duration-150 ${
                      isSelected
                        ? "bg-team-tint font-semibold"
                        : "hover:bg-[var(--input)]/50"
                    }`}
                  >
                    {/* Rank / Seed */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-editorial font-bold text-xs ${
                          (viewMode === "division" && t.rank === 1) || (viewMode === "conference" && seedNum === 1)
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : viewMode === "conference" && seedNum <= 7
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
                            : "text-[var(--muted)]"
                        }`}
                      >
                        {viewMode === "conference" ? `#${seedNum}` : t.rank}
                      </span>
                    </td>

                    {/* Team */}
                    <td className="py-3 px-4">
                      <Link
                        href={`/team/${t.slug}`}
                        className="inline-flex items-center gap-2.5 group truncate max-w-full"
                      >
                        <div className="w-7 h-7 rounded-lg bg-[var(--input)] p-1 flex items-center justify-center flex-shrink-0 border border-[var(--border)] group-hover:scale-105 transition-transform">
                          <img
                            src={t.logo}
                            alt={t.displayName}
                            className="w-5 h-5 object-contain"
                          />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-[var(--foreground)] group-hover:text-team transition-colors flex items-center gap-1.5 truncate">
                            <span className="truncate">{t.displayName}</span>
                            {viewMode === "conference" ? (
                              <span
                                className={`text-[9px] font-mono px-1 rounded border flex-shrink-0 ${
                                  seedNum === 1
                                    ? "bg-amber-500/10 text-amber-600 border-amber-500/30 font-bold"
                                    : seedNum <= 4
                                    ? "bg-team-tint text-team border-team-tint font-bold"
                                    : seedNum <= 7
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : "bg-[var(--input)] text-[var(--muted)] border-[var(--border)]"
                                }`}
                              >
                                {seedNum === 1
                                  ? "1st Bye"
                                  : seedNum <= 4
                                  ? "Div Champ"
                                  : seedNum <= 7
                                  ? "Wild Card"
                                  : "Hunt"}
                              </span>
                            ) : (
                              t.seed && (
                                <span className="text-[9px] font-mono px-1 rounded bg-[var(--input)] border border-[var(--border)] text-[var(--muted)] flex-shrink-0">
                                  #{t.seed}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </Link>
                    </td>

                    {/* W-L */}
                    <td className="py-3 px-2 text-center font-editorial text-sm font-bold text-[var(--foreground)]">
                      {t.wins}-{t.losses}{t.ties > 0 ? `-${t.ties}` : ""}
                    </td>

                    {/* Win% */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.winPct.toFixed(3).replace("0.", ".")}
                    </td>

                    {/* GB */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.gamesBehind}
                    </td>

                    {/* Div */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.divRecord}
                    </td>

                    {/* Conf */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.confRecord}
                    </td>

                    {/* PF */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--foreground)]">
                      {t.pointsFor}
                    </td>

                    {/* PA */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.pointsAgainst}
                    </td>

                    {/* Differential */}
                    <td className="py-3 px-2 text-center font-mono text-xs font-semibold">
                      <span
                        className={
                          isDiffPositive
                            ? "text-emerald-600 dark:text-emerald-400"
                            : t.differential.startsWith("-")
                            ? "text-rose-600 dark:text-rose-400"
                            : "text-[var(--muted)]"
                        }
                      >
                        {t.differential}
                      </span>
                    </td>

                    {/* Home */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.homeRecord}
                    </td>

                    {/* Road */}
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--muted)]">
                      {t.roadRecord}
                    </td>

                    {/* Streak */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.streak.startsWith("W")
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25"
                            : t.streak.startsWith("L")
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25"
                            : "bg-[var(--input)] text-[var(--muted)]"
                        }`}
                      >
                        {t.streak}
                      </span>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
