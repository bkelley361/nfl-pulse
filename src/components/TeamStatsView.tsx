"use client";

import React, { useState } from "react";
import type { TeamSeasonStats, TeamStatMetric } from "@/types";
import { SunburstIcon } from "@/components/icons/EditorialIcons";
import { BarChart3, ShieldCheck, Zap, Crosshair, Award } from "lucide-react";

interface TeamStatsViewProps {
  seasonStats: TeamSeasonStats | null;
  teamDisplayName: string;
  teamColor: string;
}

function getRankBadgeColor(rank?: number) {
  if (!rank) return "bg-[var(--input)] text-[var(--muted)] border-[var(--border)]";
  if (rank <= 5) return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  if (rank <= 10) return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
  if (rank <= 20) return "bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]";
  return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25";
}

function MetricRow({ metric }: { metric: TeamStatMetric }) {
  const badgeClass = getRankBadgeColor(metric.rank);
  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[var(--card)] transition-colors border-b border-[var(--border)]/50 last:border-0">
      <span className="text-xs font-medium text-[var(--foreground)]">
        {metric.label}
      </span>
      <div className="flex items-center gap-2.5">
        <span className="font-editorial text-sm font-bold text-[var(--foreground)]">
          {metric.value}
        </span>
        {metric.rankDisplay && (
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeClass}`}
            title={`Ranked ${metric.rankDisplay} in the NFL`}
          >
            {metric.rankDisplay}
          </span>
        )}
      </div>
    </div>
  );
}

export default function TeamStatsView({
  seasonStats,
  teamDisplayName,
  teamColor,
}: TeamStatsViewProps) {
  const [selectedSection, setSelectedSection] = useState<
    "ALL" | "PASSING" | "RUSHING" | "DEFENSE" | "SITUATIONAL"
  >("ALL");

  if (!seasonStats) {
    return (
      <div className="calm-card p-8 text-center space-y-2">
        <BarChart3 className="w-8 h-8 text-[var(--muted)] mx-auto opacity-60" />
        <h4 className="font-editorial text-lg font-medium text-[var(--foreground)]">
          Season Statistics Standby
        </h4>
        <p className="text-xs text-[var(--muted)] max-w-md mx-auto">
          Statistical aggregates for {teamDisplayName} are currently being compiled from league telemetry.
        </p>
      </div>
    );
  }

  const { summary, passing, rushing, defense, situational } = seasonStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <SunburstIcon className="w-4 h-4 text-team" />
            <h3 className="font-editorial text-xl font-medium text-[var(--foreground)] tracking-tight">
              {teamDisplayName} Team Statistics
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Official 2026 NFL season production rankings, efficiency metrics, and situational execution.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner text-xs flex-wrap gap-1">
          <button
            onClick={() => setSelectedSection("ALL")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              selectedSection === "ALL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedSection("PASSING")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              selectedSection === "PASSING"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Passing
          </button>
          <button
            onClick={() => setSelectedSection("RUSHING")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              selectedSection === "RUSHING"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Rushing
          </button>
          <button
            onClick={() => setSelectedSection("DEFENSE")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              selectedSection === "DEFENSE"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Defense
          </button>
          <button
            onClick={() => setSelectedSection("SITUATIONAL")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              selectedSection === "SITUATIONAL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Situational
          </button>
        </div>
      </div>

      {/* Top 8 Key Metrics Banner */}
      {summary && summary.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] mb-3 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-team" />
            <span>Key NFL Season Rankings</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {summary.map((item, idx) => (
              <div
                key={idx}
                className="calm-card p-3 text-center flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 border border-[var(--border)]"
              >
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--muted)]">
                    {item.label}
                  </div>
                  <div className="font-editorial text-base font-bold text-[var(--foreground)] mt-1">
                    {item.value}
                  </div>
                </div>
                {item.rankDisplay && (
                  <div className="mt-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-team-tint text-team border border-team-tint">
                      {item.rankDisplay}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Passing Attack */}
        {(selectedSection === "ALL" || selectedSection === "PASSING") && (
          <div className="calm-card p-5 space-y-3 border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-team" />
                <h4 className="font-editorial text-base font-bold text-[var(--foreground)]">
                  Passing Offense
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)]">Air Production</span>
            </div>
            <div className="space-y-0.5 bg-[var(--input)]/40 rounded-2xl p-2 border border-[var(--border)]/60">
              {passing.map((m) => (
                <MetricRow key={m.name} metric={m} />
              ))}
            </div>
          </div>
        )}

        {/* Rushing Attack */}
        {(selectedSection === "ALL" || selectedSection === "RUSHING") && (
          <div className="calm-card p-5 space-y-3 border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-500" />
                <h4 className="font-editorial text-base font-bold text-[var(--foreground)]">
                  Rushing Offense
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)]">Ground Game</span>
            </div>
            <div className="space-y-0.5 bg-[var(--input)]/40 rounded-2xl p-2 border border-[var(--border)]/60">
              {rushing.map((m) => (
                <MetricRow key={m.name} metric={m} />
              ))}
            </div>
          </div>
        )}

        {/* Defense & Pressure */}
        {(selectedSection === "ALL" || selectedSection === "DEFENSE") && (
          <div className="calm-card p-5 space-y-3 border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500" />
                <h4 className="font-editorial text-base font-bold text-[var(--foreground)]">
                  Defense & Pressure
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)]">Stops & Havoc</span>
            </div>
            <div className="space-y-0.5 bg-[var(--input)]/40 rounded-2xl p-2 border border-[var(--border)]/60">
              {defense.map((m) => (
                <MetricRow key={m.name} metric={m} />
              ))}
            </div>
          </div>
        )}

        {/* Situational & Efficiency */}
        {(selectedSection === "ALL" || selectedSection === "SITUATIONAL") && (
          <div className="calm-card p-5 space-y-3 border border-[var(--border)]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber-500" />
                <h4 className="font-editorial text-base font-bold text-[var(--foreground)]">
                  Situational & Efficiency
                </h4>
              </div>
              <span className="text-[11px] font-mono text-[var(--muted)]">Downs & Red Zone</span>
            </div>
            <div className="space-y-0.5 bg-[var(--input)]/40 rounded-2xl p-2 border border-[var(--border)]/60">
              {situational.map((m) => (
                <MetricRow key={m.name} metric={m} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
