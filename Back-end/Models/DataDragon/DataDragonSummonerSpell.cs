using System.Text.Json.Serialization;

namespace CadeODano.Models.DataDragon;

public class DataDragonSummonerSpell
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Key { get; set; } = string.Empty;

    [JsonPropertyName("image")]
    public DataDragonImage Image { get; set; } = new();
}
