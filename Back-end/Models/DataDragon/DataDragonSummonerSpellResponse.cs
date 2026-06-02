using System.Text.Json.Serialization;

namespace CadeODano.Models.DataDragon;

public class DataDragonSummonerSpellResponse
{
    [JsonPropertyName("data")]
    public Dictionary<string, DataDragonSummonerSpell> Data { get; set; } = [];
}
