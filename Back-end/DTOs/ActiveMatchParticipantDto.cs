namespace CadeODano.DTOs;

public record ActiveMatchParticipantDto
{
    public string? Puuid { get; set; } = string.Empty;
    public int TeamId { get; set; }

    public string? RiotId { get; set; } = string.Empty;
    public string? ChampionName { get; set; } = string.Empty;
    public string ChampionIconUrl { get; set; } = string.Empty;
    public string ChampionSplashArtUrl { get; set; } = string.Empty;

    public string? Spell1Name { get; set; } = string.Empty;
    public string Spell1IconUrl { get; set; } = string.Empty;

    public string? Spell2Name { get; set; } = string.Empty;
    public string Spell2IconUrl { get; set; } = string.Empty;

    public ActiveMatchPerksDto Perks { get; set; } = null!;

}