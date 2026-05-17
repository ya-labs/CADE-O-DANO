namespace CadeODano.DTOs;

public record PlayerProfileDto
{
    public string Puuid { get; set; } = string.Empty;

    public string SummonerName { get; set; } = string.Empty;

    public string SummonerLevel { get; set; } = string.Empty;

    public string ProfileIconUrl { get; set; } = string.Empty;

    public string FavoriteChampionSplashArtUrl { get; set; } = string.Empty;
}