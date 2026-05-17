using AutoMapper;
using CadeODano.DTOs;
using CadeODano.Helpers;
using CadeODano.Interfaces;
using CadeODano.Models;
using CadeODano.Services;

namespace CadeODano.Mappings;

public class RiotProfile : Profile
{
    private readonly IStatsCalculatorService _statsCalculatorService;

    public RiotProfile(IStatsCalculatorService statsCalculatorService)
    {
        _statsCalculatorService = statsCalculatorService;
    }
    
    public RiotProfile()
    {
        CreateMap<RiotParticipant, MatchSummaryDto>()
            .ForMember(dest => dest.ChampionIconUrl,
                opt => opt.MapFrom(src => DataDragonHelper.GetChampionIcon(src.ChampionName!)))
            .ForMember(dest => dest.ChampionSplashArtUrl,
                opt => opt.MapFrom(src => DataDragonHelper.GetChampionSplashArt(src.ChampionName!)))
            .ForMember(dest => dest.ItemIconUrls,
                opt => opt.MapFrom(src => DataDragonHelper.GetItemIconUrls(
                    src.Item0,
                    src.Item1,
                    src.Item2,
                    src.Item3,
                    src.Item4,
                    src.Item5,
                    src.Item6)))
            .ForMember(dest => dest.CS,
                opt => opt.MapFrom(src =>
                    src.TotalMinionsKilled + src.NeutralMinionsKilled));

        CreateMap<RiotParticipant, ParticipantDto>()
            .ForMember(dest => dest.ChampionIconUrl,
                opt => opt.MapFrom(src => DataDragonHelper.GetChampionIcon(src.ChampionName!)))
            .ForMember(dest => dest.ChampionSplashArtUrl,
                opt => opt.MapFrom(src => DataDragonHelper.GetChampionSplashArt(src.ChampionName!)))
            .ForMember(dest => dest.ItemIconUrls,
                opt => opt.MapFrom(src => DataDragonHelper.GetItemIconUrls(
                    src.Item0,
                    src.Item1,
                    src.Item2,
                    src.Item3,
                    src.Item4,
                    src.Item5,
                    src.Item6)))
            .ForMember(dest => dest.SummonerHashtag,
                opt => opt.MapFrom(src => src.Hashtag))
            .ForMember(dest => dest.SummonerName,
                opt => opt.MapFrom(src => src.SummonerName));

        CreateMap<SummonerEloResponse, SummonerEloDto>()
            .ForMember(dest => dest.QueueType,
                opt => opt.MapFrom(src => RiotExtensions.ToQueueName(src.QueueType)))
            .ForMember(dest => dest.Tier,
                opt => opt.MapFrom(src => RiotExtensions.ToTierName(src.Tier)))
            .ForMember(dest => dest.WinRate,
                opt => opt.MapFrom(src => _statsCalculatorService.CalculateWinRate(src.Wins, src.Losses)))
            .ForMember(dest => dest.LeagueIconUrl,
                opt => opt.MapFrom(src => DataDragonHelper.GetRankIcon(src.Tier)));

        CreateMap<MasteriesResponse, PlayerMasteriesDto>();
    }
}