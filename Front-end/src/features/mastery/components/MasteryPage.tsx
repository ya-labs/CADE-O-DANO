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
    return (
        <div className="mastery-page">
            <BackButton onBack={onBack}/>

            {masteries.slice(0, 1).map(({
                masteryIconUrl,
                championName,
                championIconUrl,
                championLevel,
                lastPlayTime,
            }) => (
                <div key={championName+championLevel} className="history-mastery-card">
                    <div className="history-mastery-card__icons">
                        <RemoteImage className="history-mastery-card__mastery-icon" src={masteryIconUrl} alt={`Maestria level ${championLevel}`}/>
                        <RemoteImage className="history-mastery-card__champion-icon" src={championIconUrl} alt={`Ícone do campeão ${championName}`}/>
                    </div>

                    <div className="history-mastery-card__content">
                        <p className="history-mastery-card__champion">{championName}</p>
                        <p className="history-mastery-card__level">Maestria {championLevel}</p>
                    </div>

                    <div className="history-mastery-card__meta">
                        <span>Última partida</span>
                        <strong>{formatLastPlayTime(lastPlayTime)}</strong>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default MasteryPage;