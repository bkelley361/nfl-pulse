"use client";

import React from "react";
import type { PlayerLeader } from "@/types";
import { SunburstIcon } from "@/components/icons/EditorialIcons";

interface TeamLeadersViewProps {
  leaders: PlayerLeader[];
  teamColor: string;
}

export default function TeamLeadersView({ leaders, teamColor }: TeamLeadersViewProps) {
  if (!leaders || leaders.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <SunburstIcon className="w-4 h-4 text-team" />
          <h4 className="font-editorial text-lg font-medium text-[var(--foreground)]">
            Season Statistical Leaders
          </h4>
        </div>
        <span className="text-[11px] font-mono font-medium text-[var(--muted)]">
          2026 Regular Season
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {leaders.map((leader) => (
          <div
            key={leader.category}
            className="calm-card p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-all duration-200 border border-[var(--border)]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--input)] text-[var(--muted)] border border-[var(--border)]">
                  {leader.categoryLabel}
                </span>
                <span className="text-xs font-mono font-bold text-[var(--muted)]">
                  {leader.position} {leader.jersey}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden bg-[var(--input)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-2xs"
                  style={{
                    boxShadow: `0 4px 12px -2px ${teamColor}30`,
                  }}
                >
                  {leader.headshot ? (
                    <img
                      src={leader.headshot}
                      alt={leader.fullName}
                      className="w-full h-full object-cover object-top"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-editorial text-sm font-bold text-[var(--muted)]">
                      {leader.position}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <h5 className="font-editorial font-bold text-sm text-[var(--foreground)] truncate">
                    {leader.fullName}
                  </h5>
                  <p className="text-[11px] text-[var(--muted)] font-sans">Key Playmaker</p>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[var(--border)] flex items-baseline justify-between">
              <span className="text-[10px] uppercase font-bold text-[var(--muted)] tracking-wider">
                Production
              </span>
              <span className="font-editorial text-lg font-bold text-team">
                {leader.statLine}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
