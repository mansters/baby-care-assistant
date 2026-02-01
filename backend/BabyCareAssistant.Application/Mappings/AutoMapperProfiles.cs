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
using BabyCareAssistant.Application.Features.VaccineCatalog.Dtos;
using BabyCareAssistant.Application.Features.VaccineCatalog.Commands.CreateVaccineCatalog;
using BabyCareAssistant.Application.Features.VaccineCatalog.Commands.UpdateVaccineCatalog;
using BabyCareAssistant.Application.Features.VaccinationRecord.Dtos;
using BabyCareAssistant.Application.Features.VaccinationRecord.Commands.CreateVaccinationRecord;
using BabyCareAssistant.Application.Features.VaccinationRecord.Commands.UpdateVaccinationRecord;
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

        // Vaccination Record
        CreateMap<VaccinationRecord, VaccinationRecordDto>().ReverseMap();
        CreateMap<CreateVaccinationRecordDto, VaccinationRecord>();
        CreateMap<UpdateVaccinationRecordDto, VaccinationRecord>();
    }
}