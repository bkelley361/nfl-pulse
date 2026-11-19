"use client";

import React, { useState } from "react";
import type { PlayerInjury } from "@/types";
import { Activity, AlertCircle } from "lucide-react";
import { SunburstIcon } from "@/components/icons/EditorialIcons";

interface InjuryReportViewProps {
  injuries: PlayerInjury[];
  teamDisplayName: string;
}

export default function InjuryReportView({
  injuries,
  teamDisplayName,
}: InjuryReportViewProps) {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "IR">("ALL");

  if (!injuries || injuries.length === 0) {
    return (
      <div className="calm-card p-6 text-center">
        <Activity className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
        <h4 className="font-editorial text-base font-semibold text-[var(--foreground)]">
          Clean Injury Report
        </h4>
        <p className="text-xs text-[var(--muted)] mt-0.5">
          No active game-day injury designations or IR listings reported for the {teamDisplayName}.
        </p>
      </div>
    );
  }

  const irCount = injuries.filter((i) => i.status.toLowerCase().includes("reserve")).length;
  const gameDayCount = injuries.filter((i) => !i.status.toLowerCase().includes("reserve")).length;

  const filteredInjuries = injuries.filter((i) => {
    const isIR = i.status.toLowerCase().includes("reserve");
    if (filter === "ACTIVE") return !isIR;
    if (filter === "IR") return isIR;
    return true;
  });

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("out")) {
      return "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30";
    }
    if (s.includes("doubtful")) {
      return "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30";
    }
    if (s.includes("questionable")) {
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30";
    }
    if (s.includes("reserve")) {
      return "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30";
    }
    return "bg-[var(--input)] text-[var(--foreground)] border-[var(--border)]";
  };

  return (
    <div className="space-y-4">
      {/* Header & Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div>
          <div className="flex items-center gap-2">
            <SunburstIcon className="w-4 h-4 text-team" />
            <h4 className="font-editorial text-lg font-medium text-[var(--foreground)]">
              Official Injury & IR Report
            </h4>
          </div>
          <p className="text-xs text-[var(--muted)] mt-0.5">
            Verified game-day practice status, injury designations, and Injured Reserve listings.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full bg-[var(--input)] p-1 border border-[var(--border)] self-start sm:self-auto shadow-inner text-xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All ({injuries.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filter === "ACTIVE"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Game-Day ({gameDayCount})
          </button>
          <button
            onClick={() => setFilter("IR")}
            className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
              filter === "IR"
                ? "bg-[var(--card)] text-[var(--foreground)] shadow-xs"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            Injured Reserve ({irCount})
          </button>
        </div>
      </div>

      {/* Grid of Injury Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredInjuries.map((player) => (
          <div
            key={player.id}
            className="p-3.5 rounded-2xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-between gap-3 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[var(--input)] border border-[var(--border)] overflow-hidden flex items-center justify-center shrink-0">
                {player.headshot ? (
                  <img
                    src={player.headshot}
                    alt={player.fullName}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-mono font-bold text-[var(--muted)]">
                    {player.position}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="font-editorial font-semibold text-sm text-[var(--foreground)] truncate">
                  {player.fullName}
                </div>
                <div className="text-[11px] text-[var(--muted)] font-mono flex items-center gap-1.5 mt-0.5">
                  <span className="font-bold">{player.position}</span>
                  {player.jersey && <span>{player.jersey}</span>}
                  {player.details && (
                    <>
                      <span>•</span>
                      <span>{player.details}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${getStatusBadge(
                player.status
              )}`}
            >
              {player.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
