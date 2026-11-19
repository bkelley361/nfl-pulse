export interface NFLTeam {
  id: string;
  slug: string;
  abbreviation: string;
  name: string;
  displayName: string;
  shortDisplayName: string;
  location: string;
  conference: "AFC" | "NFC";
  division: "East" | "North" | "South" | "West";
  color: string;
  alternateColor: string;
  logo: string;
}

export interface OpponentInfo {
  id: string;
  name: string;
  displayName: string;
  abbreviation: string;
  logo: string;
  record?: string;
  color?: string;
}

export interface ScheduleGame {
  id: string;
  week: string;
  weekNumber: number;
  seasonType: number; // 2 = regular season, 3 = postseason
  date: string;
  shortDate: string;
  name: string;
  shortName: string;
  isHome: boolean;
  completed: boolean;
  isLive: boolean;
  state: "pre" | "in" | "post";
  statusDetail: string;
  venue: {
    fullName: string;
    city: string;
    state?: string;
  };
  broadcast?: string;
  opponent: OpponentInfo;
  teamScore?: number;
  opponentScore?: number;
  isWin?: boolean;
  isTie?: boolean;
}

export interface TeamRecordData {
  summary: string;
  standing: string;
  homeRecord?: string;
  awayRecord?: string;
  divisionRecord?: string;
}

export interface MatchupPredictorData {
  gameId: string;
  gameDate: string;
  weekText: string;
  venueName: string;
  broadcast?: string;
  isHome: boolean;
  team: {
    id: string;
    name: string;
    displayName: string;
    shortDisplayName?: string;
    abbreviation: string;
    logo: string;
    color: string;
    record: string;
    winProjection?: number; // ESPN FPI %
    moneyline?: number;
    impliedWinPct?: number; // Vig-free implied probability %
    spread?: string;
  };
  opponent: {
    id: string;
    name: string;
    displayName: string;
    shortDisplayName?: string;
    abbreviation: string;
    logo: string;
    color: string;
    record: string;
    winProjection?: number; // ESPN FPI %
    moneyline?: number;
    impliedWinPct?: number;
    spread?: string;
  };
  overUnder?: number;
  spreadDetails?: string;
  favoriteTeamId?: string;
  providerName?: string;
  hasOdds: boolean;
  hasPredictor: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  source: string;
  published: string;
  relativeTime: string;
  imageUrl?: string;
  isOfficial?: boolean;
}
