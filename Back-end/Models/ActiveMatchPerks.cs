using System.Text.Json.Serialization;

namespace CadeODano.Models;
public class ActiveMatchPerks
{
    [JsonPropertyName("perkIds")]
    public List<int> PerkIds { get; set; } = [];

    [JsonPropertyName("perkStyle")]
    public int PerkStyle { get; set; }

    [JsonPropertyName("perkSubStyle")]
    public int PerkSubStyle { get; set; }
}