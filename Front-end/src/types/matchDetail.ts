import type { SummonerElo } from "../services/api/types";

type PerkRune = {
    name: string;
    shortDescription?: string;
    shortDesc?: string;
    iconUrl: string;
};

type RuneTree = {
    name: string;
    iconUrl: string;
};

export type Runes = {
    primaryTree?: RuneTree;
    secondaryTree?: RuneTree;
    primaryPerkRunes?: PerkRune[];
    secondaryPerkRunes?: PerkRune[];
    keystone?: PerkRune;
    primaryStyle?: RuneTree;
    secondaryStyle?: RuneTree;
};

type ParticipantKda = {
    kills: number;
    deaths: number;
    assists: number;
    killParticipation: string;
    cs: number;
    csPerMinute: number;
};

type ChampionProps = {
    championIconUrl: string | null;
    championSplashArtUrl: string | null;
    championName: string | null;
    champLevel: number;
};

type PlayerInfo = {
    summonerName: string | null;
    summonerHashtag: string | null;
};

export type Participant = ParticipantKda & ChampionProps & PlayerInfo & {
    totalDamage: number;
    isSearchedPlayer: boolean;
    teamId: number;
    itemIconUrls: string[];
    summonerElos?: SummonerElo[];
    runes: Runes | null;
    win?: boolean;
};

type MatchTeam = {
    teamId: number;
    totalTeamKills: number;
    totalTeamDeaths: number;
    totalTeamAssists: number;
    participants: Participant[];
};

type ActiveMatchBan = {
    championName: string | null;
    championIconUrl: string | null;
};

export type ActiveMatchParticipant = PlayerInfo & {
    puuid: string | null;
    riotId: string | null;
    teamId: number;
    championIconUrl: string;
    championSplashArtUrl: string;
    championName: string | null;
    champLevel?: number;
    spell1Name: string | null;
    spell1IconUrl: string;
    spell2Name: string | null;
    spell2IconUrl: string;
    perks: Runes | null;
};

export type ActiveMatchTeam = {
    teamId: number;
    participants: ActiveMatchParticipant[];
    bans: ActiveMatchBan[];
};

type MatchMetadata = {  
    queueType: string;
    gameStartDate?: string;
    gameDuration?: string | number;
};

export type MatchDetail = MatchMetadata & {
    matchId: string;
    totalKills?: number;
    playerWin: boolean;
    teams: MatchTeam[];
};

export type ActiveMatchDetail = MatchMetadata & {
    gameQueueName: number;
    gameStartTime: string;
    teams: ActiveMatchTeam[];
};
