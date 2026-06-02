import type {
  SearchActiveMatchApiResponse,
  SearchActiveMatchResponse,
  SearchHistoryApiResponse,
  SearchHistoryResponse,
  SearchMatchApiResponse,
  SearchMatchResponse,
} from "./types";

const DEFAULT_BASE_URL = "https://cadeodanobackend.livelywater-5b3a910a.eastus.azurecontainerapps.io/";
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE_URL;

async function fetchEndpoint<TResponse>(endpoint: string, requestLabel: string): Promise<TResponse> {
  const apiRequestUrl = `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const res = await fetch(apiRequestUrl);

  if (!res.ok) {
    throw new Error(`Erro ao buscar ${requestLabel}: ${res.status}`);
  }

  return res.json();
}

export const buscarHistorico = (
  nick: string,
  tag: string,
): Promise<SearchHistoryResponse> => {
  const historyRequestUrl = `search/${encodeURIComponent(nick)}/${encodeURIComponent(tag)}?count=100`;

  return fetchEndpoint<SearchHistoryApiResponse>(historyRequestUrl, "historico");
};

export const buscarMatch = (
  matchId: string,
  puuid: string,
): Promise<SearchMatchResponse> => {
  const matchRequestUrl = `match/${matchId}?puuid=${puuid}`;

  return fetchEndpoint<SearchMatchApiResponse>(matchRequestUrl, "detalhes da partida");
};

export const buscarActiveMatch = (
  puuid: string,
): Promise<SearchActiveMatchResponse> => {
  const matchRequestUrl = `match/activematch?puuid=${puuid}`;

  return fetchEndpoint<SearchActiveMatchApiResponse>(matchRequestUrl, "partida ativa");
};
