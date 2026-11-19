"use client";

import React, { useState, useEffect } from "react";
import type { MatchupPredictorData, ScheduleGame } from "@/types";
import { Tv, MapPin, Calendar, Clock } from "lucide-react";
import { SunburstIcon, EditorialPulse } from "@/components/icons/EditorialIcons";

interface MatchupPredictorProps {
  matchup: MatchupPredictorData | null;
  nextGame?: ScheduleGame;
  teamColor: string;
}

// Determines if venue is an indoor/climate-controlled dome or open-air stadium
function getStadiumInfo(venueName: string = ""): { isDome: boolean; label: string } {
  const v = venueName.toLowerCase();
  const domeKeywords = [
    "ford field",
    "superdome",
    "u.s. bank",
    "mercedes-benz",
    "at&t stadium",
    "nrg stadium",
    "lucas oil",
    "state farm stadium",
    "allegiant",
    "sofi",
    "dome",
  ];
  const isDome = domeKeywords.some((k) => v.includes(k));
  return {
    isDome,
    label: isDome ? "Indoor Dome • Controlled" : "Open-Air Outdoor Stadium",
  };
}

// Dynamic real-time kickoff countdown
function useCountdown(targetIsoDate?: string) {
  const [status, setStatus] = useState<{ text: string; isLive: boolean }>({
    text: "Scheduled",
    isLive: false,
  });

  useEffect(() => {
    if (!targetIsoDate) return;

    function update() {
      const target = new Date(targetIsoDate!).getTime();
      if (isNaN(target)) return;

      const now = Date.now();
      const diff = target - now;

      // If game started within the last 3.5 hours, consider live
      if (diff <= 0 && diff > -3.5 * 60 * 60 * 1000) {
        setStatus({ text: "LIVE NOW", isLive: true });
        return;
      }
      if (diff <= -3.5 * 60 * 60 * 1000) {
        setStatus({ text: "Final Score", isLive: false });
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const days = Math.floor(totalSec / (3600 * 24));
      const hours = Math.floor((totalSec % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);

      if (days > 0) {
        setStatus({ text: `Kickoff in ${days}d ${hours}h`, isLive: false });
      } else if (hours > 0) {
        setStatus({ text: `Kickoff in ${hours}h ${minutes}m`, isLive: false });
      } else if (minutes > 0) {
        setStatus({ text: `Kickoff in ${minutes}m`, isLive: false });
      } else {
        setStatus({ text: "Kickoff Imminent", isLive: false });
      }
    }

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [targetIsoDate]);

  return status;
}

export default function MatchupPredictor({
  matchup,
  nextGame,
  teamColor,
}: MatchupPredictorProps) {
  const gameDate = matchup?.gameDate || nextGame?.date;
  const countdown = useCountdown(gameDate);

  if (!matchup && !nextGame) {
    return (
      <div className="calm-card p-8 text-center">
        <p className="text-[var(--muted)] text-sm font-sans">No upcoming matchup scheduled.</p>
      </div>
    );
  }

  if (matchup) {
    const { team, opponent, weekText, venueName, broadcast, overUnder, spreadDetails } = matchup;

    const teamWinProj = team.winProjection ?? 50;
    const oppWinProj = opponent.winProjection ?? 50;
    const teamIsFavored = teamWinProj >= oppWinProj;
    const favoredMargin = Math.abs(teamWinProj - oppWinProj).toFixed(1);
    const hasBettingOdds = matchup.hasOdds && (team.impliedWinPct !== undefined || team.moneyline !== undefined);
    const stadium = getStadiumInfo(venueName);

    const formattedDate = nextGame?.shortDate || (matchup.gameDate
      ? new Date(matchup.gameDate).toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : "Upcoming");

    return (
      <div className="calm-card p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle background ambient gradient */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-12 pointer-events-none"
          style={{ backgroundColor: team.color }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: opponent.color }}
        />

        {/* Top Matchup Header with Live Countdown & Stadium Environment */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-team-tint text-team border border-team-tint">
              Next Matchup • {weekText}
            </span>

            {/* Countdown Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold border ${
                countdown.isLive
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse"
                  : "bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]"
              }`}
            >
              {countdown.isLive ? (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              ) : (
                <Clock className="w-3 h-3 text-[var(--muted)]" />
              )}
              <span>{countdown.text}</span>
            </span>

            {broadcast && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--input)] border border-[var(--border)] text-[11px] font-semibold text-[var(--foreground)]">
                <Tv className="w-3 h-3 text-amber-500" />
                {broadcast}
              </span>
            )}
          </div>

          {/* Date & Stadium Environment Badge */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span>{formattedDate}</span>
            </div>
            {venueName && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-[11px] font-medium">
                <MapPin className="w-3 h-3 text-[var(--muted)]" />
                <span className="truncate max-w-[170px]">{venueName}</span>
                <span className="text-[var(--border)]">•</span>
                <span className="text-[10px] text-[var(--muted)]">{stadium.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Head-to-Head Spotlight */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Selected Team Profile */}
          <div className="md:col-span-4 flex items-center gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2.5 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-md flex-shrink-0"
              style={{
                boxShadow: `0 8px 24px -6px ${team.color}35`,
              }}
            >
              <img
                src={team.logo}
                alt={team.displayName}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {matchup.isHome ? "Home" : "Away"}
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">
                {team.displayName}
              </h2>
              {team.record && (
                <div className="text-xs text-[var(--muted)] mt-0.5 font-medium">
                  Record: <strong className="text-[var(--foreground)]">{team.record}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Center Win Probability Split Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center px-2">
            <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-[10px] font-semibold text-[var(--muted)] mb-2">
              <SunburstIcon className="w-3 h-3 text-amber-500" />
              <span>
                {teamIsFavored ? team.name : opponent.name} Favored (+{favoredMargin}%)
              </span>
            </div>

            {/* Large Win Probability Comparison */}
            <div className="flex items-baseline justify-between w-full px-1 mb-1.5">
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-team">
                {teamWinProj}%
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--muted)]">
                ESPN FPI Win Probability
              </span>
              <span className="font-editorial text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                {oppWinProj}%
              </span>
            </div>

            {/* Visual Head-to-Head Bar */}
            <div className="w-full h-3 rounded-full bg-[var(--border)] p-0.5 overflow-hidden flex shadow-inner">
              <div
                className="h-full rounded-l-full transition-all duration-700 ease-out"
                style={{
                  width: `${teamWinProj}%`,
                  backgroundColor: team.color,
                }}
              />
              <div
                className="h-full rounded-r-full transition-all duration-700 ease-out"
                style={{
                  width: `${oppWinProj}%`,
                  backgroundColor: opponent.color,
                }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-[10px] text-[var(--muted)] font-semibold mt-1.5 px-1">
              <span>{team.shortDisplayName || team.name}</span>
              <span>{opponent.shortDisplayName || opponent.name}</span>
            </div>
          </div>

          {/* Opponent Profile */}
          <div className="md:col-span-4 flex items-center justify-end gap-4 text-right">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {!matchup.isHome ? "Home" : "Away"}
              </div>
              <h2 className="font-editorial text-xl sm:text-2xl font-bold text-[var(--foreground)] leading-tight">
                {opponent.displayName}
              </h2>
              {opponent.record && (
                <div className="text-xs text-[var(--muted)] mt-0.5 font-medium">
                  Record: <strong className="text-[var(--foreground)]">{opponent.record}</strong>
                </div>
              )}
            </div>
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2.5 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-md flex-shrink-0"
              style={{
                boxShadow: `0 8px 24px -6px ${opponent.color}35`,
              }}
            >
              <img
                src={opponent.logo}
                alt={opponent.displayName}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            </div>
          </div>
        </div>

        {/* Vegas Betting & Market Consensus Drawer */}
        {hasBettingOdds && (
          <div className="mt-5 pt-4 border-t border-[var(--border)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {spreadDetails && (
              <div className="p-3 rounded-xl bg-[var(--input)]/60 border border-[var(--border)] text-center">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                  Consensus Spread
                </span>
                <span className="font-editorial text-base font-semibold text-[var(--foreground)] mt-0.5 block">
                  {spreadDetails}
                </span>
              </div>
            )}

            {overUnder && (
              <div className="p-3 rounded-xl bg-[var(--input)]/60 border border-[var(--border)] text-center">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                  Total (O/U)
                </span>
                <span className="font-editorial text-base font-semibold text-[var(--foreground)] mt-0.5 block">
                  {overUnder} pts
                </span>
              </div>
            )}

            {team.moneyline !== undefined && (
              <div className="p-3 rounded-xl bg-[var(--input)]/60 border border-[var(--border)] text-center">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                  {team.shortDisplayName || team.name} Moneyline
                </span>
                <span className="font-editorial text-base font-semibold text-[var(--foreground)] mt-0.5 block">
                  {team.moneyline > 0 ? `+${team.moneyline}` : team.moneyline}
                </span>
              </div>
            )}

            {team.impliedWinPct !== undefined && (
              <div className="p-3 rounded-xl bg-[var(--input)]/60 border border-[var(--border)] text-center">
                <span className="text-[10px] font-mono text-[var(--muted)] uppercase tracking-wider block">
                  Implied Odds (Vig-Free)
                </span>
                <span className="font-editorial text-base font-semibold text-[var(--foreground)] mt-0.5 block">
                  {team.impliedWinPct}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return null;
}
