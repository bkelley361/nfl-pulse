import type { ScheduleGame } from "@/types";

function formatDateToICS(isoString: string): string {
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function generateICSContent(teamName: string, games: ScheduleGame[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//NFL Pulse//2026 Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${teamName} 2026 Schedule`,
    "X-WR-TIMEZONE:America/New_York",
  ];

  const upcomingGames = games.filter((g) => !g.completed && g.date);

  upcomingGames.forEach((g) => {
    const startStr = formatDateToICS(g.date);
    if (!startStr) return;

    const startDate = new Date(g.date);
    const endDate = new Date(startDate.getTime() + 3.5 * 3600 * 1000); // 3.5 hours default
    const endStr = formatDateToICS(endDate.toISOString());

    const summary = `${teamName} ${g.isHome ? "vs" : "@"} ${g.opponent.displayName}`;
    const desc = `2026 NFL Regular Season\\nWeek: ${g.week}\\nTV: ${g.broadcast || "TBD"}\\nVenue: ${g.venue?.fullName || "Stadium"}\\nTracked on NFL Pulse`;
    const loc = `${g.venue?.fullName || "Stadium"}, ${g.venue?.city || ""}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:nflpulse-${g.id || Math.random().toString(36)}@nflpulse.com`,
      `DTSTAMP:${formatDateToICS(new Date().toISOString())}`,
      `DTSTART:${startStr}`,
      `DTEND:${endStr}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${loc}`,
      "STATUS:CONFIRMED",
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export function downloadTeamICS(teamName: string, games: ScheduleGame[]) {
  const content = generateICSContent(teamName, games);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${teamName.toLowerCase().replace(/\s+/g, "-")}-2026-schedule.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarLink(game: ScheduleGame, teamName: string): string {
  const d = new Date(game.date);
  if (isNaN(d.getTime())) return "#";
  const startStr = formatDateToICS(game.date);
  const endD = new Date(d.getTime() + 3.5 * 3600 * 1000);
  const endStr = formatDateToICS(endD.toISOString());

  const title = encodeURIComponent(`${teamName} ${game.isHome ? "vs" : "@"} ${game.opponent.displayName}`);
  const details = encodeURIComponent(
    `2026 NFL Matchup (${game.week})\nBroadcast: ${game.broadcast || "TBD"}\nVenue: ${game.venue?.fullName || "Stadium"}\nTracked on NFL Pulse`
  );
  const loc = encodeURIComponent(`${game.venue?.fullName || "Stadium"}, ${game.venue?.city || ""}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${loc}`;
}
