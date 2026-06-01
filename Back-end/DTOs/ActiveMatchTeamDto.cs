namespace CadeODano.DTOs;

public record ActiveMatchTeamDto
{
    public List<ActiveMatchParticipantDto> Participants { get; set; } = [];
    public int TeamId { get; set; }
}