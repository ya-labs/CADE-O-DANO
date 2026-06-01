using System.Text.Json.Serialization;

namespace CadeODano.Models;

public class ActiveMatchParticipant
{
    [JsonPropertyName("puuid")]
    public string? Puuid { get; set; }

    [JsonPropertyName("teamId")]
    public int TeamId { get; set; }

    [JsonPropertyName("riotId")]
    public string? RiotId { get; set; }

    [JsonPropertyName("championId")]
    public string? ChampionId { get; set; }

    [JsonPropertyName("lastSelectedSkinIndex")]
    public int LastSelectedSkinIndex { get; set; }

    [JsonPropertyName("spell1Id")]
    public string? Spell1Id { get; set; }

    [JsonPropertyName("spell2Id")]
    public string? Spell2Id { get; set; }

    [JsonPropertyName("perks")]
    public ActiveMatchPerks Perks { get; set; } = null!;

}