import React from "react";
import type { MatchupPredictorData, ScheduleGame } from "@/types";
import WinProbabilityWave from "./WinProbabilityWave";
import { TrendingUp, Tv, MapPin, Calendar, Award, ArrowUpRight } from "lucide-react";

interface MatchupPredictorProps {
  matchup: MatchupPredictorData | null;
  nextGame?: ScheduleGame;
  teamColor: string;
}

export default function MatchupPredictor({
  matchup,
  nextGame,
  teamColor,
}: MatchupPredictorProps) {
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
    const hasBettingOdds = matchup.hasOdds && (team.impliedWinPct !== undefined || team.moneyline !== undefined);

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
      <div className="calm-card p-6 sm:p-9 relative overflow-hidden">
        {/* Soft atmospheric gradient in the team's primary color */}
        <div
          className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl opacity-12 pointer-events-none"
          style={{ backgroundColor: team.color }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: opponent.color }}
        />

        {/* Section 01: Next Matchup Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="font-editorial text-xs font-semibold text-[var(--muted)]">
              01
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-[var(--foreground)]">
              Next Matchup • {weekText}
            </span>
            {broadcast && (
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-[11px] font-semibold text-[var(--foreground)]">
                <Tv className="w-3 h-3 text-amber-500" />
                {broadcast}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            {venueName && (
              <div className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[200px]">{venueName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Matchup Spotlight */}
        <div className="my-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Selected Team Profile (Left 5 cols) */}
          <div className="md:col-span-5 flex items-center gap-4">
            <div
              className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-3 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-xs flex-shrink-0"
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
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {matchup.isHome ? "Home" : "Away"}
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[var(--foreground)] leading-tight">
                {team.displayName}
              </h2>
              {team.record && (
                <div className="text-xs text-[var(--muted)] mt-0.5 font-medium">
                  2026 Record: <strong className="text-[var(--foreground)]">{team.record}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Center VS pill badge (2 cols) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-[var(--input)] border border-[var(--border)] flex items-center justify-center text-xs font-bold text-[var(--muted)] font-mono shadow-inner">
              VS
            </div>
          </div>

          {/* Opponent Profile (Right 5 cols) */}
          <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-4 text-left md:text-right">
            <div className="order-2 md:order-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                {!matchup.isHome ? "Home" : "Away"}
              </div>
              <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[var(--foreground)] leading-tight">
                {opponent.displayName}
              </h2>
              {opponent.record && (
                <div className="text-xs text-[var(--muted)] mt-0.5 font-medium">
                  Record: <strong className="text-[var(--foreground)]">{opponent.record}</strong>
                </div>
              )}
            </div>
            <div
              className="order-1 md:order-2 w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-3 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-xs flex-shrink-0"
              style={{
                boxShadow: `0 8px 24px -6px ${opponent.color}25`,
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

        {/* Section 02: Organic Wave Visualization (from Image 1 & 2) */}
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-editorial text-xs font-semibold text-[var(--muted)]">02</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                ESPN FPI Win Probability Model
              </span>
            </div>
            <div className="text-xs text-[var(--muted)] font-sans">
              Model favors:{" "}
              <strong className="text-[var(--foreground)]">
                {teamIsFavored ? team.name : opponent.name} (
                {Math.max(teamWinProj, oppWinProj)}%)
              </strong>
            </div>
          </div>

          {/* Wave Area Chart */}
          <div className="rounded-2xl bg-[var(--input)]/60 border border-[var(--border)] p-4 sm:p-5">
            <WinProbabilityWave
              teamName={team.name}
              oppName={opponent.name}
              teamPct={teamWinProj}
              oppPct={oppWinProj}
              teamColor={team.color}
              oppColor={opponent.color}
            />

            {/* Tactile Progress Bar (Image 4 Component 06) */}
            <div className="mt-4 pt-3 border-t border-[var(--border)]/70">
              <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground)] mb-2">
                <span>{team.displayName}</span>
                <span className="font-editorial text-base font-bold">{teamWinProj}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--border)] p-0.5 overflow-hidden flex shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${teamWinProj}%`,
                    backgroundColor: team.color,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 03: Market Consensus & Betting Odds (Image 4 card style) */}
        {hasBettingOdds && (
          <div className="mt-6 pt-6 border-t border-[var(--border)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-editorial text-xs font-semibold text-[var(--muted)]">03</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
                Market Consensus & Implied Probabilities
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Point Spread
                </div>
                <div className="font-editorial text-xl font-bold text-[var(--foreground)] mt-1">
                  {spreadDetails || team.spread || "PK"}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Consensus line</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Over / Under
                </div>
                <div className="font-editorial text-xl font-bold text-[var(--foreground)] mt-1">
                  {overUnder ? `${overUnder} pts` : "--"}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Game total</div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Moneyline
                </div>
                <div className="font-editorial text-xl font-bold text-[var(--foreground)] mt-1">
                  {team.moneyline ? (team.moneyline > 0 ? `+${team.moneyline}` : team.moneyline) : "--"}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">
                  Opp: {opponent.moneyline ? (opponent.moneyline > 0 ? `+${opponent.moneyline}` : opponent.moneyline) : "--"}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Implied Win %
                </div>
                <div className="font-editorial text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  {team.impliedWinPct ? `${team.impliedWinPct}%` : "--"}
                </div>
                <div className="text-[11px] text-[var(--muted)] mt-0.5">Vig-free market odds</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="calm-card p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
          Next Matchup • {nextGame?.week}
        </span>
        <span className="text-xs text-[var(--muted)]">{nextGame?.shortDate}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={nextGame?.opponent.logo}
            alt={nextGame?.opponent.displayName}
            className="w-10 h-10 object-contain"
          />
          <div>
            <div className="text-xs text-[var(--muted)]">{nextGame?.isHome ? "vs" : "@"} Opponent</div>
            <div className="font-editorial text-lg font-bold text-[var(--foreground)]">
              {nextGame?.opponent.displayName}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[var(--muted)]">{nextGame?.venue?.fullName}</div>
          <div className="text-sm font-semibold text-[var(--foreground)]">{nextGame?.statusDetail}</div>
        </div>
      </div>
    </div>
  );
}
