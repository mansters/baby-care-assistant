using BabyCareAssistant.Application.Features.FeedingLog.Dtos;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.CreateFeedingLog;
using BabyCareAssistant.Application.Features.FeedingLog.Commands.UpdateFeedingLog;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Mappings;

public static class FeedingLogMappingExtensions
{
    public static FeedingLogDto ToDto(this FeedingLog entity) => new()
    {
        SK = entity.SK,
        BabyId = entity.BabyId,
        Type = entity.Type,
        AmountMl = entity.AmountMl,
        LeftBreastDurationMinutes = entity.LeftBreastDurationMinutes,
        RightBreastDurationMinutes = entity.RightBreastDurationMinutes,
        Note = entity.Note,
        EventTimeUtc = entity.EventTimeUtc,
        LocalDate = entity.LocalDate,
        LocalTime = entity.LocalTime
    };

    public static FeedingLog ToEntity(this CreateFeedingLogDto dto) => new()
    {
        Type = dto.Type ?? default,
        AmountMl = dto.AmountMl,
        LeftBreastDurationMinutes = dto.LeftBreastDurationMinutes,
        RightBreastDurationMinutes = dto.RightBreastDurationMinutes,
        Note = dto.Note
    };

    public static void UpdateEntity(this UpdateFeedingLogDto dto, FeedingLog entity)
    {
        entity.UpdateTime(dto.EventTimeUtc);
        if (dto.Type.HasValue) entity.Type = dto.Type.Value;
        entity.AmountMl = dto.AmountMl;
        if (dto.LeftBreastDurationMinutes.HasValue) entity.LeftBreastDurationMinutes = dto.LeftBreastDurationMinutes.Value;
        if (dto.RightBreastDurationMinutes.HasValue) entity.RightBreastDurationMinutes = dto.RightBreastDurationMinutes.Value;
        if (dto.Note != null) entity.Note = dto.Note;
    }
}
