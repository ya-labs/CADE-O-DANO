namespace CadeODano.DTOs;

public record PlayerStatsDto
{
    public PlayerProfileDto Profile { get; set; } = null!;

    public PlayerRankedStatsDto RankedStats { get; set; } = null!;

    public PlayerMatchesDto Matches { get; set; } = null!;
    public List<PlayerMasteriesDto> Masteries { get; set; } = null!;
    public PlayerPerfomanceSummaryDto PerformanceSummary { get; set; } = null!;
}