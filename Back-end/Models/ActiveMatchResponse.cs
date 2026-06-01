using System.Text.Json.Serialization;

namespace CadeODano.Models;

public class ActiveMatchResponse
{
    [JsonPropertyName("gameQueueConfigId")]
    public int GameQueueConfigId { get; set; }

    [JsonPropertyName("gameStartTime")]
    public long GameStartTime { get; set; }

    [JsonPropertyName("participants")]
    public List<ActiveMatchParticipant> Participants { get; set; } = [];

    [JsonPropertyName("bannedChampions")]
    public List<ActiveMatchBan> Bans { get; set; } = [];
}