import React from "react";
import type { MatchupPredictorData, ScheduleGame } from "@/types";
import { TrendingUp, Tv, MapPin, Calendar, Percent, ShieldAlert, Award } from "lucide-react";

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
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
        <p className="text-slate-400 text-sm">No upcoming matchup scheduled.</p>
      </div>
    );
  }

  // If matchup data is present
  if (matchup) {
    const { team, opponent, weekText, venueName, broadcast, overUnder, spreadDetails, providerName } = matchup;

    const teamWinProj = team.winProjection ?? 50;
    const oppWinProj = opponent.winProjection ?? 50;
    const teamIsFavored = teamWinProj >= oppWinProj;

    const hasBettingOdds = matchup.hasOdds && (team.impliedWinPct !== undefined || team.moneyline !== undefined);

    const formattedDate = nextGame?.shortDate || (matchup.gameDate
      ? new Date(matchup.gameDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
      : "Upcoming");

    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#0d1424] to-[#090d16] border border-slate-800/90 shadow-2xl p-6 sm:p-8">
        {/* Glow effects */}
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: team.color }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: opponent.color }}
        />

        {/* Header bar */}
        <div className="relative flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/70">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-wide uppercase border border-blue-500/20 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              Next Matchup • {weekText}
            </span>
            {broadcast && (
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700">
                <Tv className="w-3 h-3 text-amber-400" />
                {broadcast}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formattedDate}</span>
            </div>
            {venueName && (
              <div className="hidden sm:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate max-w-[200px]">{venueName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Teams Spotlight */}
        <div className="relative my-6 grid grid-cols-5 items-center gap-4">
          {/* Selected Team */}
          <div className="col-span-2 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2.5 flex items-center justify-center bg-slate-900/80 border border-slate-750 shadow-lg"
                style={{ borderColor: `${team.color}40` }}
              >
                <img
                  src={team.logo}
                  alt={team.displayName}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {matchup.isHome ? "Home" : "Away"}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {team.displayName}
                </h2>
                {team.record && (
                  <span className="text-xs font-semibold text-slate-400">
                    Record: {team.record}
                  </span>
                )}
              </div>
            </div>
            <div className="sm:hidden mt-2">
              <div className="font-bold text-sm text-white">{team.name}</div>
              {team.record && (
                <div className="text-[11px] text-slate-400 font-medium">({team.record})</div>
              )}
            </div>
          </div>

          {/* VS Divider */}
          <div className="col-span-1 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 font-black text-xs shadow-inner">
              VS
            </div>
          </div>

          {/* Opponent */}
          <div className="col-span-2 flex flex-col items-center sm:items-end text-center sm:text-right">
            <div className="flex items-center justify-end gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {!matchup.isHome ? "Home" : "Away"}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {opponent.displayName}
                </h2>
                {opponent.record && (
                  <span className="text-xs font-semibold text-slate-400">
                    Record: {opponent.record}
                  </span>
                )}
              </div>
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2.5 flex items-center justify-center bg-slate-900/80 border border-slate-750 shadow-lg"
                style={{ borderColor: `${opponent.color}40` }}
              >
                <img
                  src={opponent.logo}
                  alt={opponent.displayName}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>
            </div>
            <div className="sm:hidden mt-2">
              <div className="font-bold text-sm text-white">{opponent.name}</div>
              {opponent.record && (
                <div className="text-[11px] text-slate-400 font-medium">({opponent.record})</div>
              )}
            </div>
          </div>
        </div>

        {/* Win Probability Bar (FPI Matchup Predictor) */}
        <div className="relative mt-6 p-5 rounded-2xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ESPN FPI Matchup Predictor
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Favors:{" "}
              <strong className="text-white">
                {teamIsFavored ? team.shortDisplayName || team.name : opponent.shortDisplayName || opponent.name} (
                {Math.max(teamWinProj, oppWinProj)}%)
              </strong>
            </span>
          </div>

          {/* Dual Bar */}
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-800 p-0.5 border border-slate-700/80">
            <div
              className="h-full rounded-l-lg transition-all duration-700 flex items-center justify-start px-2 font-black text-xs text-white"
              style={{
                width: `${teamWinProj}%`,
                backgroundColor: team.color || "#3b82f6",
              }}
            >
              {teamWinProj > 15 && `${teamWinProj}%`}
            </div>
            <div
              className="h-full rounded-r-lg transition-all duration-700 flex items-center justify-end px-2 font-black text-xs text-white"
              style={{
                width: `${oppWinProj}%`,
                backgroundColor: opponent.color || "#ef4444",
              }}
            >
              {oppWinProj > 15 && `${oppWinProj}%`}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mt-2 px-1">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: team.color }}
              />
              {team.shortDisplayName || team.name}: {teamWinProj}%
            </span>
            <span className="flex items-center gap-1.5">
              {opponent.shortDisplayName || opponent.name}: {oppWinProj}%
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: opponent.color }}
              />
            </span>
          </div>
        </div>

        {/* Vegas / Market Odds & Implied Win Probability */}
        {hasBettingOdds && (
          <div className="relative mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Spread
              </div>
              <div className="text-sm font-black text-slate-100 mt-0.5">
                {spreadDetails || team.spread || "PK"}
              </div>
              <div className="text-[10px] text-slate-400">Consensus line</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Total (O/U)
              </div>
              <div className="text-sm font-black text-slate-100 mt-0.5">
                {overUnder ? `${overUnder} pts` : "--"}
              </div>
              <div className="text-[10px] text-slate-400">Game Over/Under</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Moneyline
              </div>
              <div className="text-sm font-black text-slate-100 mt-0.5">
                {team.moneyline ? (team.moneyline > 0 ? `+${team.moneyline}` : team.moneyline) : "--"}
              </div>
              <div className="text-[10px] text-slate-400">Opp: {opponent.moneyline ? (opponent.moneyline > 0 ? `+${opponent.moneyline}` : opponent.moneyline) : "--"}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400">
                Market Implied Win %
              </div>
              <div className="text-sm font-black text-emerald-400 mt-0.5">
                {team.impliedWinPct ? `${team.impliedWinPct}%` : "--"}
              </div>
              <div className="text-[10px] text-slate-400">Vig-free odds</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback if only nextGame exists from schedule
  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
          Next Matchup • {nextGame?.week}
        </span>
        <span className="text-xs text-slate-400">{nextGame?.shortDate}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={nextGame?.opponent.logo}
            alt={nextGame?.opponent.displayName}
            className="w-12 h-12 object-contain"
          />
          <div>
            <div className="text-xs text-slate-400">{nextGame?.isHome ? "vs" : "@"} Opponent</div>
            <div className="text-lg font-bold text-white">{nextGame?.opponent.displayName}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">{nextGame?.venue?.fullName}</div>
          <div className="text-sm font-semibold text-slate-200">{nextGame?.statusDetail}</div>
        </div>
      </div>
    </div>
  );
}
