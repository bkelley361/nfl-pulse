import React from "react";

interface IconProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * Signature 12-point celestial starburst hallmark from the editorial inspiration design.
 * Used for section headings, divisional marks, and brand accents.
 */
export function SunburstIcon({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
      <circle cx="12" cy="12" r="2.2" strokeWidth={strokeWidth} />
    </svg>
  );
}

/**
 * Arched fan rising sun brand mark from the top-left of the inspiration design.
 * Used for primary branding and navigation.
 */
export function FanSunburstLogo({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 18h18" />
      <line x1="12" y1="18" x2="12" y2="4" />
      <line x1="12" y1="18" x2="6.5" y2="6.5" />
      <line x1="12" y1="18" x2="17.5" y2="6.5" />
      <line x1="12" y1="18" x2="3.5" y2="11.5" />
      <line x1="12" y1="18" x2="20.5" y2="11.5" />
      <circle cx="12" cy="18" r="1.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Refined editorial divisional rank / standings emblem.
 * Replaces generic cybersecurity shields with an elegant astronomical laurel star.
 */
export function DivisionRankIcon({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" strokeDasharray="2 2.5" strokeWidth={1.1} opacity="0.6" />
      <polygon
        points="12 4 14.2 9.2 19.8 9.7 15.6 13.4 16.9 19 12 16 7.1 19 8.4 13.4 4.2 9.7 9.8 9.2 12 4"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

/**
 * Delicate editorial schedule calendar with fine geometric grid.
 */
export function EditorialCalendar({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3.5" y="4.5" width="17" height="16" rx="3.5" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="2.5" x2="8" y2="5" />
      <line x1="16" y1="2.5" x2="16" y2="5" />
      <circle cx="8" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="8" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Editorial dispatch / gazette folio icon for news and journalism streams.
 */
export function EditorialDispatch({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
      <line x1="8" y1="7.5" x2="16" y2="7.5" />
      <line x1="8" y1="11.5" x2="16" y2="11.5" />
      <line x1="8" y1="15.5" x2="13" y2="15.5" />
    </svg>
  );
}

/**
 * Editorial pulse / telemetry wave for overview, analytics, and win probabilities.
 */
export function EditorialPulse({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2.5 12h4.5l2.5-6.5 4.5 13 2.5-6.5h5" />
    </svg>
  );
}

/**
 * Delicate celestial 4-point diamond spark.
 */
export function CelestialSpark({ className = "w-4 h-4", strokeWidth = 1.3 }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2c0 5-3 8-8 10 5 2 8 5 8 10 0-5 3-8 8-10-5-2-8-5-8-10z" />
    </svg>
  );
}
