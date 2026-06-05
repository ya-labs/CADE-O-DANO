import type { MatchSummary } from "../../types/match";
import type { ActiveMatchDetail, MatchDetail } from "../../types/matchDetail";

export type MostPlayedChampion = {
    championName: string;
    championIconUrl: string;
    gamesPlayed: number;
}

export type HighestDamageChampion = {
    championName: string;
    championIconUrl: string;
    highestDamage: number;
}

type EloResultInfo = {
    wins: number;
    losses: number;
    winRate: string;
}

type EloRankInfo = {
    tier: string;
    rank: string;
    leaguePoints: number;
}

export type SummonerElo = EloResultInfo & EloRankInfo & {
    queueType: string;
    leagueIconUrl: string;
}

type PlayerProfile = {
    puuid: string;
    summonerName: string;
    profileIconUrl: string;
    summonerLevel: string | number;
};

type PlayerRankedStats = {
    elos: SummonerElo[];
};

type PlayerMatches = {
    recentMatches: MatchSummary[];
    activeMatch?: ActiveMatchDetail | null;
};

type PlayerPerformanceSummary = {
    mostPlayedChampions: MostPlayedChampion[];
    highestDamageChampions: HighestDamageChampion[]; 
}

export type Mastery = {
    masteryIconUrl: string;
    championName: string;
    championIconUrl: string;
    championLevel: number;
    lastPlayTime: number;
}

export type SearchHistoryApiData = {
    profile: PlayerProfile;
    rankedStats: PlayerRankedStats;
    matches: PlayerMatches;
    performanceSummary: PlayerPerformanceSummary;
    masteries: Mastery[];
};

export type SearchHistoryApiResponse = {
    data: SearchHistoryApiData;
};

export type SearchMatchApiResponse = {
    data: MatchDetail;
};

export type SearchActiveMatchApiResponse = {
    data: ActiveMatchDetail | null;
};

export type SearchHistoryData = SearchHistoryApiData;
export type SearchHistoryResponse = SearchHistoryApiResponse;
export type SearchMatchResponse = SearchMatchApiResponse;
export type SearchActiveMatchResponse = SearchActiveMatchApiResponse;
