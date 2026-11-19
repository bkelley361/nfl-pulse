"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import type { NFLTeam, TeamDivisionStats, ScheduleGame } from "@/types";

interface ShareTeamButtonProps {
  team: NFLTeam;
  teamStats?: TeamDivisionStats;
  nextGame?: ScheduleGame;
  recordSummary: string;
}

export default function ShareTeamButton({
  team,
  teamStats,
  nextGame,
  recordSummary,
}: ShareTeamButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const seed = teamStats?.seed ? `#${teamStats.seed} Seed in ${team.conference}` : `${team.conference} Contender`;
    const nextGameText = nextGame
      ? `Next: ${nextGame.isHome ? "vs" : "@"} ${nextGame.opponent.displayName}${nextGame.winProbability ? ` (${nextGame.winProbability}% win prob)` : ""}`
      : "Season Completed";

    const shareTitle = `${team.displayName} 2026 Season Pulse`;
    const shareText = `🏈 ${team.displayName} (${recordSummary}) • ${seed}\n🏆 ${team.conference} ${team.division} • Streak: ${teamStats?.streak || "W1"} • Diff: ${teamStats?.differential || "+0"}\n⚔️ ${nextGameText}\nTracked on NFL Pulse`;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url,
        });
        return;
      } catch {
        // Fall back to clipboard if user cancels or API fails
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      } catch (err) {
        console.error("Clipboard error:", err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--input)] border border-[var(--border)] text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer shadow-2xs group"
      title="Share Game-Day Snapshot or Copy to Clipboard"
      aria-label="Share Game-Day Snapshot"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500 animate-in zoom-in-75 duration-150" />
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Snapshot Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform text-team" />
          <span>Share Pulse</span>
        </>
      )}
    </button>
  );
}
