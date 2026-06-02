using AutoMapper;
using CadeODano.DTOs;
using CadeODano.Helpers;
using CadeODano.Interfaces;
using CadeODano.Models;
using Microsoft.Extensions.Caching.Memory;
using System.Text.Json;

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
      throw await BuildRiotApiException(
        response,
        $"buscar histórico de partidas do jogador {FormatPuuid(puuid)}");

    var matchIds = await response.Content.ReadFromJsonAsync<List<string>>();

    if (matchIds == null || !matchIds.Any())
      throw new InvalidOperationException("A Riot API não retornou nenhuma partida recente para este jogador.");

    return matchIds;
  }

  public async Task<string> GetPuuidByRiotId(PlayerSearchRequestDto playerNickname)
  {
    var nickname = Uri.EscapeDataString(playerNickname.Nickname);
    var hashtag = Uri.EscapeDataString(playerNickname.Hashtag);

    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetPuuidByRiotId(nickname, hashtag));

    if (!response.IsSuccessStatusCode)
      throw await BuildRiotApiException(
        response,
        $"buscar PUUID do jogador {playerNickname.Nickname}#{playerNickname.Hashtag}");

    var accountData = await response.Content.ReadFromJsonAsync<RiotAccountResponse>();

    if (accountData == null || string.IsNullOrEmpty(accountData.Puuid))
      throw new InvalidOperationException($"A Riot API retornou uma resposta sem PUUID para {playerNickname.Nickname}#{playerNickname.Hashtag}.");

    return accountData.Puuid;
  }


  public async Task<MatchSummaryDto?> GetMatchSummaryByMatchId(string matchId, string puuid)
  {
    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetMatchInfoByMatchId(matchId));

    if (!response.IsSuccessStatusCode)
    {
      Console.WriteLine(
          $"Partida {matchId} ignorada no histórico: Riot API retornou {(int)response.StatusCode} ({response.ReasonPhrase}).");

      return null;
    }

    var matchData = await response.Content.ReadFromJsonAsync<RiotMatchResponse>();

    var playerData = matchData?.Info?.Participants?
        .FirstOrDefault(x => x.Puuid == puuid);

    if (playerData == null)
    {
      Console.WriteLine($"Partida {matchId} ignorada no histórico: participante {FormatPuuid(puuid)} não foi encontrado na resposta da Riot API.");
      return null;
    }

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
      throw await BuildRiotApiException(
        response,
        $"buscar dados da conta do jogador {FormatPuuid(puuid)}");

    var accountData = await response.Content.ReadFromJsonAsync<SummonerAccountResponse>();

    if (accountData == null)
      throw new InvalidOperationException($"A Riot API retornou dados de conta vazios para o jogador {FormatPuuid(puuid)}.");

    return accountData!;
  }

  public async Task<List<SummonerEloDto>> GetSummonerEloByPuuid(string puuid)
  {
    var response = await _httpClient.GetAsync(
        RiotUrlBuilder.GetSummonerEloByPuuid(puuid));

    if (!response.IsSuccessStatusCode)
      throw await BuildRiotApiException(
        response,
        $"buscar elos ranqueados do jogador {FormatPuuid(puuid)}");

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
      throw await BuildRiotApiException(
        response,
        $"buscar maestrias do jogador {FormatPuuid(puuid)}");

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
      throw await BuildRiotApiException(
        response,
        $"buscar dados da partida {matchId}");

    var matchData = await response.Content.ReadFromJsonAsync<RiotMatchResponse>();

    if (matchData == null)
      throw new InvalidOperationException($"A Riot API retornou dados vazios para a partida {matchId}.");

    if (matchData != null)
    {
      _cache.Set(matchId, matchData, TimeSpan.FromMinutes(30));
    }

    return matchData!;
  }

  public async Task<ActiveMatchResponse?> GetActiveMatchByPuuid(string puuid)
  {
    var response = await _httpClient.GetAsync(RiotUrlBuilder.GetActiveMatchByPuuid(puuid));

    if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
      return null;

    if (!response.IsSuccessStatusCode)
      throw await BuildRiotApiException(
        response,
        $"buscar partida ativa do jogador {FormatPuuid(puuid)}");

    var activeMatch = await response.Content.ReadFromJsonAsync<ActiveMatchResponse>();

    if (activeMatch == null)
      throw new InvalidOperationException($"A Riot API retornou dados vazios para a partida ativa do jogador {FormatPuuid(puuid)}.");

    return activeMatch;
  }

  private static async Task<Exception> BuildRiotApiException(HttpResponseMessage response, string operation)
  {
    var riotMessage = await TryReadRiotErrorMessage(response);
    var statusCode = (int)response.StatusCode;
    var reasonPhrase = string.IsNullOrWhiteSpace(response.ReasonPhrase)
      ? "sem descrição HTTP"
      : response.ReasonPhrase;

    var message = $"Erro ao {operation}. Riot API retornou HTTP {statusCode} ({reasonPhrase}).";

    if (!string.IsNullOrWhiteSpace(riotMessage))
      message += $" Mensagem da Riot: {riotMessage}";

    return new HttpRequestException(message, null, response.StatusCode);
  }

  private static async Task<string?> TryReadRiotErrorMessage(HttpResponseMessage response)
  {
    try
    {
      var content = await response.Content.ReadAsStringAsync();

      if (string.IsNullOrWhiteSpace(content))
        return null;

      using var json = JsonDocument.Parse(content);

      if (json.RootElement.TryGetProperty("status", out var status)
          && status.TryGetProperty("message", out var message))
      {
        return message.GetString();
      }

      return content.Length > 240 ? $"{content[..240]}..." : content;
    }
    catch
    {
      return null;
    }
  }

  private static string FormatPuuid(string puuid)
  {
    if (string.IsNullOrWhiteSpace(puuid))
      return "(PUUID vazio)";

    return puuid.Length <= 12 ? puuid : $"{puuid[..8]}...";
  }
}
