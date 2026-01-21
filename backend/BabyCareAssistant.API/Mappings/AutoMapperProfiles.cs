using AutoMapper;
using BabyCareAssistant.API.Dtos;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.API.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<FeedingLog, FeedingLogDto>().ReverseMap();
        CreateMap<CreateFeedingLogDto, FeedingLog>();
        CreateMap<UpdateFeedingLogDto, FeedingLog>();
    }
}