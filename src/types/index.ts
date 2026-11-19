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
  winProbability?: number; // Projected win probability %
  projectedSpread?: string;
}

export interface TeamRecordData {
  summary: string;
  standing: string;
  homeRecord?: string;
  awayRecord?: string;
  divisionRecord?: string;
}

export interface TeamScheduleResult {
  record: TeamRecordData;
  games: ScheduleGame[];
  nextGameId: string | null;
}

export interface TeamDivisionStats {
  teamId: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  logo: string;
  color: string;
  slug: string;
  rank: number;
  conference: "AFC" | "NFC";
  division: "East" | "North" | "South" | "West";
  wins: number;
  losses: number;
  ties: number;
  winPct: number;
  streak: string;
  pointsFor: number;
  pointsAgainst: number;
  differential: string;
  divRecord: string;
  confRecord: string;
  homeRecord: string;
  roadRecord: string;
  gamesBehind: string;
  seed?: string;
}

export interface DivisionStandingsGroup {
  name: string; // e.g. "NFC North"
  conference: "AFC" | "NFC";
  division: string;
  teams: TeamDivisionStats[];
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
    winProjection?: number;
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

export interface PlayerLeader {
  category: "passing" | "rushing" | "receiving" | "defense";
  categoryLabel: string;
  athleteId: string;
  fullName: string;
  jersey?: string;
  position: string;
  headshot?: string;
  statLine: string;
}

export interface PlayerInjury {
  id: string;
  fullName: string;
  position: string;
  jersey?: string;
  headshot?: string;
  status: string; // "Questionable", "Doubtful", "Out", "Injured Reserve", "Day-To-Day"
  details?: string;
}

export interface TeamPersonnelData {
  leaders: PlayerLeader[];
  injuries: PlayerInjury[];
}

export interface TeamStatMetric {
  name: string;
  label: string;
  value: string;
  rankDisplay?: string;
  rank?: number;
}

export interface TeamSeasonStats {
  summary: {
    label: string;
    value: string;
    rankDisplay?: string;
    subtext?: string;
  }[];
  passing: TeamStatMetric[];
  rushing: TeamStatMetric[];
  defense: TeamStatMetric[];
  situational: TeamStatMetric[];
}
