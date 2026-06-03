import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, RefreshCw, Search, ShieldBan, Swords } from "lucide-react";
import type { MatchSummary } from "../../../types/match";
import type { HighestDamageChampion, Mastery, MostPlayedChampion } from "../../../services/api/types";
import BackButton from "../../../shared/components/BackButton";
import FloatingAlert from "../../../shared/components/FloatingAlert";
import RemoteImage from "../../../shared/components/RemoteImage";
import MatchCard from "./MatchCard";
import type { ActiveMatchDetail, ActiveMatchParticipant, ActiveMatchTeam } from "../../../types/matchDetail";

type Props = {
    onBack: () => void;
    onShowMasteries: () => void;
    onRefreshHistory: () => Promise<void>;
    onRefreshActiveMatch: () => Promise<void>;
    activeMatch: ActiveMatchDetail | null;
    searchedPlayerPuuid: string | null;
    matches: MatchSummary[];
    mastery: Mastery | null;
    onSelectMatch: (matchId: string) => Promise<void>;
    onSearchParticipant: (nick: string, tag: string) => Promise<void>;
    isLoadingMatchDetails: boolean;
    isRefreshingHistory: boolean;
    isSearchingParticipant: boolean;
    isRefreshingActiveMatch: boolean;
    matchError: string;
    activeMatchError: string;
    mostPlayedChampions: MostPlayedChampion[];
    highestDamageChampions: HighestDamageChampion[];
};

function formatLastPlayTime(lastPlayTime: number) {
    if (lastPlayTime <= 0) return "Hoje";
    if (lastPlayTime === 1) return "1 dia";

    return `${lastPlayTime} dias`;
}

function getActiveTeamLabel(teamId: number) {
    if (teamId === 100) return "Time azul";
    if (teamId === 200) return "Time vermelho";

    return `Time ${teamId}`;
}

function getActiveParticipantName(participant: ActiveMatchParticipant) {
    return participant.riotId
        || (participant.summonerName && participant.summonerHashtag
            ? `${participant.summonerName}#${participant.summonerHashtag}`
            : participant.summonerName)
        || "Jogador desconhecido";
}

function getParticipantSearchParams(participant: ActiveMatchParticipant) {
    if (participant.summonerName && participant.summonerHashtag) {
        return {
            nick: participant.summonerName,
            tag: participant.summonerHashtag,
        };
    }

    const [nick, tag] = participant.riotId?.split("#") ?? [];

    if (!nick || !tag) return null;

    return { nick, tag };
}

function findActivePlayer(activeMatch: ActiveMatchDetail, searchedPlayerPuuid: string | null) {
    const participants = activeMatch.teams.flatMap((team) => team.participants);

    return participants.find((participant) => participant.puuid === searchedPlayerPuuid)
        ?? participants[0]
        ?? null;
}

