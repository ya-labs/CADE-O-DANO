using AutoMapper;
using CadeODano.DTOs;
using CadeODano.Helpers;
using CadeODano.Interfaces;
using CadeODano.Models;
using Microsoft.Extensions.Caching.Memory;

namespace CadeODano.Services;

public class RiotApiService : IRiotApiService
{
  private readonly HttpClient _httpClient;
  private readonly IMapper _mapper;
  private readonly IMemoryCache _cache;
  private readonly IStatsCalculatorService _statsCalculatorService;
  private readonly IRiotStaticDataService _riotStaticDataService;

  public RiotApiService(
    HttpClient httpClient,
    IMapper mapper,
    IMemoryCache cache,
    IStatsCalculatorService statsCalculatorService,
    IRiotStaticDataService riotStaticDataService)
  {
    _httpClient = httpClient;
    _mapper = mapper;
    _cache = cache;
    _statsCalculatorService = statsCalculatorService;
    _riotStaticDataService = riotStaticDataService;
  }

  public async Task<List<string>> GetMatchIdsByPuuid(string puuid, string count)
  {
    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetRecentMatchesByPuuid(puuid, count));

    if (!response.IsSuccessStatusCode)
      throw new Exception("Não foi possível buscar o histórico de partidas.");

    var matchIds = await response.Content.ReadFromJsonAsync<List<string>>();

    if (matchIds == null || !matchIds.Any())
      throw new Exception("Nenhuma partida encontrada para este jogador.");

    return matchIds;
  }

  public async Task<string> GetPuuidByRiotId(PlayerSearchRequestDto playerNickname)
  {
    var nickname = Uri.EscapeDataString(playerNickname.Nickname);
    var hashtag = Uri.EscapeDataString(playerNickname.Hashtag);

    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetPuuidByRiotId(nickname, hashtag));

    if (!response.IsSuccessStatusCode)
      throw new Exception("Jogador não encontrado na Riot API");

    var accountData = await response.Content.ReadFromJsonAsync<RiotAccountResponse>();

    if (accountData == null || string.IsNullOrEmpty(accountData.Puuid))
      throw new Exception("Não foi possível obter o PUUID do jogador.");

    return accountData.Puuid;
  }


  public async Task<MatchSummaryDto?> GetMatchSummaryByMatchId(string matchId, string puuid)
  {
    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetMatchInfoByMatchId(matchId));

    if (!response.IsSuccessStatusCode)
    {
      Console.WriteLine(
          $"Erro match {matchId}: {(int)response.StatusCode}");

      return null;
    }

    var matchData = await response.Content.ReadFromJsonAsync<RiotMatchResponse>();

    var playerData = matchData?.Info?.Participants?
        .FirstOrDefault(x => x.Puuid == puuid);

    if (playerData == null)
      return null;

    var dto = _mapper.Map<MatchSummaryDto>(playerData);
    dto.MatchId = matchId;
    dto.GameStartTimestamp = FormatHelper.FormatUnixMilliseconds(matchData.Info.gameStartTimestamp);
    dto.QueueType = RiotExtensions.GetQueueDescription(matchData.Info.QueueId);
    dto.Result = _statsCalculatorService.GetMatchResult(
      playerData.Win,
      matchData.Info.GameDuration);

    return dto;

  }

  public async Task<SummonerAccountResponse> GetSummonerAccountInfoByPuuid(string puuid)
  {
    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetSummonerByPuuid(puuid));

    if (!response.IsSuccessStatusCode)
      throw new Exception("Failed to get summoner account info.");

    var accountData = await response.Content.ReadFromJsonAsync<SummonerAccountResponse>();
    return accountData!;
  }

  public async Task<List<SummonerEloDto>> GetSummonerEloByPuuid(string puuid)
  {
    var response = await _httpClient.GetAsync(
        RiotUrlBuilder.GetSummonerEloByPuuid(puuid));

    if (!response.IsSuccessStatusCode)
      throw new Exception("Failed to get summoner elo info.");

    var eloData = await response.Content
        .ReadFromJsonAsync<List<SummonerEloResponse>>();

    if (eloData == null)
      return [];

    return _mapper.Map<List<SummonerEloDto>>(eloData);
  }

  public async Task<List<PlayerMasteriesDto>> GetPlayerMasteriesByPuuid(string puuid)
  {
    var response = await _httpClient.GetAsync(
        RiotUrlBuilder.GetChampionMasteriesByPuuid(puuid));

    if (!response.IsSuccessStatusCode)
      throw new Exception("Failed to get champion masteries.");

    var masteriesData = await response.Content
        .ReadFromJsonAsync<List<MasteriesResponse>>();

    if (masteriesData == null)
      return [];

    var championsResponse = await _riotStaticDataService.GetChampionsAsync();

    var champions = championsResponse.Data.Values.ToList();

    var dto = masteriesData.Select(mastery =>
    {
      var champion = champions
          .FirstOrDefault(c => c.Key == mastery.ChampionId.ToString());

      return new PlayerMasteriesDto
      {
        MasteryIconUrl = DataDragonHelper.GetMasteryIcon(mastery.ChampionLevel),
        ChampionName = champion?.Name ?? "Unknown",
        ChampionIconUrl = DataDragonHelper.GetChampionIcon(champion?.Id),
        ChampionLevel = mastery.ChampionLevel,
      };
    }).ToList();

    return dto;
  }
  public async Task<RiotMatchResponse> GetMatchById(string matchId)
  {
    if (_cache.TryGetValue(matchId, out RiotMatchResponse cachedMatch))
      return cachedMatch;

    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetMatchInfoByMatchId(matchId));

    if (!response.IsSuccessStatusCode)
      throw new Exception($"Failed to get match data for {matchId}");

    var matchData = await response.Content.ReadFromJsonAsync<RiotMatchResponse>();

    if (matchData != null)
    {
      _cache.Set(matchId, matchData, TimeSpan.FromMinutes(30));
    }

    return matchData!;
  }
}