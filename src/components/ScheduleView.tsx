"use client";

import { useState, useMemo } from "react";
import type { ScheduleGame } from "@/types";
import { Tv, Clock, CalendarPlus } from "lucide-react";
import { SunburstIcon } from "@/components/icons/EditorialIcons";
import { downloadTeamICS, getGoogleCalendarLink } from "@/lib/calendar";

interface ScheduleViewProps {
  games: ScheduleGame[];
  teamDisplayName: string;
  teamAbbr: string;
  teamColor: string;
}

// Detects Thursday Night Football short rest or Bye week rest advantage
function getRestBadge(game: ScheduleGame, prevGame?: ScheduleGame) {
  if (game.completed) return null;
  const d = new Date(game.date);
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  if (dayName === "Thu") {
    return { label: "Short Rest (TNF)", type: "short" as const };
  }
  if (prevGame) {
    const prevD = new Date(prevGame.date);
    const diffDays = Math.round((d.getTime() - prevD.getTime()) / (1000 * 3600 * 24));
    if (diffDays >= 12) {
      return { label: "Coming off Bye Week", type: "bye" as const };
    }
  }
  if (dayName === "Mon") {
    return { label: "Extended Prep (MNF)", type: "normal" as const };
  }
  return null;
}

export default function ScheduleView({
  games,
  teamDisplayName,
  teamAbbr,
  teamColor,
}: ScheduleViewProps) {
  // Default to "UPCOMING"
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "COMPLETED">("UPCOMING");

  const filteredGames = useMemo(() => {
    if (filter === "UPCOMING") return games.filter((g) => !g.completed);
    if (filter === "COMPLETED") return games.filter((g) => g.completed);
    return games;
  }, [games, filter]);

  const completedCount = games.filter((g) => g.completed).length;
  const upcomingCount = games.filter((g) => !g.completed).length;

  const formatGameTime = (game: ScheduleGame) => {
    if (game.statusDetail && game.statusDetail.includes(" - ")) {
      return game.statusDetail.split(" - ")[1];
    }
    const d = new Date(game.date);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });
    }
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Header & Fixed Pill Tabs (Amounts stay strictly inline, never underneath) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <SunburstIcon className="w-4 h-4 text-team" />
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              2026 Schedule & Win Probabilities
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Full 18-week slate featuring date, kickoff time, and computer win probabilities for every matchup.
          </p>
        </div>

        {/* Tactile Segmented Control Pill Container (Strictly inline numbers) */}
        <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner">
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === "UPCOMING"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>Upcoming</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {upcomingCount}
            </span>
          </button>

          <button
            onClick={() => setFilter("COMPLETED")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === "COMPLETED"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>Results</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {completedCount}
            </span>
          </button>

          <button
            onClick={() => setFilter("ALL")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>All</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {games.length}
            </span>
          </button>
        </div>
      </div>

      {/* Sub-bar: Matchup counter & 1-Click Calendar Sync */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <span className="text-xs text-[var(--muted)] font-mono">
          Showing <strong>{filteredGames.length}</strong> matchups
        </span>
        <button
          onClick={() => downloadTeamICS(teamDisplayName, games)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[var(--input)] hover:bg-[var(--card)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] hover:border-slate-400 transition-all cursor-pointer shadow-2xs group"
          title="Download .ics file to sync with Apple, Google, or Outlook Calendar"
        >
          <CalendarPlus className="w-3.5 h-3.5 text-team group-hover:scale-110 transition-transform" />
          <span>Add Schedule to Calendar (.ics)</span>
        </button>
      </div>

      {/* Games List */}
      {filteredGames.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-[var(--input)]/50 border border-[var(--border)] text-[var(--muted)] text-xs">
          No games found for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGames.map((game, index) => {
            const isCompleted = game.completed;
            const isWin = game.isWin;
            const isTie = game.isTie;
            const weekNumberStr = `Week ${game.weekNumber || index + 1}`;
            const gameTimeStr = formatGameTime(game);
            const prob = game.winProbability ?? 50;
            const prevGame = index > 0 ? filteredGames[index - 1] : undefined;
            const restBadge = getRestBadge(game, prevGame);

            const d = new Date(game.date);
            const dateStr = !isNaN(d.getTime())
              ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
              : game.shortDate;

            return (
              <div
                key={game.id}
                className={`p-4 sm:p-4.5 rounded-2xl border transition-all duration-150 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  game.isLive
                    ? "bg-[var(--card)] border-red-500/50 shadow-md"
                    : isCompleted
                    ? "bg-[var(--card)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600"
                    : "bg-[var(--card)] border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600 shadow-2xs"
                }`}
              >
                {/* Left Side: Week Number + Date & Kickoff Time on the Side */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Side Box: Week Number, Date, and Kickoff Time */}
                  <div className="w-36 sm:w-40 flex-shrink-0 text-left pr-2">
                    <span className="font-editorial text-sm font-bold text-[var(--foreground)] block">
                      {weekNumberStr}
                    </span>
                    <span className="text-xs font-semibold text-[var(--foreground)] mt-0.5 block truncate">
                      {dateStr}
                    </span>
                    {gameTimeStr && !isCompleted && !game.isLive && (
                      <span className="text-[11px] font-mono font-medium text-team mt-0.5 block flex items-center gap-1 truncate">
                        <Clock className="w-3 h-3 text-[var(--muted)] flex-shrink-0" />
                        {gameTimeStr}
                      </span>
                    )}
                    {isCompleted && (
                      <span className="text-[10px] uppercase font-bold text-[var(--muted)] mt-0.5 block">
                        Final
                      </span>
                    )}
                  </div>

                  <div className="w-px h-10 bg-[var(--border)] flex-shrink-0" />

                  {/* Opponent Logo & Matchup Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[var(--input)] p-1.5 flex items-center justify-center flex-shrink-0 border border-[var(--border)] shadow-xs">
                      <img
                        src={game.opponent.logo}
                        alt={game.opponent.displayName}
                        className="w-7 h-7 object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[var(--muted)]">
                          {game.isHome ? "vs" : "@"}
                        </span>
                        <span className="font-semibold text-sm text-[var(--foreground)] truncate">
                          {game.opponent.displayName}
                        </span>
                        {game.opponent.record && (
                          <span className="text-[11px] text-[var(--muted)] font-mono">
                            ({game.opponent.record})
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--muted)] flex items-center gap-2 mt-0.5 truncate">
                        <span>{game.venue?.fullName || "Stadium"}</span>
                        {game.broadcast && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Tv className="w-2.5 h-2.5" />
                              {game.broadcast}
                            </span>
                          </>
                        )}
                        {restBadge && (
                          <>
                            <span>•</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                                restBadge.type === "short"
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25"
                              }`}
                            >
                              {restBadge.label}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Win Probability / Scores */}
                <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[var(--border)]">
                  {/* Win Probability Bar for every upcoming matchup */}
                  {!isCompleted && !game.isLive && (
                    <div className="flex items-center gap-3 pr-1">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
                          Win Prob
                        </div>
                        <div className="font-editorial text-sm font-bold text-[var(--foreground)]">
                          {prob}%
                        </div>
                      </div>
                      {/* Mini visual gauge */}
                      <div className="w-16 h-2 rounded-full bg-[var(--border)] overflow-hidden shadow-inner flex">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${prob}%`,
                            backgroundColor: teamColor,
                          }}
                        />
                      </div>
                      <a
                        href={getGoogleCalendarLink(game, teamDisplayName)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg bg-[var(--input)] hover:bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:text-team transition-colors shadow-2xs"
                        title="Add this game to Google Calendar"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Score or Status */}
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
                        className={`px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isWin
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25"
                            : isTie
                            ? "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            : "bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/25"
                        }`}
                      >
                        {isWin ? "Win" : isTie ? "Tie" : "Loss"}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