function ActiveMatchParticipantRow({
    participant,
    isSelected = false,
    onSearchParticipant,
}: {
    participant: ActiveMatchParticipant;
    isSelected?: boolean;
    onSearchParticipant: (nick: string, tag: string) => Promise<void>;
}) {
    const championName = participant.championName ?? "Campeão desconhecido";
    const primaryTree = participant.perks?.primaryTree ?? participant.perks?.primaryStyle;
    const keystone = participant.perks?.primaryPerkRunes?.[0] ?? participant.perks?.keystone;
    const searchParams = getParticipantSearchParams(participant);
    const participantName = getActiveParticipantName(participant);
    const participantClassName = [
        "active-match-participant",
        isSelected ? "active-match-participant--selected" : "",
        !searchParams ? "active-match-participant--unavailable" : "",
    ].filter(Boolean).join(" ");

    return (
        <li className={participantClassName}>
            <button
                type="button"
                className="active-match-participant__button"
                onClick={() => searchParams && onSearchParticipant(searchParams.nick, searchParams.tag)}
                disabled={!searchParams}
                aria-label={searchParams ? `Pesquisar jogador ${participantName}` : participantName}
            >
                <RemoteImage
                    className="active-match-participant__champion"
                    src={participant.championIconUrl}
                    alt={`Ícone do campeão ${championName}`}
                />

                <div className="active-match-participant__info">
                    <strong>{participantName}</strong>
                    <span>{championName}</span>
                </div>

                <div className="active-match-participant__spells" aria-label="Feitiços de invocador">
                    <RemoteImage
                        className="active-match-participant__spell"
                        src={participant.spell1IconUrl}
                        alt={participant.spell1Name ?? "Feitiço 1"}
                    />
                    <RemoteImage
                        className="active-match-participant__spell"
                        src={participant.spell2IconUrl}
                        alt={participant.spell2Name ?? "Feitiço 2"}
                    />
                </div>

                <div className="active-match-participant__runes" aria-label="Runas principais">
                    {keystone?.iconUrl && (
                        <RemoteImage
                            className="active-match-participant__rune"
                            src={keystone.iconUrl}
                            alt={keystone.name}
                        />
                    )}

                    {primaryTree?.iconUrl && (
                        <RemoteImage
                            className="active-match-participant__rune active-match-participant__rune--tree"
                            src={primaryTree.iconUrl}
                            alt={primaryTree.name}
                        />
                    )}
                </div>
            </button>

            {!searchParams && (
                <span className="active-match-participant__tooltip" role="tooltip">
                    Jogador sem Riot ID disponível
                </span>
            )}
        </li>
    );
}

