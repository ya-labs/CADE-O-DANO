type PlayerKda = {
    kills: number;
    deaths: number;
    assists: number;
};

type ChampionProps = {
    championName: string;
    championIconUrl: string;
    champLevel: number;
};

export type MatchSummary = PlayerKda & ChampionProps & {
    matchId: string;
    queueType: string;
    totalDamage: number;
    gameStartTimestamp: string;
    result: 0 | 1 | 2;
    itemIconUrls: string[];
};
