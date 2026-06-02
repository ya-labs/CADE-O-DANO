namespace CadeODano.DTOs;

public record ActiveMatchTeamDto
{
    public List<ActiveMatchParticipantDto> Participants { get; set; } = [];
    public List<BanDto> Bans { get; set; } = [];
    public int TeamId { get; set; }
}
