import { XMLParser } from "fast-xml-parser";
import { NFL_TEAMS, getTeamById } from "@/data/teams";
import type {
  NFLTeam,
  ScheduleGame,
  TeamRecordData,
  MatchupPredictorData,
  NewsArticle,
} from "@/types";

export function timeAgo(dateString: string): string {
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "Recently";
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function moneylineToProb(odds?: number): number | null {
  if (odds === undefined || odds === null || isNaN(odds)) return null;
  if (odds < 0) return Math.abs(odds) / (Math.abs(odds) + 100);
  return 100 / (odds + 100);
}

export function calculateImpliedProb(
  homeOdds?: number,
  awayOdds?: number
): { home: number; away: number } | null {
  const pHome = moneylineToProb(homeOdds);
  const pAway = moneylineToProb(awayOdds);
  if (!pHome || !pAway) return null;
  const total = pHome + pAway;
  return {
    home: Math.round((pHome / total) * 1000) / 10,
    away: Math.round((pAway / total) * 1000) / 10,
  };
}

export interface TeamScheduleResult {
  record: TeamRecordData;
  games: ScheduleGame[];
  nextGameId: string | null;
}

export async function fetchTeamSchedule(
  teamId: string
): Promise<TeamScheduleResult> {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/${teamId}/schedule`,
      { next: { revalidate: 300 } } // 5 minute cache
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch schedule: ${res.statusText}`);
    }

    const data = await res.json();
    const rawEvents = data.events || [];

    const record: TeamRecordData = {
      summary: data.team?.recordSummary || "--",
      standing: data.team?.standingSummary || "",
    };

    let nextGameId: string | null = null;

    const games: ScheduleGame[] = rawEvents.map((e: any) => {
      const comp = e.competitions?.[0] || {};
      const competitors = comp.competitors || [];
      const currentTeamComp = competitors.find((c: any) => c.id === teamId);
      const opponentComp = competitors.find((c: any) => c.id !== teamId) || competitors[0];

      const isHome = currentTeamComp?.homeAway === "home";
      const statusType = comp.status?.type || {};
      const completed = statusType.completed ?? false;
      const state = statusType.state as "pre" | "in" | "post";
      const isLive = state === "in";

      if (!completed && !nextGameId) {
        nextGameId = e.id;
      }

      const teamScoreVal = currentTeamComp?.score?.value ?? currentTeamComp?.score?.displayValue;
      const oppScoreVal = opponentComp?.score?.value ?? opponentComp?.score?.displayValue;

      const teamScore = teamScoreVal !== undefined ? Number(teamScoreVal) : undefined;
      const opponentScore = oppScoreVal !== undefined ? Number(oppScoreVal) : undefined;

      let isWin: boolean | undefined = undefined;
      let isTie: boolean | undefined = undefined;
      if (completed && teamScore !== undefined && opponentScore !== undefined) {
        if (teamScore > opponentScore) isWin = true;
        else if (teamScore < opponentScore) isWin = false;
        else isTie = true;
      }

      const oppTeam = opponentComp?.team || {};
      const localOppTeam = getTeamById(oppTeam.id);

      const d = new Date(e.date);
      const shortDate = !isNaN(d.getTime())
        ? d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        : e.date;

      const b = comp.broadcasts?.[0];
      const broadcastName =
        b?.names?.[0] ||
        b?.media?.shortName ||
        (typeof b?.market === "string" ? b.market : typeof b?.market?.type === "string" ? b.market.type : "");

      return {
        id: e.id,
        week: e.week?.text || `Week ${e.week?.number ?? ""}`,
        weekNumber: e.week?.number ?? 0,
        seasonType: e.seasonType?.type ?? 2,
        date: e.date,
        shortDate,
        name: e.name || `${oppTeam.abbreviation} vs ${data.team?.abbreviation}`,
        shortName: e.shortName || "",
        isHome,
        completed,
        isLive,
        state,
        statusDetail: statusType.shortDetail || statusType.detail || "Scheduled",
        venue: {
          fullName: comp.venue?.fullName || "TBD Stadium",
          city: comp.venue?.address?.city || "",
          state: comp.venue?.address?.state || "",
        },
        broadcast: broadcastName,
        opponent: {
          id: oppTeam.id || "0",
          name: oppTeam.name || oppTeam.displayName || "TBD",
          displayName: oppTeam.displayName || "TBD",
          abbreviation: oppTeam.abbreviation || "OPP",
          logo:
            oppTeam.logos?.[0]?.href ||
            localOppTeam?.logo ||
            `https://a.espncdn.com/i/teamlogos/nfl/500/${(oppTeam.abbreviation || "nfl").toLowerCase()}.png`,
          color: localOppTeam?.color || "#4b5563",
        },
        teamScore,
        opponentScore,
        isWin,
        isTie,
      };
    });

    return {
      record,
      games,
      nextGameId,
    };
  } catch (err) {
    console.error("fetchTeamSchedule error:", err);
    return {
      record: { summary: "--", standing: "" },
      games: [],
      nextGameId: null,
    };
  }
}

