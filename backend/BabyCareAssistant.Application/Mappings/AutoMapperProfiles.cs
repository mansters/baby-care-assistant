using AutoMapper;
using BabyCareAssistant.Application.Dtos.Baby;
using BabyCareAssistant.Application.Dtos.ExcretionLog;
using BabyCareAssistant.Application.Dtos.FeedingLog;
using BabyCareAssistant.Application.Dtos.GrowthLog;
using BabyCareAssistant.Application.Dtos.VaccineCatalog;
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
        
        // Growth Log
        CreateMap<GrowthLog, GrowthLogDto>().ReverseMap();
        CreateMap<CreateGrowthLogDto, GrowthLog>();
        CreateMap<UpdateGrowthLogDto, GrowthLog>();

        // Excretion Log
        CreateMap<ExcretionLog, ExcretionLogDto>().ReverseMap();
        CreateMap<CreateExcretionLogDto, ExcretionLog>();
        CreateMap<UpdateExcretionLogDto, ExcretionLog>();

        // Vaccine Catalog
        CreateMap<VaccineCatalog, VaccineCatalogDto>().ReverseMap();
        CreateMap<CreateVaccineCatalogDto, VaccineCatalog>();
        CreateMap<UpdateVaccineCatalogDto, VaccineCatalog>();
    }
}