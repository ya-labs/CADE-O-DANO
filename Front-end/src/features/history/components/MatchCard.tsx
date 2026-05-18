import type { CSSProperties } from "react";
import type { MatchSummary } from "../../../types/match"
import RemoteImage from "../../../shared/components/RemoteImage";
import ParticipantItems from "../../match-details/components/ParticipantItems";

const MATCH_RESULT_DISPLAY: Record<MatchSummary["result"], { label: string; classModifier: string }> = {
    0: { label: "Vitória", classModifier: "win" },
    1: { label: "Derrota", classModifier: "loss" },
    2: { label: "Remake", classModifier: "rmk" },
};

const UNKNOWN_MATCH_RESULT = { label: "Resultado indisponivel", classModifier: "rmk" };

type Props =  {
    match: MatchSummary;
    maxDamageInList: number;
    minDamageInList: number;
    onSelectMatch: (matchId: string) => Promise<void>;
    isLoadingMatchDetails: boolean;
    showDamageText: boolean;
}

function MatchCard ({ match, maxDamageInList, minDamageInList, onSelectMatch, isLoadingMatchDetails, showDamageText }: Props) {
    const { 
        matchId, 
        queueType,
        championName, 
        championIconUrl, 
        kills, 
        deaths, 
        assists, 
        totalDamage, 
        result, 
        gameStartTimestamp,
        champLevel,
        itemIconUrls
    } = match;

    const damageRatio = maxDamageInList > 0
        ? totalDamage / maxDamageInList
        : 0;

    const damagePercent = Math.round(damageRatio * 100);
    const hasDamageRange = maxDamageInList > minDamageInList;
    const damageIndicator = hasDamageRange && totalDamage === maxDamageInList
        ? "highest"
        : hasDamageRange && totalDamage === minDamageInList
            ? "lowest"
            : null;

    const resultadoPartida = MATCH_RESULT_DISPLAY[result] ?? UNKNOWN_MATCH_RESULT;
    
    return (
        <button 
            type="button"
            className={`match-card match-card--${resultadoPartida.classModifier}`} 
            disabled={isLoadingMatchDetails}
            onClick={() => onSelectMatch(matchId)}
        >
            <div className="match-card__champion">
                <div className="champ-icon">
                    <div className="champ-icon__frame">
                        <RemoteImage className="champion-img" src={championIconUrl} alt={championName} />
                    </div>

                    <p className="champion-level">{champLevel}</p>
                </div>
                
                <p className="champion-name">{championName}</p>
            </div>

            <div className="match-card__result">
                <strong className={`match-result match-result--${resultadoPartida.classModifier}`}>
                    {resultadoPartida.label}
                </strong>
                <span>{queueType}</span>
            </div>
            
            <div className="match-card__meta">
                <strong>Summoner's Rift</strong>
                <span>{gameStartTimestamp}</span>
            </div>
            
            <div className="match-card__items-summary">
                <ParticipantItems itemIconUrls={itemIconUrls} />
            </div>

            <p className="match-kda">{kills}/{deaths}/{assists}</p>

            <div
                className={showDamageText ? "match-card__damage-summary match-card__damage-summary--expanded" : "match-card__damage-summary"}
                data-damage-tooltip={`Dano: ${totalDamage} | ${damagePercent}% do maior dano da lista`}
                style={{ "--history-damage-ratio": damageRatio } as CSSProperties}
            >
                {damageIndicator && (
                    <span className={`match-card__damage-indicator match-card__damage-indicator--${damageIndicator}`}>
                        {damageIndicator === "highest" ? "Maior dano" : "Menor dano"}
                    </span>
                )}

                <div className="match-card__damage-bar">
                </div>

                <div className="match-card__damage-details" aria-hidden={!showDamageText}>
                    <strong>{totalDamage.toLocaleString("pt-BR")}</strong>
                    <span>{damagePercent}% do maior dano</span>
                </div>
            </div>
        </button>
    );
}

export default MatchCard;
