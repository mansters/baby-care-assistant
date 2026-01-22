using AutoMapper;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        // Baby
        CreateMap<Baby, BabyDto>().ReverseMap();
        CreateMap<CreateBabyDto, Baby>();
        CreateMap<UpdateBabyDto, Baby>();
        
        // Feeding Log
        CreateMap<FeedingLog, FeedingLogDto>().ReverseMap();
        CreateMap<CreateFeedingLogDto, FeedingLog>();
        CreateMap<UpdateFeedingLogDto, FeedingLog>();
    }
}