"use client";

import { useState, useMemo } from "react";
import type { ScheduleGame } from "@/types";
import { Calendar, Tv, Clock } from "lucide-react";

interface ScheduleViewProps {
  games: ScheduleGame[];
  teamDisplayName: string;
  teamAbbr: string;
  teamColor: string;
}

export default function ScheduleView({
  games,
  teamDisplayName,
  teamAbbr,
  teamColor,
}: ScheduleViewProps) {
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED">("ALL");

  const filteredGames = useMemo(() => {
    if (filter === "UPCOMING") return games.filter((g) => !g.completed);
    if (filter === "COMPLETED") return games.filter((g) => g.completed);
    return games;
  }, [games, filter]);

  const completedCount = games.filter((g) => g.completed).length;
  const upcomingCount = games.filter((g) => !g.completed).length;

  return (
    <div className="space-y-5">
      {/* Header & Segmented Pill Tabs (Image 4 Component 07) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-editorial text-xs font-semibold text-[var(--muted)]">01</span>
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              2026 Schedule & Results
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            18-week regular season slate with final scores and kickoff details.
          </p>
        </div>

        {/* Soft Segmented Control Pill Container (Image 4) */}
        <div className="inline-flex rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All ({games.length})
          </button>
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "UPCOMING"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              filter === "COMPLETED"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Results ({completedCount})
          </button>
        </div>
      </div>

      {/* Games List with Calm Editorial Cards */}
      {filteredGames.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[var(--input)]/50 border border-[var(--border)] text-[var(--muted)] text-xs">
          No games found for this filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredGames.map((game, index) => {
            const isCompleted = game.completed;
            const isWin = game.isWin;
            const isTie = game.isTie;
            const weekNumberStr = String(game.weekNumber || index + 1).padStart(2, "0");

            return (
              <div
                key={game.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  game.isLive
                    ? "bg-[var(--card)] border-red-500/50 shadow-md"
                    : isCompleted
                    ? "bg-[var(--card)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs"
                }`}
              >
                {/* Left: Week Prefix & Opponent */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Numbered Week Prefix (Inspired by Image 1 & 4) */}
                  <div className="w-12 flex-shrink-0 text-left">
                    <span className="font-editorial text-sm font-semibold text-[var(--muted)] block">
                      {weekNumberStr}
                    </span>
                    <span className="text-[10px] text-[var(--muted-light)] font-mono block">
                      {game.shortDate.split(",")[0]}
                    </span>
                  </div>

                  <div className="w-px h-7 bg-[var(--border)] flex-shrink-0" />

                  {/* Opponent Logo & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[var(--input)] p-1.5 flex items-center justify-center flex-shrink-0 border border-[var(--border)]">
                      <img
                        src={game.opponent.logo}
                        alt={game.opponent.displayName}
                        className="w-6 h-6 object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[var(--muted)]">
                          {game.isHome ? "vs" : "@"}
                        </span>
                        <span className="font-medium text-xs sm:text-sm text-[var(--foreground)] truncate">
                          {game.opponent.displayName}
                        </span>
                      </div>
                      <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 mt-0.5 truncate">
                        <span>{game.venue?.fullName || "Stadium"}</span>
                        {game.broadcast && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                              <Tv className="w-2.5 h-2.5" />
                              {game.broadcast}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Scores or Schedule Status */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--border)]">
                  {game.isLive ? (
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold text-red-500 uppercase">Live</span>
                      <div className="font-editorial font-bold text-base text-[var(--foreground)] ml-1">
                        {game.teamScore} - {game.opponentScore}
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-editorial font-bold text-sm text-[var(--foreground)]">
                          {game.teamScore} - {game.opponentScore}
                        </div>
                        <div className="text-[10px] text-[var(--muted)]">Final</div>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isWin
                            ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25"
                            : isTie
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            : "bg-rose-500/12 text-rose-700 dark:text-rose-400 border border-rose-500/25"
                        }`}
                      >
                        {isWin ? "Win" : isTie ? "Tie" : "Loss"}
                      </span>
                    </div>
                  ) : (
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-semibold text-[var(--foreground)]">
                        {game.statusDetail}
                      </div>
                      <div className="text-[10px] text-[var(--muted)]">
                        {game.shortDate}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
