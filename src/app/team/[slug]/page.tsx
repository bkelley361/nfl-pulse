import { notFound } from "next/navigation";
import Link from "next/link";
import { NFL_TEAMS, getTeamBySlug } from "@/data/teams";
import { fetchTeamSchedule, fetchGameMatchup, fetchTeamNews } from "@/lib/api";
import MatchupPredictor from "@/components/MatchupPredictor";
import ScheduleView from "@/components/ScheduleView";
import NewsFeed from "@/components/NewsFeed";
import { ArrowLeft, ExternalLink, Shield, Trophy } from "lucide-react";

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
    title: `${team.displayName} — Schedule, Win Probabilities & News | NFL Pulse`,
    description: `Track the ${team.displayName} schedule, upcoming matchup win probabilities, betting odds, and real-time aggregated team news.`,
  };
}

export default async function TeamPage({ params }: PageProps) {
  const { slug } = await params;
  const team = getTeamBySlug(slug);

  if (!team) {
    notFound();
  }

  // Fetch schedule and news in parallel
  const [scheduleData, newsArticles] = await Promise.all([
    fetchTeamSchedule(team.id),
    fetchTeamNews(team),
  ]);

  // Fetch matchup predictor data for next game if available
  let matchupData = null;
  const nextGame = scheduleData.games.find((g) => !g.completed);

  if (scheduleData.nextGameId) {
    matchupData = await fetchGameMatchup(scheduleData.nextGameId, team.id);
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Team Brand Banner / Header */}
      <div
        className="relative border-b border-slate-800/80 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, ${team.color}15 0%, rgba(9, 13, 22, 0.95) 100%)`,
        }}
      >
        {/* Glow */}
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: team.color }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to All Teams
          </Link>

          {/* Team Profile Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-3 bg-slate-900/90 border border-slate-750 flex items-center justify-center shadow-2xl flex-shrink-0"
                style={{
                  boxShadow: `0 10px 30px -10px ${team.color}50`,
                }}
              >
                <img
                  src={team.logo}
                  alt={team.displayName}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {team.abbreviation}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {team.conference} {team.division}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {team.displayName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-medium text-slate-300">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">
                    2026 Record: {scheduleData.record.summary}
                  </span>
                  {scheduleData.record.standing && (
                    <span className="text-slate-400">
                      {scheduleData.record.standing}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick External Links */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <a
                href={`https://www.espn.com/nfl/team/_/name/${team.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-colors shadow-sm"
              >
                <span>ESPN Clubhouse</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Featured Section: Upcoming Matchup & Win Probability */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl font-black text-white tracking-tight">
              Upcoming Matchup & Win Probability
            </h2>
            <p className="text-xs text-slate-400">
              Computer model win projection, sportsbook odds, and pregame analysis.
            </p>
          </div>
          <MatchupPredictor
            matchup={matchupData}
            nextGame={nextGame}
            teamColor={team.color}
          />
        </section>

        {/* Two-Column Grid: Schedule & News */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Schedule (7 cols) */}
          <section className="lg:col-span-7 bg-slate-900/40 p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-xl">
            <ScheduleView
              games={scheduleData.games}
              teamDisplayName={team.displayName}
              teamAbbr={team.abbreviation}
              teamColor={team.color}
            />
          </section>

          {/* Right Column: Aggregated News (5 cols) */}
          <section className="lg:col-span-5 bg-slate-900/40 p-5 sm:p-6 rounded-3xl border border-slate-800/80 shadow-xl">
            <NewsFeed
              articles={newsArticles}
              teamDisplayName={team.shortDisplayName || team.name}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
