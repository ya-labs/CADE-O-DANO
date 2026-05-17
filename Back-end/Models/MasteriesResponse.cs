using System.Text.Json.Serialization;

namespace CadeODano.Models;

public class MasteriesResponse
{
    [JsonPropertyName("championId")]
    public int ChampionId { get; set; }
    
    [JsonPropertyName("championLevel")]
    public int ChampionLevel { get; set; }

    [JsonPropertyName("lastPlayTime")]
    public long LastPlayTime { get; set; }
}