namespace CadeODano.DTOs;

public record ActiveMatchPerksDto
{
    public List<int> PerkIds { get; set; } = [];
    public int PerkStyle { get; set; }
    public int PerkSubStyle { get; set; }
}