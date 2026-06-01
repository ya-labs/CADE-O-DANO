namespace CadeODano.DTOs;

public record ActiveMatchDto
{
    public int GameQueueName { get; set; }
    public string GameStartTime { get; set; } = string.Empty;
    public List<ActiveMatchTeamDto> Teams { get; set; } = [];
}