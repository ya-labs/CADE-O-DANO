using CadeODano.Enums;

namespace CadeODano.DTOs;

public record MatchSummaryDto
{
    public string? MatchId { get; set; }
    public string? ChampionName { get; set; }

    public string? ChampionIconUrl { get; set; }
    public string? ChampionSplashArtUrl { get; set; }
    public string? GameStartTimestamp { get; set; }
    public string QueueType { get; set; } = string.Empty;
    public int Kills { get; set; }
    public int Deaths { get; set; }
    public int Assists { get; set; }
    public int TotalDamage { get; set; }
    public int CS { get; set; }

    public List<string> ItemIconUrls { get; set; } = [];
    public MatchResult Result { get; set; }
    public int ChampLevel { get; set; }
}