function ActiveMatchTeamColumn({
    team,
    searchedPlayerPuuid,
    onSearchParticipant,
}: {
    team: ActiveMatchTeam;
    searchedPlayerPuuid: string | null;
    onSearchParticipant: (nick: string, tag: string) => Promise<void>;
}) {
    return (
        <section className="active-match-team" aria-label={getActiveTeamLabel(team.teamId)}>
            <header className="active-match-team__header">
                <strong>{getActiveTeamLabel(team.teamId)}</strong>
                <span>{team.participants.length} jogadores</span>
            </header>

            <ul className="active-match-team__participants">
                {team.participants.map((participant) => (
                    <ActiveMatchParticipantRow
                        key={participant.puuid ?? `${participant.teamId}-${participant.riotId}-${participant.championName}`}
                        participant={participant}
                        isSelected={participant.puuid === searchedPlayerPuuid}
                        onSearchParticipant={onSearchParticipant}
                    />
                ))}
            </ul>

            {team.bans.length > 0 && (
                <div className="active-match-team__bans" aria-label="Campeões banidos">
                    <span>
                        <ShieldBan size={14} strokeWidth={2.4} aria-hidden="true" />
                        Bans
                    </span>

                    <div className="active-match-team__ban-list">
                        {team.bans.map((ban, index) => (
                            ban.championIconUrl ? (
                                <RemoteImage
                                    key={`${ban.championName}-${index}`}
                                    className="active-match-team__ban-icon"
                                    src={ban.championIconUrl}
                                    alt={ban.championName ?? "Campeão banido"}
                                />
                            ) : (
                                <span
                                    key={`empty-ban-${index}`}
                                    className="active-match-team__empty-ban"
                                    aria-label="Ban não informado"
                                />
                            )
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

function ActiveMatchCard({
    activeMatch,
    searchedPlayerPuuid,
    isRefreshingActiveMatch,
    onRefreshActiveMatch,
    onSearchParticipant,
}: {
    activeMatch: ActiveMatchDetail;
    searchedPlayerPuuid: string | null;
    isRefreshingActiveMatch: boolean;
    onRefreshActiveMatch: () => Promise<void>;
    onSearchParticipant: (nick: string, tag: string) => Promise<void>;
}) {
    const [isExpanded, setIsExpanded] = useState(false);
    const activePlayer = findActivePlayer(activeMatch, searchedPlayerPuuid);
    const activePlayerTeamLabel = activePlayer ? getActiveTeamLabel(activePlayer.teamId) : "";

    return (
        <article className={isExpanded ? "active-match-card active-match-card--expanded" : "active-match-card"}>
            <header className="active-match-card__header">
                <div className="active-match-card__title">
                    <p className="active-match-card__eyebrow">
                        <Swords size={16} strokeWidth={2.4} aria-hidden="true" />
                        Partida ativa
                    </p>
                    <h2>{activeMatch.queueType}</h2>
                </div>

                <div className="active-match-card__meta">
                    <span>
                        <Clock size={15} strokeWidth={2.4} aria-hidden="true" />
                        Início: {activeMatch.gameStartTime}
                    </span>
                </div>

                <div className="active-match-card__actions">
                    <button
                        type="button"
                        className="active-match-card__toggle"
                        onClick={() => setIsExpanded((currentValue) => !currentValue)}
                        aria-expanded={isExpanded}
                        aria-controls="active-match-details"
                        title={isExpanded ? "Ocultar participantes" : "Ver participantes"}
                    >
                        <ChevronDown size={19} strokeWidth={2.4} aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className={isRefreshingActiveMatch ? "history-page__refresh-button is-loading" : "history-page__refresh-button"}
                        onClick={onRefreshActiveMatch}
                        disabled={isRefreshingActiveMatch}
                        aria-label="Atualizar partida ativa"
                        title="Atualizar partida ativa"
                    >
                        <RefreshCw size={20} strokeWidth={2.4} aria-hidden="true" />
                    </button>
                </div>
            </header>

            {activePlayer && (
                <div className="active-match-card__summary">
                    <div>
                        <span>Jogador</span>
                        <strong>{activePlayerTeamLabel}</strong>
                    </div>

                    <ul className="active-match-card__player">
                        <ActiveMatchParticipantRow
                            participant={activePlayer}
                            isSelected
                            onSearchParticipant={onSearchParticipant}
                        />
                    </ul>
                </div>
            )}

            {isExpanded && (
                <div className="active-match-card__details" id="active-match-details">
                    <div className="active-match-card__teams">
                        {activeMatch.teams.map((team) => (
                            <ActiveMatchTeamColumn
                                key={team.teamId}
                                team={team}
                                searchedPlayerPuuid={searchedPlayerPuuid}
                                onSearchParticipant={onSearchParticipant}
                            />
                        ))}
                    </div>
                </div>
            )}
        </article>
    );
}

function HistoryPage ({
    onBack,
    onShowMasteries,
    onRefreshHistory,
    onRefreshActiveMatch,
    activeMatch,
    searchedPlayerPuuid,
    matches,
    mastery,
    onSelectMatch,
    onSearchParticipant,
    isLoadingMatchDetails,
    isRefreshingHistory,
    isSearchingParticipant,
    isRefreshingActiveMatch,
    matchError,
    activeMatchError,
    mostPlayedChampions,
    highestDamageChampions
}: Props) {
    const [nick, setNick] = useState("");
    const [tag, setTag] = useState("");
    const canSearchParticipant = Boolean(nick.trim() && tag.trim());
    const isInteractionBlocked = isSearchingParticipant || isLoadingMatchDetails;

    function handleSearchParticipant() {
        if (!canSearchParticipant || isInteractionBlocked) return;

        onSearchParticipant(nick, tag);
    }

    const maxDamageInList = Math.max(...matches.map((match) => match.totalDamage), 0);
    const matchesWithoutRemake = matches.filter((match) => match.result !== 2);
    const minDamageInList = matchesWithoutRemake.length > 0
        ? Math.min(...matchesWithoutRemake.map((match) => match.totalDamage))
        : 0;

    const [showDamageText, setShowDamageText] = useState(false);
    const feedbackMessage = matchError
        || activeMatchError
        || (isSearchingParticipant ? "Buscando histórico do jogador..." : "")
        || (isLoadingMatchDetails ? "Carregando detalhes da partida..." : "")
        || (isRefreshingHistory ? "Atualizando histórico..." : "")
        || (isRefreshingActiveMatch ? "Buscando partida ativa..." : "");

    return (
        <div className="history-page">
            <FloatingAlert
                variant={matchError || activeMatchError ? "error" : "loading"}
                message={feedbackMessage}
            />
            {isInteractionBlocked && <div className="history-page__loading-blocker" aria-hidden="true" />}

            <div className="history-page__topbar">
                <BackButton onBack={onBack} disabled={isInteractionBlocked}/>

                <div className="history-page__search">
                    <input
                        className="history-page__search-nick-input"
                        placeholder="Usuário"
                        autoComplete="off"
                        value={nick}
                        disabled={isInteractionBlocked}
                        onChange={(e) => setNick(e.target.value)}
                        onKeyDown={(event) => {
                            if (event.key !== "Enter" || !canSearchParticipant || isInteractionBlocked) return;
                            handleSearchParticipant();
                        }}
                        type="text"
                    />

                    <div className="history-page__search-tag-field">
                        <span className="history-page__search-tag-hashtag">#</span>
                        <input
                            className="history-page__search-tag-input"
                            placeholder="BR1"
                            autoComplete="off"
                            value={tag}
                            disabled={isInteractionBlocked}
                            onChange={(e) => setTag(e.target.value)}
                            onKeyDown={(event) => {
                                if (event.key !== "Enter" || !canSearchParticipant || isInteractionBlocked) return;
                                handleSearchParticipant();
                            }}
                            type="text"
                        />
                    </div>

                    <button
                        type="button"
                        className={isSearchingParticipant ? "history-page__refresh-button is-loading" : "history-page__refresh-button"}
                        onClick={handleSearchParticipant}
                        disabled={isInteractionBlocked || isRefreshingHistory || !canSearchParticipant}
                        aria-label="Pesquisar jogador"
                        title="Pesquisar jogador"
                    >
                        {isSearchingParticipant ? (
                            <RefreshCw size={20} strokeWidth={2.4} aria-hidden="true" />
                        ) : (
                            <Search size={20} strokeWidth={2.4} aria-hidden="true" />
                        )}
                    </button>
                </div>

                <div className="history-page__actions">
                    <button
                        type="button"
                        className={isRefreshingHistory ? "history-page__refresh-button is-loading" : "history-page__refresh-button"}
                        onClick={onRefreshHistory}
                        disabled={isInteractionBlocked || isRefreshingHistory}
                        aria-label="Recarregar histórico"
                        title="Recarregar histórico"
                    >
                        <RefreshCw size={20} strokeWidth={2.4} aria-hidden="true" />
                    </button>

                    <label className="damage-toggle">
                        <span className="damage-toggle__label">Exibir dano</span>
                        <input
                            className="damage-toggle__input"
                            type="checkbox"
                            name="show-damage-text"
                            checked={showDamageText}
                            disabled={isInteractionBlocked}
                            onChange={(event) => setShowDamageText(event.target.checked)}
                        />
                        <span className="damage-toggle__control" />
                    </label>
                </div>
            </div>

            <header className="history-page__header">
                <p className="page-eyebrow">Painel de desempenho</p>
                <h1>Histórico de partidas</h1>
                <span>{matches.length} partidas recentes analisadas</span>
            </header>

            <div className="history-page__content">
                <aside className="history-insights" aria-label="Resumo de campeões">
                    <section className="history-insights__section">
                        <p className="sidebar-section-title">Campeões mais jogados</p>
                        {mostPlayedChampions.map(({
                            championName,
                            championIconUrl,
                            gamesPlayed
                        }) => (
                            <div key={championName} className="history-insights__champion">
                                <RemoteImage className="champion-icon" src={championIconUrl} alt={`Ícone do campeão ${championName}`}/>
                                <p className="champion-name">{championName}</p>
                                <p className="champion-subinfo">{gamesPlayed} partidas</p>
                            </div>
                        ))}
                    </section>

                    <section className="history-insights__section">
                        <p className="sidebar-section-title">Maior dano por campeão</p>
                        {highestDamageChampions.map(({
                            championName,
                            championIconUrl,
                            highestDamage
                        }) => (
                            <div key={championName} className="history-insights__champion">
                                <RemoteImage className="champion-icon" src={championIconUrl} alt={`Ícone do campeão ${championName}`}/>
                                <p className="champion-name">{championName}</p>
                                <p className="champion-subinfo">{highestDamage.toLocaleString("pt-BR")} de dano total</p>
                            </div>
                        ))}
                    </section>

                    {mastery && (
                        <section className="history-insights__section">
                            <p className="sidebar-section-title">Maior maestria</p>

                            <div className="history-mastery-card">
                                <div className="history-mastery-card__icons">
                                    <RemoteImage
                                        className="history-mastery-card__mastery-icon"
                                        src={mastery.masteryIconUrl}
                                        alt={`Maestria level ${mastery.championLevel}`}
                                    />

                                    <RemoteImage
                                        className="history-mastery-card__champion-icon"
                                        src={mastery.championIconUrl}
                                        alt={`Ícone do campeão ${mastery.championName}`}
                                    />
                                </div>

                                <div className="history-mastery-card__content">
                                    <p className="history-mastery-card__champion">{mastery.championName}</p>
                                    <p className="history-mastery-card__level">Maestria {mastery.championLevel}</p>
                                </div>

                                <div className="history-mastery-card__meta">
                                    <span>Última partida</span>
                                    <strong>{formatLastPlayTime(mastery.lastPlayTime)}</strong>
                                </div>
                            </div>

                            <button
                                type="button"
                                className="history-mastery-link"
                                onClick={onShowMasteries}
                                disabled={isInteractionBlocked}
                            >
                                <span>Ver todas as maestrias</span>
                                <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
                            </button>
                        </section>
                    )}
                </aside>

                <section className="match-list">
                    <div className="match-list__active-match-card">
                        {activeMatch ? (
                            <ActiveMatchCard
                                activeMatch={activeMatch}
                                searchedPlayerPuuid={searchedPlayerPuuid}
                                isRefreshingActiveMatch={isRefreshingActiveMatch}
                                onRefreshActiveMatch={onRefreshActiveMatch}
                                onSearchParticipant={onSearchParticipant}
                            />
                        ) : (
                            <div className="active-match-empty">
                                <div className="active-match-empty__content">
                                    <p className="active-match-card__eyebrow">
                                        <Swords size={16} strokeWidth={2.4} aria-hidden="true" />
                                        Partida ativa
                                    </p>
                                    <p className="empty-state">Jogador não está em uma partida</p>
                                </div>

                                <button
                                    type="button"
                                    className={isRefreshingActiveMatch ? "history-page__refresh-button is-loading" : "history-page__refresh-button"}
                                    onClick={onRefreshActiveMatch}
                                    disabled={isInteractionBlocked || isRefreshingActiveMatch}
                                    aria-label="Buscar partida ativa"
                                    title="Buscar partida ativa"
                                >
                                    <RefreshCw size={20} strokeWidth={2.4} aria-hidden="true" />
                                </button>
                            </div>
                        )}
                    </div>

                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <MatchCard
                                key={match.matchId}
                                match={match}
                                maxDamageInList={maxDamageInList}
                                minDamageInList={minDamageInList}
                                onSelectMatch={onSelectMatch}
                                isLoadingMatchDetails={isInteractionBlocked}
                                showDamageText={showDamageText}
                            />
                        ))
                    ) : (
                        <p className="empty-state">Nenhuma partida encontrada</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default HistoryPage;
