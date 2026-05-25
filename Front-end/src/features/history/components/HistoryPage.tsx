import { useState } from "react";
import { ChevronRight, RefreshCw } from "lucide-react";
import type { MatchSummary } from "../../../types/match";
import type { HighestDamageChampion, Mastery, MostPlayedChampion } from "../../../services/api/types";
import BackButton from "../../../shared/components/BackButton";
import FloatingAlert from "../../../shared/components/FloatingAlert";
import RemoteImage from "../../../shared/components/RemoteImage";
import MatchCard from "./MatchCard";

type Props = {
    onBack: () => void;
    onShowMasteries: () => void;
    onRefresh: () => Promise<void>;
    matches: MatchSummary[];
    mastery: Mastery | null;
    onSelectMatch: (matchId: string) => Promise<void>;
    isLoadingMatchDetails: boolean;
    isRefreshingHistory: boolean;
    matchError: string;
    mostPlayedChampions: MostPlayedChampion[];
    highestDamageChampions: HighestDamageChampion[];
}

function formatLastPlayTime(lastPlayTime: number) {
    if (lastPlayTime <= 0) return "Hoje";
    if (lastPlayTime === 1) return "1 dia";

    return `${lastPlayTime} dias`;
}

function HistoryPage ({
    onBack,
    onShowMasteries,
    onRefresh,
    matches,
    mastery,
    onSelectMatch,
    isLoadingMatchDetails,
    isRefreshingHistory,
    matchError,
    mostPlayedChampions,
    highestDamageChampions
}: Props) {
    const maxDamageInList = Math.max(...matches.map((match) => match.totalDamage), 0);
    const matchesWithoutRemake = matches.filter((match) => match.result !== 2);
    const minDamageInList = matchesWithoutRemake.length > 0
        ? Math.min(...matchesWithoutRemake.map((match) => match.totalDamage))
        : 0;

    const [showDamageText, setShowDamageText] = useState(false);
    const feedbackMessage = matchError
        || (isLoadingMatchDetails ? "Carregando detalhes da partida..." : "")
        || (isRefreshingHistory ? "Atualizando histórico..." : "");

    return (
        <div className="history-page">
            <FloatingAlert
                variant={matchError ? "error" : "loading"}
                message={feedbackMessage}
            />

            <div className="history-page__topbar">
                <BackButton onBack={onBack}/>

                <div className="history-page__actions">
                    <button
                        type="button"
                        className={isRefreshingHistory ? "history-page__refresh-button is-loading" : "history-page__refresh-button"}
                        onClick={onRefresh}
                        disabled={isRefreshingHistory}
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
                            >
                                <span>Ver todas as maestrias</span>
                                <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
                            </button>
                        </section>
                    )}
                </aside>

                <section className="match-list">
                    {matches.length > 0 ? (
                        matches.map((match) => (
                            <MatchCard
                                key={match.matchId}
                                match={match}
                                maxDamageInList={maxDamageInList}
                                minDamageInList={minDamageInList}
                                onSelectMatch={onSelectMatch}
                                isLoadingMatchDetails={isLoadingMatchDetails}
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
