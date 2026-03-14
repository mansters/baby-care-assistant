using BabyCareAssistant.Application.Features.GrowthLog.Dtos;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;
using BabyCareAssistant.Application.Features.GrowthLog.Commands.UpdateGrowthLog;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Mappings;

public static class GrowthLogMappingExtensions
{
    public static GrowthLogDto ToDto(this GrowthLog entity) => new()
    {
        SK = entity.SK,
        BabyId = entity.BabyId,
        WeightKg = entity.WeightKg,
        HeightCm = entity.HeightCm,
        HeadCircumferenceCm = entity.HeadCircumferenceCm,
        Note = entity.Note,
        EventTimeUtc = entity.EventTimeUtc,
        LocalDate = entity.LocalDate,
        LocalTime = entity.LocalTime
    };

    public static GrowthLog ToEntity(this CreateGrowthLogDto dto) => new()
    {
        WeightKg = dto.WeightKg ?? 0,
        HeightCm = dto.HeightCm,
        HeadCircumferenceCm = dto.HeadCircumferenceCm,
        Note = dto.Note
    };

    public static void UpdateEntity(this UpdateGrowthLogDto dto, GrowthLog entity)
    {
        if (dto.WeightKg.HasValue) entity.WeightKg = dto.WeightKg.Value;
        if (dto.HeightCm.HasValue) entity.HeightCm = dto.HeightCm.Value;
        if (dto.HeadCircumferenceCm.HasValue) entity.HeadCircumferenceCm = dto.HeadCircumferenceCm.Value;
        if (dto.Note != null) entity.Note = dto.Note;
    }
}
