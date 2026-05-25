import type { Mastery } from "../../../services/api/types";
import BackButton from "../../../shared/components/BackButton";
import RemoteImage from "../../../shared/components/RemoteImage";

type Props = {
    onBack: () => void;
    masteries: Mastery[];
}

function formatLastPlayTime(lastPlayTime: number) {
    if (lastPlayTime <= 0) return "Hoje";
    if (lastPlayTime === 1) return "1 dia";

    return `${lastPlayTime} dias`;
}

export function MasteryPage ({ onBack, masteries }: Props) {
    const featuredMastery = masteries[0];
    const recentlyPlayedMastery = masteries.reduce<Mastery | null>((currentRecent, mastery) => {
        if (!currentRecent) return mastery;

        return mastery.lastPlayTime < currentRecent.lastPlayTime ? mastery : currentRecent;
    }, null);

    return (
        <div className="mastery-page">
            <div className="mastery-page__topbar">
                <BackButton onBack={onBack}/>
            </div>

            <header className="mastery-page__header">
                <div>
                    <p className="page-eyebrow">Coleção do invocador</p>
                    <h1>Maestrias</h1>
                    <span>{masteries.length} campeões com maestria analisados</span>
                </div>

                {featuredMastery && (
                    <div className="mastery-page__spotlight" aria-label="Maior maestria">
                        <RemoteImage
                            className="mastery-page__spotlight-icon"
                            src={featuredMastery.championIconUrl}
                            alt={`Ícone do campeão ${featuredMastery.championName}`}
                        />
                        <div>
                            <span>Maior maestria</span>
                            <strong>{featuredMastery.championName}</strong>
                            <small>Maestria {featuredMastery.championLevel}</small>
                        </div>
                    </div>
                )}
            </header>

            {masteries.length > 0 ? (
                <>
                    <section className="mastery-page__summary" aria-label="Resumo de maestrias">
                        <div className="mastery-stat">
                            <span>Total</span>
                            <strong>{masteries.length}</strong>
                            <small>campeões listados</small>
                        </div>

                        {featuredMastery && (
                            <div className="mastery-stat">
                                <span>Topo</span>
                                <strong>{featuredMastery.championLevel}</strong>
                                <small>{featuredMastery.championName}</small>
                            </div>
                        )}

                        {recentlyPlayedMastery && (
                            <div className="mastery-stat">
                                <span>Mais recente</span>
                                <strong>{formatLastPlayTime(recentlyPlayedMastery.lastPlayTime)}</strong>
                                <small>{recentlyPlayedMastery.championName}</small>
                            </div>
                        )}
                    </section>

                    <section className="mastery-page__grid" aria-label="Maestrias por campeão">
                        {masteries.map(({
                            masteryIconUrl,
                            championName,
                            championIconUrl,
                            championLevel,
                            lastPlayTime,
                        }, index) => (
                            <article key={championName+championLevel} className="mastery-card">
                                <span className="mastery-card__position">#{index + 1}</span>

                                <div className="mastery-card__icons">
                                    <RemoteImage className="mastery-card__champion-icon" src={championIconUrl} alt={`Ícone do campeão ${championName}`}/>
                                    <RemoteImage className="mastery-card__mastery-icon" src={masteryIconUrl} alt={`Maestria level ${championLevel}`}/>
                                </div>

                                <div className="mastery-card__content">
                                    <h2>{championName}</h2>
                                    <span>Maestria {championLevel}</span>
                                </div>

                                <div className="mastery-card__footer">
                                    <span>Última partida</span>
                                    <strong>{formatLastPlayTime(lastPlayTime)}</strong>
                                </div>
                            </article>
                        ))}
                    </section>
                </>
            ) : (
                <p className="empty-state">Nenhuma maestria encontrada</p>
            )}
        </div>
    )
}

export default MasteryPage;
