using CadeODano.DTOs;
using CadeODano.Helpers;
using CadeODano.Interfaces;
using CadeODano.Models.DataDragon;
using Microsoft.Extensions.Caching.Memory;

namespace CadeODano.Services;

public class RiotStaticDataService : IRiotStaticDataService
{
    private readonly IMemoryCache _cache;
    private readonly HttpClient _httpClient;

    public RiotStaticDataService(IMemoryCache cache, HttpClient httpClient)
    {
        _cache = cache;
        _httpClient = httpClient;
    }

    public async Task<List<DataDragonRuneTree>> GetRunesAsync()
    {
        const string cacheKey = "runes";

        if (_cache.TryGetValue(cacheKey, out List<DataDragonRuneTree>? cachedRunes))
            return cachedRunes!;

        var runes = await GetDataDragonJsonAsync<List<DataDragonRuneTree>>(
            DataDragonHelper.GetRunes(),
            "buscar runas no Data Dragon");

        if (runes == null || runes.Count == 0)
            throw new InvalidOperationException("O Data Dragon retornou uma lista vazia de runas.");

        _cache.Set(cacheKey, runes, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
        });

        return runes!;
    }

    public async Task<DataDragonChampionResponse> GetChampionsAsync()
    {
        const string cacheKey = "champions";

        if (_cache.TryGetValue(cacheKey, out DataDragonChampionResponse? cachedChampions))
            return cachedChampions;

        var champions = await GetDataDragonJsonAsync<DataDragonChampionResponse>(
            DataDragonHelper.GetChampions(),
            "buscar campeões no Data Dragon");

        if (champions == null || champions.Data.Count == 0)
            throw new InvalidOperationException("O Data Dragon retornou uma lista vazia de campeões.");

        _cache.Set(cacheKey, champions, new MemoryCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
        });

        return champions!;
    }

    public async Task<string?> GetChampionNameByIdAsync(string championId)
    {
        var response = await GetChampionsAsync();

        var champions = response.Data.Values.ToList();

        var champion = champions.FirstOrDefault(c => c.Key == championId);

        return champion?.Name;
    }

    public async Task<DataDragonChampion?> GetChampionByIdAsync(int championId)
    {
        var response = await GetChampionsAsync();

        return response.Data.Values
            .FirstOrDefault(champion => champion.Key == championId.ToString());
    }

    public async Task<DataDragonSummonerSpell?> GetSummonerSpellByIdAsync(int spellId)
    {
        const string cacheKey = "summoner-spells";

        if (!_cache.TryGetValue(cacheKey, out DataDragonSummonerSpellResponse? cachedSpells))
        {
            cachedSpells = await GetDataDragonJsonAsync<DataDragonSummonerSpellResponse>(
                DataDragonHelper.GetSummonerSpells(),
                "buscar feitiços de invocador no Data Dragon");

            if (cachedSpells == null || cachedSpells.Data.Count == 0)
                throw new InvalidOperationException("O Data Dragon retornou uma lista vazia de feitiços de invocador.");

            _cache.Set(cacheKey, cachedSpells, new MemoryCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(12)
            });
        }

        return cachedSpells?.Data.Values
            .FirstOrDefault(spell => spell.Key == spellId.ToString());
    }

    public async Task<PerkRuneDto> GetRuneAsync(int runeId)
    {
        var runes = await GetRunesAsync();

        var rune = runes
            .SelectMany(x => x.Slots)
            .SelectMany(x => x.Runes)
            .FirstOrDefault(x => x.Id == runeId);

        if (rune == null)
            return new PerkRuneDto();

        return new PerkRuneDto
        {
            ShortDescription = FormatHelper.CleanRuneDescription(rune.ShortDesc),
            Name = rune.Name,
            IconUrl = DataDragonHelper.GetRuneIcon(rune.Icon)
        };
    }

    public async Task<RuneTreeDto> GetRuneStyleAsync(int styleId)
    {
        var runes = await GetRunesAsync();

        var style = runes.FirstOrDefault(x => x.Id == styleId);

        if (style == null)
            return new RuneTreeDto();

        return new RuneTreeDto
        {
            Name = style.Name,
            IconUrl = DataDragonHelper.GetRuneIcon(style.Icon)
        };
    }

    private async Task<T?> GetDataDragonJsonAsync<T>(string url, string operation)
    {
        try
        {
            return await _httpClient.GetFromJsonAsync<T>(url);
        }
        catch (HttpRequestException ex)
        {
            throw new HttpRequestException(
                $"Erro ao {operation}. Falha HTTP ao consultar {url}. Detalhes: {ex.Message}",
                ex,
                ex.StatusCode);
        }
        catch (TaskCanceledException ex)
        {
            throw new TimeoutException(
                $"Erro ao {operation}. A consulta ao Data Dragon excedeu o tempo limite. URL: {url}",
                ex);
        }
        catch (System.Text.Json.JsonException ex)
        {
            throw new InvalidOperationException(
                $"Erro ao {operation}. O Data Dragon retornou um JSON em formato inesperado. URL: {url}. Detalhes: {ex.Message}",
                ex);
        }
    }
}
