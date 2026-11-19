"use client";

import { useState } from "react";
import type {
  NFLTeam,
  ScheduleGame,
  TeamScheduleResult,
  MatchupPredictorData,
  NewsArticle,
  DivisionStandingsGroup,
  TeamDivisionStats,
  TeamPersonnelData,
} from "@/types";
import MatchupPredictor from "@/components/MatchupPredictor";
import ScheduleView from "@/components/ScheduleView";
import NewsFeed from "@/components/NewsFeed";
import DivisionStandings from "@/components/DivisionStandings";
import TeamLeadersView from "@/components/TeamLeadersView";
import InjuryReportView from "@/components/InjuryReportView";
import { ArrowRight, Clock, Activity, Users } from "lucide-react";
import {
  SunburstIcon,
  EditorialPulse,
  EditorialCalendar,
  DivisionRankIcon,
  EditorialDispatch,
} from "@/components/icons/EditorialIcons";

interface TeamDashboardViewProps {
  team: NFLTeam;
  scheduleData: TeamScheduleResult;
  matchupData: MatchupPredictorData | null;
  newsArticles: NewsArticle[];
  division?: DivisionStandingsGroup;
  teamStats?: TeamDivisionStats;
  personnelData?: TeamPersonnelData;
  conferenceTeams?: TeamDivisionStats[];
}

// Computes playoff picture bracket status and clinch outlook
function getPlayoffPicture(team: NFLTeam, teamStats?: TeamDivisionStats) {
  const seedNum = teamStats?.seed ? parseInt(teamStats.seed) : teamStats?.rank === 1 ? 2 : 6;
  const isLeader = teamStats?.rank === 1;

  if (seedNum === 1) {
    return {
      title: `${team.conference} #1 Overall Seed`,
      badge: "[z] First-Round Bye",
      description: "Controls the #1 seed with home-field advantage throughout the playoffs.",
    };
  }
  if (seedNum >= 2 && seedNum <= 4) {
    return {
      title: `${team.conference} #${seedNum} Seed • Division Leader`,
      badge: isLeader ? "[y] Projected Division Host" : "Division Contender",
      description: `Leading the ${team.conference} ${team.division} with home-field advantage in the Wild Card round.`,
    };
  }
  if (seedNum >= 5 && seedNum <= 7) {
    return {
      title: `${team.conference} #${seedNum} Seed • Wild Card Spot`,
      badge: "[x] Playoff Berth",
      description: `Holds the #${seedNum} Wild Card slot with a road postseason matchup projected.`,
    };
  }
  return {
    title: `#${seedNum} in ${team.conference} • In The Hunt`,
    badge: "Wild Card Chase",
    description: `Currently ${teamStats?.gamesBehind || "1.0"} games back from the final Wild Card position.`,
  };
}

// Detects Thursday Night Football short rest or Bye week rest advantage
function getRestBadge(game: ScheduleGame) {
  const d = new Date(game.date);
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  if (dayName === "Thu") {
    return { label: "Short Rest (TNF)", type: "short" as const };
  }
  if (dayName === "Mon") {
    return { label: "Extended Prep (MNF)", type: "normal" as const };
  }
  return null;
}

