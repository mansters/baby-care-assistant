using AutoMapper;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;
using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;

using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Baby, BabyDto>().ReverseMap();
        CreateMap<CreateBabyDto, Baby>();
        CreateMap<UpdateBabyDto, Baby>();
        
        CreateMap<FeedingLog, FeedingLogDto>().ReverseMap();
        CreateMap<CreateFeedingLogDto, FeedingLog>();
        CreateMap<UpdateFeedingLogDto, FeedingLog>();
        
        CreateMap<GrowthLog, GrowthLogDto>()
            .ReverseMap()
            .ForMember(dest => dest.SK, opt => opt.MapFrom(src => src.SK));
        CreateMap<CreateGrowthLogDto, GrowthLog>();
        CreateMap<UpdateGrowthLogDto, GrowthLog>();

        CreateMap<ExcretionLog, ExcretionLogDto>().ReverseMap();
        CreateMap<CreateExcretionLogDto, ExcretionLog>();
        CreateMap<UpdateExcretionLogDto, ExcretionLog>();
    }
}