import type { SearchHistoryData } from "../api/types";

const CURRENT_PLAYER_KEY = "cade-o-dano:current-player";
const CURRENT_PLAYER_HISTORY_KEY = "cade-o-dano:current-player-history";
const SEARCHED_PLAYERS_KEY = "cade-o-dano:searched-players";

export type StoredPlayer = {
    profileIconUrl: string;
    nick: string;
    tag: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function hasStringFields(value: Record<string, unknown>, fields: string[]) {
    return fields.every((field) => typeof value[field] === "string");
}

function hasNonEmptyStringFields(value: Record<string, unknown>, fields: string[]) {
    return fields.every((field) => {
        const fieldValue = value[field];
        return typeof fieldValue === "string" && fieldValue.trim().length > 0;
    });
}

function hasArrayFields(value: Record<string, unknown>, fields: string[]) {
    return fields.every((field) => Array.isArray(value[field]));
}

function hasStringOrNumberField(value: Record<string, unknown>, field: string) {
    return typeof value[field] === "string" || typeof value[field] === "number";
}

function isStoredPlayer(value: unknown): value is StoredPlayer {
    return isRecord(value)
        && hasStringFields(value, ["profileIconUrl"])
        && hasNonEmptyStringFields(value, ["nick", "tag"]);
}

function isSearchHistoryData(value: unknown): value is SearchHistoryData {
    if (!isRecord(value)) return false;

    const { profile, rankedStats, matches, performanceSummary } = value;

    return isRecord(profile)
        && hasNonEmptyStringFields(profile, ["puuid", "summonerName"])
        && hasStringFields(profile, ["profileIconUrl"])
        && hasStringOrNumberField(profile, "summonerLevel")
        && isRecord(rankedStats)
        && hasArrayFields(rankedStats, ["elos"])
        && isRecord(matches)
        && hasArrayFields(matches, ["recentMatches"])
        && isRecord(performanceSummary)
        && hasArrayFields(performanceSummary, [
            "mostPlayedChampions",
            "highestDamageChampions",
        ]);
}

function parseStoredValue<T>(
    key: string,
    isValid: (value: unknown) => value is T,
): T | null {
    const storedValue = localStorage.getItem(key);

    if (!storedValue) return null;

    try {
        const parsedValue: unknown = JSON.parse(storedValue);
        return isValid(parsedValue) ? parsedValue : null;
    } catch {
        return null;
    }
}

export function saveCurrentPlayer(player: StoredPlayer) {
    localStorage.setItem(CURRENT_PLAYER_KEY, JSON.stringify(player));
}

export function getCurrentPlayer(): StoredPlayer | null {
    const storedPlayer = parseStoredValue(CURRENT_PLAYER_KEY, isStoredPlayer);

    if (!storedPlayer) {
        clearCurrentPlayer();
        return null;
    }

    return storedPlayer;
}

export function clearCurrentPlayer() {
    localStorage.removeItem(CURRENT_PLAYER_KEY);
    localStorage.removeItem(CURRENT_PLAYER_HISTORY_KEY);
}

export function saveCurrentPlayerHistory(history: SearchHistoryData) {
    localStorage.setItem(CURRENT_PLAYER_HISTORY_KEY, JSON.stringify(history));
}

export function getCurrentPlayerHistory(): SearchHistoryData | null {
    const storedHistory = parseStoredValue(CURRENT_PLAYER_HISTORY_KEY, isSearchHistoryData);

    if (!storedHistory) {
        clearCurrentPlayer();
        return null;
    }

    return storedHistory;
}

export function saveSearchedPlayer(player: StoredPlayer) {
    const storedPlayers = getSearchedPlayers();

    const filteredPlayers = storedPlayers.filter(
        (storedPlayer) =>
            storedPlayer.nick !== player.nick || storedPlayer.tag !== player.tag
    );

    const updatedPlayers = [player, ...filteredPlayers];

    localStorage.setItem(SEARCHED_PLAYERS_KEY, JSON.stringify(updatedPlayers));
}

export function removeSearchedPlayer(nick: string, tag: string) {
    const updatedPlayers = getSearchedPlayers().filter(
        (storedPlayer) =>
            storedPlayer.nick !== nick || storedPlayer.tag !== tag
    );

    if (updatedPlayers.length === 0) {
        localStorage.removeItem(SEARCHED_PLAYERS_KEY);
        return;
    }

    localStorage.setItem(SEARCHED_PLAYERS_KEY, JSON.stringify(updatedPlayers));
}

export function getSearchedPlayers(): StoredPlayer[] {
    const storedPlayers = parseStoredValue(
        SEARCHED_PLAYERS_KEY,
        (value): value is StoredPlayer[] => Array.isArray(value) && value.every(isStoredPlayer)
    );

    if (!storedPlayers) {
        localStorage.removeItem(SEARCHED_PLAYERS_KEY);
        return [];
    }

    return storedPlayers;
}