export default function TeamDashboardView({
  team,
  scheduleData,
  matchupData,
  newsArticles,
  division,
  teamStats,
  personnelData,
  conferenceTeams,
}: TeamDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "schedule" | "standings" | "leaders" | "injuries" | "news"
  >("overview");

  const nextGame = scheduleData.games.find((g: ScheduleGame) => !g.completed);
  const remainingCount = scheduleData.games.filter((g: ScheduleGame) => !g.completed).length;

  // PPG metrics
  const gamesPlayed = (teamStats?.wins ?? 0) + (teamStats?.losses ?? 0) + (teamStats?.ties ?? 0);
  const ppgFor = gamesPlayed > 0 ? ((teamStats?.pointsFor ?? 0) / gamesPlayed).toFixed(1) : "0.0";
  const ppgAgainst = gamesPlayed > 0 ? ((teamStats?.pointsAgainst ?? 0) / gamesPlayed).toFixed(1) : "0.0";
  const playoffInfo = getPlayoffPicture(team, teamStats);

  return (
    <div className="space-y-6">
      {/* Top Analytics Summary Ribbon (8-metric calm grid with PPG breakdown) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Div Rank
          </div>
          <div className="font-editorial text-base font-bold text-[var(--foreground)] mt-0.5">
            #{teamStats?.rank || 1}
            <span className="text-[10px] font-normal text-[var(--muted)] ml-1">in {team.division}</span>
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            2026 Record
          </div>
          <div className="font-editorial text-base font-bold text-[var(--foreground)] mt-0.5">
            {scheduleData.record.summary}
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Playoff Seed
          </div>
          <div className="font-editorial text-base font-bold text-team mt-0.5">
            #{teamStats?.seed || (teamStats?.rank === 1 ? 2 : 6)}
            <span className="text-[10px] font-normal text-[var(--muted)] ml-1">{team.conference}</span>
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Offense
          </div>
          <div className="font-editorial text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {ppgFor} <span className="text-[10px] font-normal text-[var(--muted)]">PPG</span>
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Defense
          </div>
          <div className="font-editorial text-base font-bold text-[var(--foreground)] mt-0.5">
            {ppgAgainst} <span className="text-[10px] font-normal text-[var(--muted)]">PPG</span>
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Point Diff
          </div>
          <div className="font-editorial text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {teamStats?.differential || "+0"}
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Streak
          </div>
          <div className="font-editorial text-base font-bold text-team mt-0.5">
            {teamStats?.streak || "W1"}
          </div>
        </div>

        <div className="calm-card p-3 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Remaining
          </div>
          <div className="font-editorial text-base font-bold text-[var(--foreground)] mt-0.5">
            {remainingCount} Games
          </div>
        </div>
      </div>

      {/* Playoff Picture & Clinch Scenario Banner */}
      <div className="calm-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-team-tint border border-team-tint flex items-center justify-center text-team shrink-0 shadow-2xs">
            <DivisionRankIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-editorial text-base font-bold text-[var(--foreground)]">
                {playoffInfo.title}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-team-tint text-team border border-team-tint font-bold">
                {playoffInfo.badge}
              </span>
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              {playoffInfo.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-mono">
          <span className="px-2.5 py-1 rounded-full bg-[var(--input)] border border-[var(--border)] text-[var(--muted)]">
            Remaining: <strong className="text-[var(--foreground)]">{remainingCount} Games</strong>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[var(--input)] border border-[var(--border)] text-[var(--muted)]">
            Div Record: <strong className="text-[var(--foreground)]">{teamStats?.divRecord || "0-0"}</strong>
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs Bar */}
      <div className="flex items-center justify-start overflow-x-auto pb-1 max-w-full">
        <div className="inline-flex rounded-full bg-[var(--input)] p-1.5 border border-[var(--border)] shadow-inner flex-nowrap gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <EditorialPulse className="w-3.5 h-3.5 text-team" />
            <span>Overview & Matchup</span>
          </button>

          <button
            onClick={() => setActiveTab("schedule")}
            className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "schedule"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <EditorialCalendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {scheduleData.games.length}
            </span>
          </button>

          {division && (
            <button
              onClick={() => setActiveTab("standings")}
              className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "standings"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <DivisionRankIcon className="w-3.5 h-3.5" />
              <span>Standings & Playoffs</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
                #{teamStats?.rank || 1}
              </span>
            </button>
          )}

          {personnelData?.leaders && personnelData.leaders.length > 0 && (
            <button
              onClick={() => setActiveTab("leaders")}
              className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "leaders"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-team" />
              <span>Playmakers</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
                {personnelData.leaders.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("injuries")}
            className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "injuries"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-500" />
            <span>Injury Report</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {personnelData?.injuries?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("news")}
            className={`whitespace-nowrap px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <EditorialDispatch className="w-3.5 h-3.5" />
            <span>News</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {newsArticles.length}
            </span>
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Spotlight */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Featured Upcoming Matchup & Win Probability */}
          <section>
            <MatchupPredictor
              matchup={matchupData}
              nextGame={nextGame}
              teamColor={team.color}
            />
          </section>

          {/* Season Statistical Leaders (Playmakers) */}
          {personnelData?.leaders && personnelData.leaders.length > 0 && (
            <section className="calm-card p-6">
              <TeamLeadersView
                leaders={personnelData.leaders}
                teamColor={team.color}
              />
            </section>
          )}

          {/* Grid: Division Standings Preview + Next Games Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Division Standings Preview with Conference Toggle (7 cols) */}
            {division && (
              <div className="lg:col-span-7 calm-card p-6">
                <DivisionStandings
                  division={division}
                  currentTeamId={team.id}
                  teamColor={team.color}
                  conferenceTeams={conferenceTeams}
                />
              </div>
            )}

            {/* Quick Next Games Preview with Rest Advantage Badges (5 cols) */}
            <div className="lg:col-span-5 calm-card p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <div>
                  <h4 className="font-editorial text-lg font-medium text-[var(--foreground)]">
                    Upcoming Slate
                  </h4>
                  <p className="text-xs text-[var(--muted)]">
                    Next matchups on the 2026 calendar
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("schedule")}
                  className="text-xs font-semibold text-team hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Full Schedule</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {scheduleData.games
                  .filter((g: ScheduleGame) => !g.completed)
                  .slice(0, 4)
                  .map((g: ScheduleGame) => {
                    const restBadge = getRestBadge(g);
                    return (
                      <div
                        key={g.id}
                        className="p-3 rounded-xl bg-[var(--input)]/50 border border-[var(--border)] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={g.opponent.logo}
                            alt={g.opponent.displayName}
                            className="w-6 h-6 object-contain"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-[var(--foreground)]">
                                {g.isHome ? "vs" : "@"} {g.opponent.displayName}
                              </span>
                              {restBadge && (
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                                    restBadge.type === "short"
                                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25"
                                  }`}
                                >
                                  {restBadge.label}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-[var(--muted)]">
                              {g.shortDate}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-editorial font-bold text-xs text-[var(--foreground)]">
                            {g.winProbability}% win prob
                          </div>
                          <div className="text-[10px] text-[var(--muted)]">
                            {g.broadcast || "Scheduled"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Official Injury & IR Report */}
          <section className="calm-card p-6">
            <InjuryReportView
              injuries={personnelData?.injuries || []}
              teamDisplayName={team.displayName}
            />
          </section>
        </div>
      )}

      {/* Tab 2: Full-Width Schedule & Win Probabilities */}
      {activeTab === "schedule" && (
        <div className="calm-card p-6 sm:p-8 animate-in fade-in duration-200">
          <ScheduleView
            games={scheduleData.games}
            teamDisplayName={team.displayName}
            teamAbbr={team.abbreviation}
            teamColor={team.color}
          />
        </div>
      )}

      {/* Tab 3: Full Division & Conference Playoff Standings */}
      {activeTab === "standings" && division && (
        <div className="calm-card p-6 sm:p-8 animate-in fade-in duration-200 space-y-6">
          <DivisionStandings
            division={division}
            currentTeamId={team.id}
            teamColor={team.color}
            conferenceTeams={conferenceTeams}
          />
        </div>
      )}

      {/* Tab 4: Playmakers & Statistical Leaders */}
      {activeTab === "leaders" && (
        <div className="calm-card p-6 sm:p-8 animate-in fade-in duration-200">
          <TeamLeadersView
            leaders={personnelData?.leaders || []}
            teamColor={team.color}
          />
        </div>
      )}

      {/* Tab 5: Official Injury & IR Report */}
      {activeTab === "injuries" && (
        <div className="calm-card p-6 sm:p-8 animate-in fade-in duration-200">
          <InjuryReportView
            injuries={personnelData?.injuries || []}
            teamDisplayName={team.displayName}
          />
        </div>
      )}

      {/* Tab 6: Full-Width Spacious News Stream */}
      {activeTab === "news" && (
        <div className="calm-card p-6 sm:p-8 animate-in fade-in duration-200">
          <NewsFeed
            articles={newsArticles}
            teamDisplayName={team.shortDisplayName || team.name}
          />
        </div>
      )}
    </div>
  );
}
