namespace CadeODano.DTOs;

public record PlayerMasteriesDto
{
    public string MasteryIconUrl { get; set; } = string.Empty;
    public string ChampionName { get; set; } = string.Empty;

    public string ChampionIconUrl { get; set; } = string.Empty;
    public int ChampionLevel { get; set; }

    public long LastPlayTime { get; set; }
}