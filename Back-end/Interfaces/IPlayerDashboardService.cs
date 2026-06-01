using CadeODano.DTOs;
using CadeODano.Services;

namespace CadeODano.Interfaces;

public interface IPlayerDashboardService
{
  public Task<ServiceResult<PlayerStatsDto>> GetPlayerStats(PlayerSearchRequestDto playerNickname, string count);
  public Task<ServiceResult<MatchDetailsDto>> GetMatchDetails(string matchId, string puuid);
  public Task<ServiceResult<ActiveMatchDto>> GetActiveMatch(string puuid);
}