"use client";

import { useState, useMemo } from "react";
import type { ScheduleGame } from "@/types";
import { Calendar, CheckCircle2, Clock, MapPin, Tv, Trophy } from "lucide-react";

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
    if (filter === "UPCOMING") {
      return games.filter((g) => !g.completed);
    }
    if (filter === "COMPLETED") {
      return games.filter((g) => g.completed);
    }
    return games;
  }, [games, filter]);

  const completedCount = games.filter((g) => g.completed).length;
  const upcomingCount = games.filter((g) => !g.completed).length;

  return (
    <div className="space-y-4">
      {/* Schedule Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            2026 Schedule & Results
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 18-week regular season slate with live scores and game times.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "ALL"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({games.length})
          </button>
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "UPCOMING"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Upcoming ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter("COMPLETED")}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "COMPLETED"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Results ({completedCount})
          </button>
        </div>
      </div>

      {/* Games List */}
      {filteredGames.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
          No games found for this filter.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredGames.map((game) => {
            const isCompleted = game.completed;
            const isWin = game.isWin;
            const isTie = game.isTie;

            return (
              <div
                key={game.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all duration-150 ${
                  game.isLive
                    ? "bg-blue-950/20 border-blue-500/50 shadow-md shadow-blue-500/10"
                    : isCompleted
                    ? "bg-slate-900/50 border-slate-800/80 hover:bg-slate-900/80"
                    : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Left: Week & Opponent */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Week Badge */}
                  <div className="w-16 flex-shrink-0 text-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      {game.week.replace("Regular Season ", "")}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      {game.shortDate.split(",")[0]}
                    </span>
                  </div>

                  {/* Divider line */}
                  <div className="w-px h-8 bg-slate-800 flex-shrink-0 hidden sm:block" />

                  {/* Opponent Logo & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-slate-800/70 p-1 flex items-center justify-center flex-shrink-0 border border-slate-700/60">
                      <img
                        src={game.opponent.logo}
                        alt={game.opponent.displayName}
                        className="w-7 h-7 object-contain"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400">
                          {game.isHome ? "vs" : "@"}
                        </span>
                        <span className="font-bold text-sm text-slate-100 truncate">
                          {game.opponent.displayName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 truncate">
                        <span>{game.venue?.fullName || "Stadium"}</span>
                        {game.broadcast && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-medium flex items-center gap-0.5">
                              <Tv className="w-2.5 h-2.5" />
                              {game.broadcast}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Score or Schedule Status */}
                <div className="mt-3 sm:mt-0 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  {game.isLive ? (
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-xs font-bold text-red-400 uppercase">Live</span>
                      <div className="font-mono font-bold text-base text-white ml-1">
                        {game.teamScore} - {game.opponentScore}
                      </div>
                    </div>
                  ) : isCompleted ? (
                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <div className="font-mono font-bold text-sm text-slate-200">
                          {game.teamScore} - {game.opponentScore}
                        </div>
                        <div className="text-[10px] text-slate-400">Final</div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider ${
                          isWin
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : isTie
                            ? "bg-slate-700 text-slate-300"
                            : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {isWin ? "W" : isTie ? "T" : "L"}
                      </span>
                    </div>
                  ) : (
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-semibold text-slate-200">
                        {game.statusDetail}
                      </div>
                      <div className="text-[10px] text-slate-400">
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
