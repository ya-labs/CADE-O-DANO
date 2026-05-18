/* REACT */
import { useEffect, useState } from "react";

/* SERVICES */
import { buscarHistorico, buscarMatch } from "../services/api/riotApi";

/* TIPOS */
import type { MatchDetail } from "../types/matchDetail";
import type { SearchHistoryData } from "../services/api/types";

/* HOOKS */
import useRequestState from "../hooks/useRequestState";

/* COMPONENTES */
import LoginPage from "../features/login/components/LoginPage";
import HistoryPage from "../features/history/components/HistoryPage";
import DetailsPage from "../features/match-details/components/DetailsPage";
import AppLayout from "../shared/components/AppLayout";
import PlayerSidebar from "../shared/components/PlayerSidebar";

/* STORAGE */
import { 
    clearCurrentPlayer,
    getCurrentPlayer, 
    getCurrentPlayerHistory,
    getSearchedPlayers, 
    removeSearchedPlayer,
    saveCurrentPlayer, 
    saveCurrentPlayerHistory,
    saveSearchedPlayer, 
    type StoredPlayer 
} from "../services/storage/playerStorage";

type Screen = "login" | "historico" | "detalhes";

function AppFlow () {
    const [playerData, setPlayerData] = useState<SearchHistoryData | null>(() => getCurrentPlayerHistory());
    const [matchDetails, setMatchDetails] = useState<MatchDetail | null>(null);

    const [screen, setScreen] = useState<Screen>(() => playerData ? "historico" : "login");

    const [searchedPlayers, setSearchedPlayers] = useState<StoredPlayer[]>([]);

    const historyRequest = useRequestState();
    const participantRequest = useRequestState();
    const matchRequest = useRequestState();
    
    const playerProfile = playerData?.profile;
    const rankedStats = playerData?.rankedStats;
    const playerMatches = playerData?.matches;
    const performanceSummary = playerData?.performanceSummary;

    useEffect(() => {
        setSearchedPlayers(getSearchedPlayers());

        const storedPlayer = getCurrentPlayer();

        if (!storedPlayer) return;

        handleSearchHistory(storedPlayer.nick, storedPlayer.tag);
    }, []);

    async function handleSearchHistory(
        nick: string | null,
        tag: string | null,
    ) {
        if (!nick || !tag) return;

        setMatchDetails(null);
        participantRequest.clearError();
        matchRequest.clearError();

        const response = await historyRequest.run(() =>
            buscarHistorico(nick, tag)
        );

        if (!response) return;

        setPlayerData(response.data);
        saveCurrentPlayerHistory(response.data);

        const icon = response.data.profile.profileIconUrl;

        const searchedPlayer = { profileIconUrl: icon, nick, tag };

        saveCurrentPlayer(searchedPlayer);
        saveSearchedPlayer(searchedPlayer);
        setSearchedPlayers(getSearchedPlayers());

        setScreen("historico");
    };

    async function handleSearchParticipant(
        nick: string | null,
        tag: string | null,
    ) {
        if (!nick || !tag) return;

        const response = await participantRequest.run(() =>
            buscarHistorico(nick, tag)
        );

        if (!response) return;

        setMatchDetails(null);
        setPlayerData(response.data);
        saveCurrentPlayerHistory(response.data);

        const icon = response.data.profile.profileIconUrl;

        const searchedPlayer = { profileIconUrl: icon, nick, tag };

        saveCurrentPlayer(searchedPlayer);
        saveSearchedPlayer(searchedPlayer);
        setSearchedPlayers(getSearchedPlayers());

        setScreen("historico");
    };

    async function handleSelectMatch(matchId: string) {
        historyRequest.clearError();
        participantRequest.clearError();
        
        if (!playerProfile?.puuid) return;

        const response = await matchRequest.run(() =>
            buscarMatch(matchId, playerProfile.puuid)
        );

        if (!response) return;

        setMatchDetails(response.data);

        setScreen("detalhes");
    };

    async function handleRefreshHistory() {
        const storedPlayer = getCurrentPlayer();

        await handleSearchHistory(
            storedPlayer?.nick || null,
            storedPlayer?.tag || null,
        );
    }

    function handleBackToLogin() {
        setPlayerData(null);
        setMatchDetails(null);
        clearCurrentPlayer();
        setScreen("login");
    }

    function handleRemoveSearchedPlayer(nick: string, tag: string) {
        removeSearchedPlayer(nick, tag);
        setSearchedPlayers(getSearchedPlayers());
    }

    const playerSidebar = playerProfile && rankedStats && performanceSummary ? (
        <PlayerSidebar
            summonerName={playerProfile.summonerName}
            summonerLevel={playerProfile.summonerLevel}
            profileIconUrl={playerProfile.profileIconUrl}
            summonerElos={rankedStats.elos}
        />
    ) : undefined;

    return (
        <div>
            {screen === "login" && (
                <LoginPage
                    onSearch={handleSearchHistory}
                    historyError={historyRequest.error}
                    loading={historyRequest.loading}
                    searchedPlayers={searchedPlayers}
                    onRemoveSearchedPlayer={handleRemoveSearchedPlayer}
                />
            )}
            {screen === "historico" && (
                <AppLayout sidebar={playerSidebar}>
                    <HistoryPage
                        onBack={handleBackToLogin}
                        onRefresh={handleRefreshHistory}
                        matches={playerMatches?.recentMatches || []}
                        isRefreshingHistory={historyRequest.loading}
                        isLoadingMatchDetails={matchRequest.loading}
                        matchError={matchRequest.error}
                        onSelectMatch={handleSelectMatch}
                        mostPlayedChampions={performanceSummary?.mostPlayedChampions || []}
                        highestDamageChampions={performanceSummary?.highestDamageChampions || []}
                    />
                </AppLayout>
            )}
            {screen === "detalhes" && (
                <AppLayout sidebar={playerSidebar}>
                    <DetailsPage
                        onBack={() => setScreen("historico")}
                        matchDetails={matchDetails}
                        handleSearchParticipant={handleSearchParticipant}
                        isSearchingParticipant={participantRequest.loading}
                        searchError={participantRequest.error}
                    />
                </AppLayout>
            )}
        </div>
    );
};

export default AppFlow;
