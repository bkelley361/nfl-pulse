import Link from "next/link";
import TeamSelector from "@/components/TeamSelector";
import { Calendar, Newspaper, TrendingUp, Sparkles, Compass } from "lucide-react";

export default function HomePage() {
  const popularTeams = [
    { slug: "det", name: "Lions", color: "#0076b6" },
    { slug: "tb", name: "Buccaneers", color: "#bd1c36" },
    { slug: "phi", name: "Eagles", color: "#06424d" },
    { slug: "kc", name: "Chiefs", color: "#e31837" },
    { slug: "gb", name: "Packers", color: "#204e32" },
    { slug: "bal", name: "Ravens", color: "#241773" },
    { slug: "sf", name: "49ers", color: "#aa0000" },
    { slug: "buf", name: "Bills", color: "#00338d" },
  ];

  return (
    <div className="min-h-screen pb-24 transition-colors duration-200">
      {/* Calm Hero Section */}
      <div className="relative border-b border-[var(--border)] bg-[var(--card)]/30 py-16 sm:py-24 overflow-hidden">
        {/* Soft diffuse atmospheric glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/8 via-blue-500/8 to-emerald-500/8 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Subtle Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-xs font-semibold text-[var(--muted)] mb-6 shadow-2xs">
            <Compass className="w-3.5 h-3.5 text-amber-500" />
            <span>A Softer, Intelligent Digital Sports Space • 2026 NFL Season</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-medium text-[var(--foreground)] tracking-tight max-w-4xl mx-auto leading-none">
            Your NFL Franchise <br />
            <span className="italic font-normal">Command Center</span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-[var(--muted)] max-w-2xl mx-auto font-sans leading-relaxed">
            Select any team to immerse your experience in their official color palette. Track 18-week schedules, ESPN FPI computer win probabilities, and real-time aggregated beat reporting.
          </p>

          {/* Quick Team Shortcuts */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-[var(--muted)] mr-1">Trending:</span>
            {popularTeams.map((team) => (
              <Link
                key={team.slug}
                href={`/team/${team.slug}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[var(--foreground)] bg-[var(--card)] hover:bg-[var(--input)] border border-[var(--border)] hover:border-slate-400 dark:hover:border-slate-600 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                  style={{ backgroundColor: team.color }}
                />
                {team.name}
              </Link>
            ))}
          </div>

          {/* 3 Calm System Feature Cards (Image 4 card style) */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto text-left">
            <div className="calm-card p-5">
              <span className="font-editorial text-xs font-semibold text-[var(--muted)]">01</span>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                <h2 className="font-editorial text-base font-semibold text-[var(--foreground)]">
                  18-Week Schedules
                </h2>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Scores, kickoff times, TV broadcast networks, and stadium venues for the entire season.
              </p>
            </div>

            <div className="calm-card p-5">
              <span className="font-editorial text-xs font-semibold text-[var(--muted)]">02</span>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                <h2 className="font-editorial text-base font-semibold text-[var(--foreground)]">
                  Win Probabilities
                </h2>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                ESPN FPI computer projections, smooth probability waves, and sportsbook implied consensus.
              </p>
            </div>

            <div className="calm-card p-5">
              <span className="font-editorial text-xs font-semibold text-[var(--muted)]">03</span>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <Newspaper className="w-4 h-4 text-emerald-500" />
                <h2 className="font-editorial text-base font-semibold text-[var(--foreground)]">
                  Aggregated Beat News
                </h2>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Real-time aggregated stream from ESPN, regional beat writers, and sports media outlets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Selection Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-[var(--foreground)] tracking-tight">
              Select Your Franchise
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Choose from all 32 NFL franchises to adapt the dashboard to their official color palette.
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--muted)]">
            32 Teams • AFC & NFC
          </span>
        </div>

        <TeamSelector />
      </div>
    </div>
  );
}
