using System.Text.Json.Serialization;

namespace CadeODano.Models;

public class ActiveMatchBan
{
    [JsonPropertyName("championId")]
    public int ChampionId { get; set; }

    [JsonPropertyName("teamId")]
    public int TeamId { get; set; }
}