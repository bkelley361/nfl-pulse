import React from "react";
import type { MatchupPredictorData, ScheduleGame } from "@/types";
import { TrendingUp, Tv, MapPin, Calendar, Award, Shield } from "lucide-react";

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
    const favoredMargin = Math.abs(teamWinProj - oppWinProj).toFixed(1);
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

        {/* Top Matchup Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-team-tint text-team border border-team-tint">
              Next Matchup • {weekText}
            </span>
            {broadcast && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--input)] border border-[var(--border)] text-[11px] font-semibold text-[var(--foreground)]">
                <Tv className="w-3 h-3 text-amber-500" />
                {broadcast}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[var(--muted)]" />
              <span>{formattedDate}</span>
            </div>
            {venueName && (
              <div className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--muted)]" />
                <span className="truncate max-w-[200px]">{venueName}</span>
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
              <Award className="w-3 h-3 text-amber-500" />
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
          <div className="md:col-span-4 flex items-center justify-start md:justify-end gap-4 text-left md:text-right">
            <div className="order-2 md:order-1">
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
              className="order-1 md:order-2 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2.5 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-md flex-shrink-0"
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

        {/* Market Consensus & Betting Odds Cards */}
        {hasBettingOdds && (
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Point Spread
                </div>
                <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
                  {spreadDetails || team.spread || "PK"}
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">Consensus line</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Game Total (O/U)
                </div>
                <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
                  {overUnder ? `${overUnder} pts` : "--"}
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">Over / Under</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Moneyline
                </div>
                <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
                  {team.moneyline ? (team.moneyline > 0 ? `+${team.moneyline}` : team.moneyline) : "--"}
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">
                  Opp: {opponent.moneyline ? (opponent.moneyline > 0 ? `+${opponent.moneyline}` : opponent.moneyline) : "--"}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-xs">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                  Implied Win %
                </div>
                <div className="font-editorial text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {team.impliedWinPct ? `${team.impliedWinPct}%` : "--"}
                </div>
                <div className="text-[10px] text-[var(--muted)] mt-0.5">Vig-free market</div>
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
