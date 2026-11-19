import { notFound } from "next/navigation";
import Link from "next/link";
import { NFL_TEAMS, getTeamBySlug } from "@/data/teams";
import {
  fetchTeamSchedule,
  fetchGameMatchup,
  fetchTeamNews,
  fetchLeagueStandings,
  fetchTeamPersonnel,
} from "@/lib/api";
import { getTeamStyleVariables } from "@/lib/colors";
import TeamDashboardView from "@/components/TeamDashboardView";
import ShareTeamButton from "@/components/ShareTeamButton";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NFL_TEAMS.map((team) => ({
    slug: team.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);
  if (!team) return { title: "Team Not Found" };
  return {
    title: `${team.displayName} — 2026 Pulse | Schedule, Win Probabilities & News`,
    description: `Track the ${team.displayName} 2026 NFL schedule, computer matchup win probabilities, Vegas odds, division rankings, and real-time aggregated beat reporting.`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  // Dynamic CSS variables so selected team's color is the main palette
  const teamStyles = getTeamStyleVariables(team.color, team.alternateColor);

  // Parallel fetch schedule, news, league standings, and personnel (leaders + injury report)
  const [scheduleData, newsArticles, standingsData, personnelData] = await Promise.all([
    fetchTeamSchedule(team.id),
    fetchTeamNews(team),
    fetchLeagueStandings(),
    fetchTeamPersonnel(team.id),
  ]);

  // Next game matchup spotlight
  let matchupData = null;
  if (scheduleData.nextGameId) {
    matchupData = await fetchGameMatchup(scheduleData.nextGameId, team.id);
  }

  const teamStats = standingsData.standingsMap[team.id];
  const division = standingsData.divisions.find(
    (d) => d.conference === team.conference && d.division === team.division
  );

  // Conference teams for the full 16-team Playoff Picture
  const conferenceTeams = Object.values(standingsData.standingsMap).filter(
    (t) => t.conference === team.conference
  );

  // Divisional neighbors for fast cycling
  const divisionTeams = NFL_TEAMS.filter(
    (t) => t.conference === team.conference && t.division === team.division
  );
  const currentDivIndex = divisionTeams.findIndex((t) => t.id === team.id);
  const prevTeam = divisionTeams[(currentDivIndex - 1 + divisionTeams.length) % divisionTeams.length];
  const nextTeam = divisionTeams[(currentDivIndex + 1) % divisionTeams.length];

  return (
    <div
      className="min-h-screen pb-20 transition-colors duration-200"
      style={teamStyles}
    >
      {/* Team Header Banner with Calm Editorial Aesthetic */}
      <div className="relative border-b border-[var(--border)] bg-[var(--card)]/40 overflow-hidden">
        {/* Ambient atmospheric aura from the team's official color */}
        <div
          className="absolute -top-36 left-1/3 w-[650px] h-[350px] rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: team.color }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-9">
          {/* Navigation Bar: Back & Next/Prev Division Navigation */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:border-slate-400 dark:hover:border-slate-600 transition-all group cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>All Franchises</span>
            </Link>

            <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] shadow-2xs text-xs">
              <Link
                href={`/team/${prevTeam.slug}`}
                className="px-3 py-1 rounded-full text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-all flex items-center gap-1.5"
                title={`Previous: ${prevTeam.displayName}`}
              >
                <ArrowLeft className="w-3 h-3" />
                <span className="hidden sm:inline">{prevTeam.name}</span>
                <span className="sm:hidden">{prevTeam.abbreviation}</span>
              </Link>
              <span className="text-[var(--border)]">•</span>
              <Link
                href={`/team/${nextTeam.slug}`}
                className="px-3 py-1 rounded-full text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-all flex items-center gap-1.5"
                title={`Next: ${nextTeam.displayName}`}
              >
                <span className="hidden sm:inline">{nextTeam.name}</span>
                <span className="sm:hidden">{nextTeam.abbreviation}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Team Profile Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-3 bg-[var(--card)] border border-[var(--border)] flex items-center justify-center shadow-md flex-shrink-0"
                style={{
                  boxShadow: `0 12px 30px -8px ${team.color}45`,
                }}
              >
                <img
                  src={team.logo}
                  alt={team.displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[var(--input)] text-[var(--foreground)] border border-[var(--border)]">
                    {team.abbreviation}
                  </span>
                  <span className="text-xs font-medium text-[var(--muted)]">
                    {team.conference} {team.division}
                  </span>
                </div>

                <h1 className="font-editorial text-3xl sm:text-5xl font-medium text-[var(--foreground)] tracking-tight leading-none">
                  {team.displayName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs">
                  <span className="px-3 py-1 rounded-full bg-team-tint text-team border border-team-tint font-bold">
                    2026 Record: {scheduleData.record.summary}
                  </span>
                  {teamStats && (
                    <span className="px-3 py-1 rounded-full bg-[var(--input)] border border-[var(--border)] text-[var(--foreground)] font-semibold">
                      Rank #{teamStats.rank} in {team.conference} {team.division}
                    </span>
                  )}
                  {teamStats && (
                    <span className="text-[var(--muted)] font-medium">
                      Streak: <strong className="text-[var(--foreground)]">{teamStats.streak}</strong> • Diff: <strong className="text-[var(--foreground)]">{teamStats.differential}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons: Share & External Links */}
            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
              <ShareTeamButton
                team={team}
                teamStats={teamStats}
                nextGame={scheduleData.games.find((g) => !g.completed)}
                recordSummary={scheduleData.record.summary}
              />
              <a
                href={`https://www.espn.com/nfl/team/_/name/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--input)] hover:bg-[var(--border)] text-xs font-semibold text-[var(--foreground)] border border-[var(--border)] transition-all shadow-xs cursor-pointer"
              >
                <span>ESPN</span>
                <ExternalLink className="w-3.5 h-3.5 text-[var(--muted)]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <TeamDashboardView
          team={team}
          scheduleData={scheduleData}
          matchupData={matchupData}
          newsArticles={newsArticles}
          division={division}
          teamStats={teamStats}
          personnelData={personnelData}
          conferenceTeams={conferenceTeams}
        />
      </div>
    </div>
  );
}