export async function fetchGameMatchup(
  gameId: string,
  currentTeamId: string
): Promise<MatchupPredictorData | null> {
  try {
    const res = await fetch(
      `https://site.api.espn.com/apis/site/v2/sports/football/nfl/summary?event=${gameId}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) return null;
    const data = await res.json();

    const header = data.header || {};
    const comp = header.competitions?.[0] || {};
    const competitors = comp.competitors || [];

    const currentComp = competitors.find((c: any) => c.id === currentTeamId);
    const oppComp = competitors.find((c: any) => c.id !== currentTeamId);

    if (!currentComp || !oppComp) return null;

    const isHome = currentComp.homeAway === "home";
    const homeComp = isHome ? currentComp : oppComp;
    const awayComp = isHome ? oppComp : currentComp;

    // ESPN Predictor (FPI projection)
    const predictor = data.predictor;
    const homeProjection = predictor?.homeTeam?.gameProjection
      ? parseFloat(predictor.homeTeam.gameProjection)
      : undefined;
    const awayProjection = predictor?.awayTeam?.gameProjection
      ? parseFloat(predictor.awayTeam.gameProjection)
      : undefined;

    const teamProjection = isHome ? homeProjection : awayProjection;
    const oppProjection = isHome ? awayProjection : homeProjection;

    // Odds / Pickcenter
    const pick = data.pickcenter?.[0] || data.odds?.[0] || null;
    const providerName = pick?.provider?.name || "Vegas Consensus";
    const spreadDetails = pick?.details || "";
    const overUnder = pick?.overUnder ? Number(pick.overUnder) : undefined;

    const homeOdds = pick?.homeTeamOdds?.moneyLine ?? pick?.homeMoneyLine;
    const awayOdds = pick?.awayTeamOdds?.moneyLine ?? pick?.awayMoneyLine;

    const homeSpread = pick?.homeTeamOdds?.spreadOdds;
    const awaySpread = pick?.awayTeamOdds?.spreadOdds;

    const teamMoneyline = isHome ? homeOdds : awayOdds;
    const oppMoneyline = isHome ? awayOdds : homeOdds;

    const implied = calculateImpliedProb(homeOdds, awayOdds);
    const teamImplied = isHome ? implied?.home : implied?.away;
    const oppImplied = isHome ? implied?.away : implied?.home;

    const localTeam = getTeamById(currentTeamId);
    const localOpp = getTeamById(oppComp.id);

    const teamRecord =
      currentComp.record?.find((r: any) => r.type === "total")?.summary ||
      currentComp.record?.[0]?.summary ||
      "";
    const oppRecord =
      oppComp.record?.find((r: any) => r.type === "total")?.summary ||
      oppComp.record?.[0]?.summary ||
      "";

    const b = comp.broadcasts?.[0];
    const broadcasts =
      b?.names?.[0] ||
      b?.media?.shortName ||
      (typeof b?.market === "string" ? b.market : typeof b?.market?.type === "string" ? b.market.type : "");

    const venue = comp.venue?.fullName || "Stadium";

    return {
      gameId,
      gameDate: comp.date || "",
      weekText: header.week ? `Week ${header.week}` : "Matchup",
      venueName: venue,
      broadcast: broadcasts,
      isHome,
      team: {
        id: currentComp.id,
        name: currentComp.team?.name || localTeam?.name || "Team",
        displayName: currentComp.team?.displayName || localTeam?.displayName || "Team",
        shortDisplayName: currentComp.team?.shortDisplayName || localTeam?.shortDisplayName || currentComp.team?.name || "Team",
        abbreviation: currentComp.team?.abbreviation || localTeam?.abbreviation || "TEAM",
        logo:
          currentComp.team?.logos?.[0]?.href ||
          localTeam?.logo ||
          `https://a.espncdn.com/i/teamlogos/nfl/500/${(localTeam?.slug || "nfl")}.png`,
        color: localTeam?.color || "#1f2937",
        record: teamRecord,
        winProjection: teamProjection,
        moneyline: teamMoneyline,
        impliedWinPct: teamImplied,
        spread: isHome ? (pick?.spread ? `${pick.spread}` : undefined) : undefined,
      },
      opponent: {
        id: oppComp.id,
        name: oppComp.team?.name || localOpp?.name || "Opponent",
        displayName: oppComp.team?.displayName || localOpp?.displayName || "Opponent",
        shortDisplayName: oppComp.team?.shortDisplayName || localOpp?.shortDisplayName || oppComp.team?.name || "Opponent",
        abbreviation: oppComp.team?.abbreviation || localOpp?.abbreviation || "OPP",
        logo:
          oppComp.team?.logos?.[0]?.href ||
          localOpp?.logo ||
          `https://a.espncdn.com/i/teamlogos/nfl/500/${(localOpp?.slug || "nfl")}.png`,
        color: localOpp?.color || "#4b5563",
        record: oppRecord,
        winProjection: oppProjection,
        moneyline: oppMoneyline,
        impliedWinPct: oppImplied,
        spread: !isHome ? (pick?.spread ? `${pick.spread}` : undefined) : undefined,
      },
      overUnder,
      spreadDetails,
      favoriteTeamId: pick?.homeTeamOdds?.favorite ? homeComp.id : pick?.awayTeamOdds?.favorite ? awayComp.id : undefined,
      providerName,
      hasOdds: !!pick,
      hasPredictor: teamProjection !== undefined && oppProjection !== undefined,
    };
  } catch (err) {
    console.error("fetchGameMatchup error:", err);
    return null;
  }
}

