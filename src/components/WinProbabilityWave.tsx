"use client";

import React from "react";

interface WinProbabilityWaveProps {
  teamName: string;
  oppName: string;
  teamPct: number;
  oppPct: number;
  teamColor: string;
  oppColor: string;
}

export default function WinProbabilityWave({
  teamName,
  oppName,
  teamPct,
  oppPct,
  teamColor,
  oppColor,
}: WinProbabilityWaveProps) {
  // Height scale relative to percentage (max height ~130px)
  const teamHeight = Math.max(30, Math.min(130, (teamPct / 100) * 140));
  const oppHeight = Math.max(30, Math.min(130, (oppPct / 100) * 140));

  return (
    <div className="relative w-full overflow-hidden pt-2 pb-1">
      {/* Wave chart SVG */}
      <svg
        viewBox="0 0 600 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-36 sm:h-44 overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Team gradient fill */}
          <linearGradient id="teamWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={teamColor} stopOpacity="0.45" />
            <stop offset="60%" stopColor={teamColor} stopOpacity="0.15" />
            <stop offset="100%" stopColor={teamColor} stopOpacity="0.0" />
          </linearGradient>

          {/* Opponent gradient fill */}
          <linearGradient id="oppWaveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={oppColor} stopOpacity="0.4" />
            <stop offset="60%" stopColor={oppColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={oppColor} stopOpacity="0.0" />
          </linearGradient>

          {/* Subtle grid pattern */}
          <pattern id="calmGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="600" y2="0" stroke="currentColor" strokeOpacity="0.05" />
          </pattern>
        </defs>

        {/* Horizontal subtle guide lines (like in Image 1) */}
        <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
        <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
        <line x1="0" y1="140" x2="600" y2="140" stroke="currentColor" strokeOpacity="0.06" />

        {/* Opponent Area Wave (Right-shifted bell curve) */}
        <path
          d={`M 180,140 
              C 260,140 330,${140 - oppHeight} 400,${140 - oppHeight} 
              C 470,${140 - oppHeight} 530,140 590,140 
              L 590,140 L 180,140 Z`}
          fill="url(#oppWaveGrad)"
        />
        <path
          d={`M 180,140 
              C 260,140 330,${140 - oppHeight} 400,${140 - oppHeight} 
              C 470,${140 - oppHeight} 530,140 590,140`}
          stroke={oppColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* Contour lines over Opponent (inspired by Image 1) */}
        <path
          d={`M 220,140 C 290,140 340,${145 - oppHeight} 400,${145 - oppHeight} C 460,${145 - oppHeight} 500,140 550,140`}
          stroke={oppColor}
          strokeWidth="0.75"
          strokeOpacity="0.3"
          strokeDasharray="2 2"
        />

        {/* Team Area Wave (Left/Center bell curve) */}
        <path
          d={`M 10,140 
              C 70,140 140,${140 - teamHeight} 220,${140 - teamHeight} 
              C 300,${140 - teamHeight} 370,140 450,140 
              L 450,140 L 10,140 Z`}
          fill="url(#teamWaveGrad)"
        />
        <path
          d={`M 10,140 
              C 70,140 140,${140 - teamHeight} 220,${140 - teamHeight} 
              C 300,${140 - teamHeight} 370,140 450,140`}
          stroke={teamColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Contour lines over Team (delicate arching lines from Image 1) */}
        <path
          d={`M 30,140 C 90,140 150,${145 - teamHeight * 0.9} 220,${145 - teamHeight * 0.9} C 290,${145 - teamHeight * 0.9} 350,140 420,140`}
          stroke={teamColor}
          strokeWidth="0.8"
          strokeOpacity="0.35"
        />
        <path
          d={`M 60,140 C 110,140 160,${145 - teamHeight * 0.75} 220,${145 - teamHeight * 0.75} C 280,${145 - teamHeight * 0.75} 330,140 390,140`}
          stroke={teamColor}
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />

        {/* Peak indicator dot for Team */}
        <circle
          cx="220"
          cy={140 - teamHeight}
          r="4.5"
          fill={teamColor}
          stroke="var(--card)"
          strokeWidth="2"
          className="drop-shadow-xs"
        />

        {/* Peak indicator dot for Opponent */}
        <circle
          cx="400"
          cy={140 - oppHeight}
          r="4"
          fill={oppColor}
          stroke="var(--card)"
          strokeWidth="2"
          className="drop-shadow-xs"
        />
      </svg>

      {/* Axis & Peak Labels */}
      <div className="flex items-center justify-between text-[11px] text-[var(--muted)] px-3 -mt-2">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: teamColor }}
          />
          <span className="font-semibold text-[var(--foreground)]">{teamName}</span>
          <span className="font-editorial text-sm font-bold text-[var(--foreground)]">
            {teamPct}%
          </span>
        </div>

        <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-mono">
          Win Probability Surface
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-editorial text-sm font-bold text-[var(--foreground)]">
            {oppPct}%
          </span>
          <span className="font-semibold text-[var(--foreground)]">{oppName}</span>
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: oppColor }}
          />
        </div>
      </div>
    </div>
  );
}
