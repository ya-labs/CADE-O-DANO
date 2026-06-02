using System.CodeDom.Compiler;
using CadeODano;
using CadeODano.DTOs;
using CadeODano.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class StatsController : Controller
{
  private readonly IPlayerDashboardService _playerDashboardService;

  public StatsController(IPlayerDashboardService playerDashboardService)
  {
    _playerDashboardService = playerDashboardService;
  }

  [HttpGet("/search/{Nickname}/{Hashtag}")]
  public async Task<IActionResult> SearchByNickname([FromRoute] PlayerSearchRequestDto playerRequest, [FromQuery] string count)
  {
    var result = await _playerDashboardService.GetPlayerStats(playerRequest, count);

    if (!result.Result)
      return BadRequest(result);

    return Ok(result);
  }

  [HttpGet("match/{matchId}")]
  public async Task<IActionResult> GetMatchDetails(string matchId, [FromQuery] string puuid)
  {
    var result = await _playerDashboardService.GetMatchDetails(matchId, puuid);

    if (!result.Result)
      return BadRequest(result);

    return Ok(result);
  }

  [HttpGet("match/activematch")]
  public async Task<IActionResult> GetActiveMatch([FromQuery] string puuid)
  {
    var result = await _playerDashboardService.GetActiveMatch(puuid);

    if (!result.Result)
      return BadRequest(result);

    return Ok(result);
  }
}