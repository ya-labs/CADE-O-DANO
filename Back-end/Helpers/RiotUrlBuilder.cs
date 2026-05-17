namespace CadeODano.Helpers;

public class RiotUrlBuilder
{
    public static string GetPuuidByRiotId(string nickname, string hashtag)
        => $"https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{nickname}/{hashtag}";

    public static string GetMatchInfoByMatchId(string matchId)
        => $"https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}";

    public static string GetRecentMatchesByPuuid(string puuid, string count)
        => $"https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={count}";

    public static string GetSummonerAccountInfoByPuuid(string puuid)
        => $"https://br1.api.riotgames.com/riot/account/v4/accounts/by-puuid/{puuid}";
    public static string GetSummonerByPuuid(string puuid)
        => $"https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}";

    public static string GetSummonerEloByPuuid(string puuid)
        => $"https://br1.api.riotgames.com/lol/league/v4/entries/by-puuid/{puuid}";
    
    public static string GetChampionMasteriesByPuuid(string puuid)
        => $"https://br1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/{puuid}";
}