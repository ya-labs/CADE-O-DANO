namespace CadeODano.Helpers;

public class DataDragonHelper
{
    private static readonly string version = "16.9.1";

    public static string GetChampionIcon(string championName)
        => $"https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{championName}.png";

    public static string GetChampionSplashArt(string championName)
        => $"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/{championName}_0.jpg";

    public static string GetProfileIcon(string profileIconId)
        => $"https://ddragon.leagueoflegends.com/cdn/{version}/img/profileicon/{profileIconId}.png";

    public static string GetRankIcon(string tier)
        => $"https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-{tier.ToLower()}.png";

    public static string GetItemIcon(string itemId)
        => $"https://ddragon.leagueoflegends.com/cdn/{version}/img/item/{itemId}.png";

    public static string GetRunes()
        => $"https://ddragon.leagueoflegends.com/cdn/{version}/data/pt_BR/runesReforged.json";

    public static string GetRuneIcon(string iconPath)
        => $"https://ddragon.leagueoflegends.com/cdn/img/{iconPath}";

    public static string GetChampions()
        => $"https://ddragon.leagueoflegends.com/cdn/{version}/data/pt_BR/champion.json";

    public static string GetMasteryIcon(int masteryLevel)
    {
        var level = Math.Min(masteryLevel, 10);

        return $"https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/item-element/crest-and-banner-mastery-{level}.png";
    }
    public static string GetFavoriteChampionSplashArt(string championName)
        => $"http://ddragon.leagueoflegends.com/cdn/img/champion/splash/{championName}_0.jpg";
    public static List<string?> GetItemIconUrls(params int[] itemIds)
    {
        return itemIds
            .Select(itemId =>
                itemId <= 0
                    ? null
                    : GetItemIcon(itemId.ToString()))
            .ToList();
    }
}