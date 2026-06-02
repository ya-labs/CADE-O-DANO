namespace CadeODano.DTOs;

public record ActiveMatchPerksDto
{
    public List<int> PerkIds { get; set; } = [];
    public int PerkStyle { get; set; }
    public int PerkSubStyle { get; set; }
    public RuneTreeDto? PrimaryTree { get; set; }
    public RuneTreeDto? SecondaryTree { get; set; }
    public List<PerkRuneDto> PrimaryPerkRunes { get; set; } = [];
    public List<PerkRuneDto> SecondaryPerkRunes { get; set; } = [];
}
