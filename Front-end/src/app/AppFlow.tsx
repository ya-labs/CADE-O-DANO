/* REACT */
import { useEffect, useState } from "react";

/* SERVICES */
import { buscarHistorico, buscarMatch, buscarActiveMatch } from "../services/api/riotApi";

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
import MasteryPage from "../features/mastery/components/MasteryPage";

type Screen = "login" | "historico" | "detalhes" | "maestrias";

function AppFlow () {
    const [playerData, setPlayerData] = useState<SearchHistoryData | null>(() => getCurrentPlayerHistory());
    const [matchDetails, setMatchDetails] = useState<MatchDetail | null>(null);

    const [screen, setScreen] = useState<Screen>(() => playerData ? "historico" : "login");

    const [searchedPlayers, setSearchedPlayers] = useState<StoredPlayer[]>(() => getSearchedPlayers());

    const historyRequest = useRequestState();
    const participantRequest = useRequestState();
    const matchRequest = useRequestState();
    const activeMatchRequest = useRequestState();
    
    const playerProfile = playerData?.profile;
    const rankedStats = playerData?.rankedStats;
    const playerMatches = playerData?.matches;
    const playerMasteries = playerData?.masteries;
    const performanceSummary = playerData?.performanceSummary;

    useEffect(() => {
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
        activeMatchRequest.clearError();

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

        void handleSearchActiveMatch(response.data.profile.puuid, response.data);
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

        void handleSearchActiveMatch(response.data.profile.puuid, response.data);
    };

    async function handleSelectMatch(matchId: string) {
        historyRequest.clearError();
        participantRequest.clearError();
        activeMatchRequest.clearError();
        
        if (!playerProfile?.puuid) return;

        const response = await matchRequest.run(() =>
            buscarMatch(matchId, playerProfile.puuid)
        );

        if (!response) return;

        setMatchDetails(response.data);

        setScreen("detalhes");
    };

    async function handleSearchActiveMatch(
        puuid = playerProfile?.puuid,
        historyData: SearchHistoryData | null = null
    ) {
        historyRequest.clearError();
        participantRequest.clearError();
        matchRequest.clearError();
        
        if (!puuid) return;

        const response = await activeMatchRequest.run(() =>
            buscarActiveMatch(puuid)
        );

        if (!response) return;

        setPlayerData((currentPlayerData) => {
            if (currentPlayerData && currentPlayerData.profile.puuid !== puuid) {
                return currentPlayerData;
            }

            const basePlayerData = currentPlayerData ?? historyData;

            if (!basePlayerData) return currentPlayerData;

            const updatedPlayerData: SearchHistoryData = {
                ...basePlayerData,
                matches: {
                    ...basePlayerData.matches,
                    activeMatch: response.data,
                },
            };

            saveCurrentPlayerHistory(updatedPlayerData);
            return updatedPlayerData;
        });
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
                        onShowMasteries={()=> setScreen("maestrias")}
                        onRefreshHistory={handleRefreshHistory}
                        onRefreshActiveMatch={handleSearchActiveMatch}
                        activeMatch={playerMatches?.activeMatch || null}
                        searchedPlayerPuuid={playerProfile?.puuid || null}
                        matches={playerMatches?.recentMatches || []}
                        mastery={playerMasteries?.[0] || null}
                        onSearchParticipant={handleSearchParticipant}
                        isRefreshingHistory={historyRequest.loading}
                        isSearchingParticipant={participantRequest.loading}
                        isRefreshingActiveMatch={activeMatchRequest.loading}
                        activeMatchError={activeMatchRequest.error}
                        isLoadingMatchDetails={matchRequest.loading}
                        matchError={matchRequest.error}
                        onSelectMatch={handleSelectMatch}
                        mostPlayedChampions={performanceSummary?.mostPlayedChampions || []}
                        highestDamageChampions={performanceSummary?.highestDamageChampions || []}
                    />
                </AppLayout>
            )}
            {screen === "maestrias" && (
                <AppLayout sidebar={playerSidebar}>
                    <MasteryPage
                        onBack={() => setScreen("historico")}
                        masteries={playerMasteries || []}
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
