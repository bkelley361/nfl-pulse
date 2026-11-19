import Link from "next/link";
import TeamSelector from "@/components/TeamSelector";
import { Activity, Calendar, Newspaper, TrendingUp, Sparkles, Shield } from "lucide-react";

export default function HomePage() {
  const popularTeams = [
    { slug: "kc", name: "Chiefs", color: "#e31837" },
    { slug: "phi", name: "Eagles", color: "#004c54" },
    { slug: "bal", name: "Ravens", color: "#29126f" },
    { slug: "det", name: "Lions", color: "#0076b6" },
    { slug: "buf", name: "Bills", color: "#00338d" },
    { slug: "sf", name: "49ers", color: "#aa0000" },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-[#0e1628] via-[#0b101c] to-[#090d16] py-16 sm:py-20 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-amber-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>2026 NFL Season Intelligence & Live News Aggregator</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Your NFL Team’s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-400">
              Command Center
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal">
            Select any NFL franchise to explore full schedules, ESPN FPI computer win probabilities, betting odds, and real-time aggregated beat reporting.
          </p>

          {/* Quick Shortcuts */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Trending:</span>
            {popularTeams.map((team) => (
              <Link
                key={team.slug}
                href={`/team/${team.slug}`}
                className="px-3 py-1 rounded-full text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-1.5"
              >
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: team.color }}
                />
                {team.name}
              </Link>
            ))}
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <Calendar className="w-5 h-5 text-blue-400 mb-2" />
              <h2 className="text-sm font-bold text-slate-200">18-Week Schedules</h2>
              <p className="text-xs text-slate-400 mt-1">
                Completed game scores, kickoff times, venues, and live TV broadcast networks.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-amber-400 mb-2" />
              <h2 className="text-sm font-bold text-slate-200">Win Probabilities</h2>
              <p className="text-xs text-slate-400 mt-1">
                ESPN FPI model projections and vig-free sportsbook implied win percentages.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <Newspaper className="w-5 h-5 text-indigo-400 mb-2" />
              <h2 className="text-sm font-bold text-slate-200">Aggregated News</h2>
              <p className="text-xs text-slate-400 mt-1">
                Continuous news stream from ESPN, regional beat reporters, and sports media.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Selection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-6">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Select Your NFL Team
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse all 32 franchises across the AFC and NFC conferences.
          </p>
        </div>

        <TeamSelector />
      </div>
    </div>
  );
}