export async function fetchTeamNews(team: NFLTeam): Promise<NewsArticle[]> {
  const articles: NewsArticle[] = [];
  const seenTitles = new Set<string>();

  // 1. Fetch ESPN NFL News
  try {
    const espnRes = await fetch(
      "https://site.api.espn.com/apis/site/v2/sports/football/nfl/news?limit=50",
      { next: { revalidate: 600 } } // 10 minutes cache
    );

    if (espnRes.ok) {
      const data = await espnRes.json();
      const rawArticles = data.articles || [];

      const teamTerms = [
        team.displayName.toLowerCase(),
        team.name.toLowerCase(),
        team.abbreviation.toLowerCase(),
      ];

      for (const a of rawArticles) {
        const headlineLower = (a.headline || "").toLowerCase();
        const descLower = (a.description || "").toLowerCase();
        const categories = a.categories || [];

        const isRelated =
          categories.some(
            (c: any) =>
              c.teamId === team.id ||
              c.description?.toLowerCase().includes(team.name.toLowerCase())
          ) ||
          teamTerms.some(
            (term) => headlineLower.includes(term) || descLower.includes(term)
          );

        if (isRelated && a.headline) {
          const title = a.headline.trim();
          const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (!seenTitles.has(normTitle)) {
            seenTitles.add(normTitle);
            articles.push({
              id: `espn-${a.id || Math.random().toString(36).substring(7)}`,
              title,
              description: a.description || "",
              link: a.links?.web?.href || `https://www.espn.com/nfl/team/_/name/${team.slug}`,
              source: "ESPN NFL",
              published: a.published || new Date().toISOString(),
              relativeTime: timeAgo(a.published),
              imageUrl: a.images?.[0]?.url,
              isOfficial: true,
            });
          }
        }
      }
    }
  } catch (e) {
    console.warn("ESPN news fetch warning:", e);
  }

  // 2. Fetch Google News RSS for team
  try {
    const query = encodeURIComponent(`${team.displayName} NFL`);
    const rssUrl = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
    const rssRes = await fetch(rssUrl, { next: { revalidate: 600 } });

    if (rssRes.ok) {
      const xml = await rssRes.text();
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
      });
      const parsed = parser.parse(xml);
      const items = parsed.rss?.channel?.item || [];
      const itemArray = Array.isArray(items) ? items : [items];

      for (const item of itemArray) {
        if (!item || !item.title) continue;

        let rawTitle = String(item.title);
        let sourceName = "NFL News";

        if (typeof item.source === "object" && item.source?.["#text"]) {
          sourceName = item.source["#text"];
        } else if (typeof item.source === "string") {
          sourceName = item.source;
        } else if (rawTitle.includes(" - ")) {
          const parts = rawTitle.split(" - ");
          sourceName = parts[parts.length - 1];
          rawTitle = parts.slice(0, -1).join(" - ");
        }

        const normTitle = rawTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!seenTitles.has(normTitle)) {
          seenTitles.add(normTitle);
          articles.push({
            id: `gn-${Math.random().toString(36).substring(7)}`,
            title: rawTitle,
            description: "",
            link: item.link,
            source: sourceName,
            published: item.pubDate || new Date().toISOString(),
            relativeTime: timeAgo(item.pubDate),
            isOfficial: false,
          });
        }
      }
    }
  } catch (e) {
    console.warn("Google News RSS warning:", e);
  }

  // Sort descending by date
  return articles.sort((a, b) => {
    const timeA = new Date(a.published).getTime() || 0;
    const timeB = new Date(b.published).getTime() || 0;
    return timeB - timeA;
  });
}
