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
} from "@/types";
import MatchupPredictor from "@/components/MatchupPredictor";
import ScheduleView from "@/components/ScheduleView";
import NewsFeed from "@/components/NewsFeed";
import DivisionStandings from "@/components/DivisionStandings";
import { ArrowRight } from "lucide-react";
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
}

export default function TeamDashboardView({
  team,
  scheduleData,
  matchupData,
  newsArticles,
  division,
  teamStats,
}: TeamDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "standings" | "news">(
    "overview"
  );

  const nextGame = scheduleData.games.find((g: ScheduleGame) => !g.completed);
  const remainingCount = scheduleData.games.filter((g: ScheduleGame) => !g.completed).length;

  return (
    <div className="space-y-8">
      {/* Top Analytics Summary Ribbon (Quick metrics inspired by Image 1 & 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="calm-card p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Division Rank
          </div>
          <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
            #{teamStats?.rank || 1}
            <span className="text-xs font-normal text-[var(--muted)] ml-1">in {team.division}</span>
          </div>
        </div>

        <div className="calm-card p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            2026 Record
          </div>
          <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
            {scheduleData.record.summary}
          </div>
        </div>

        <div className="calm-card p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Win Streak
          </div>
          <div className="font-editorial text-lg font-bold text-team mt-0.5">
            {teamStats?.streak || "W2"}
          </div>
        </div>

        <div className="calm-card p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Point Diff
          </div>
          <div className="font-editorial text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {teamStats?.differential || "+0"}
          </div>
        </div>

        <div className="calm-card p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Div Record
          </div>
          <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
            {teamStats?.divRecord || "0-0"}
          </div>
        </div>

        <div className="calm-card p-3.5 text-center">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
            Remaining
          </div>
          <div className="font-editorial text-lg font-bold text-[var(--foreground)] mt-0.5">
            {remainingCount} Games
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs Bar (Image 4 Component 07 TABS & SLIDER style) */}
      <div className="flex items-center justify-center sm:justify-start">
        <div className="inline-flex rounded-full bg-[var(--input)] p-1.5 border border-[var(--border)] shadow-inner flex-wrap sm:flex-nowrap gap-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
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
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "schedule"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <EditorialCalendar className="w-3.5 h-3.5" />
            <span>Schedule & Win Probabilities</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
              {scheduleData.games.length}
            </span>
          </button>

          {division && (
            <button
              onClick={() => setActiveTab("standings")}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === "standings"
                  ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <DivisionRankIcon className="w-3.5 h-3.5" />
              <span>Division Standings</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[var(--input)] border border-[var(--border)] font-normal text-[var(--muted)]">
                Rank #{teamStats?.rank || 1}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("news")}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "news"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <EditorialDispatch className="w-3.5 h-3.5" />
            <span>Latest News</span>
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

          {/* Grid: Division Standings Preview + Next Games Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Division Standings Preview (7 cols) */}
            {division && (
              <div className="lg:col-span-7 calm-card p-6">
                <DivisionStandings
                  division={division}
                  currentTeamId={team.id}
                  teamColor={team.color}
                />
              </div>
            )}

            {/* Quick Next Games Preview (5 cols) */}
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
                  .map((g: ScheduleGame) => (
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
                          <div className="font-semibold text-[var(--foreground)]">
                            {g.isHome ? "vs" : "@"} {g.opponent.displayName}
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
                  ))}
              </div>
            </div>
          </div>
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

      {/* Tab 3: Full Division Standings & Analytics */}
      {activeTab === "standings" && division && (
        <div className="calm-card p-6 sm:p-8 animate-in fade-in duration-200 space-y-6">
          <DivisionStandings
            division={division}
            currentTeamId={team.id}
            teamColor={team.color}
          />
        </div>
      )}

      {/* Tab 4: Full-Width Spacious News Stream */}
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
