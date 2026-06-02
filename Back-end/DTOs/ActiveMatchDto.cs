namespace CadeODano.DTOs;

public record ActiveMatchDto
{
    public int GameQueueName { get; set; }
    public string QueueType { get; set; } = string.Empty;
    public string GameStartTime { get; set; } = string.Empty;
    public List<ActiveMatchTeamDto> Teams { get; set; } = [];
}
