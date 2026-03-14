using BabyCareAssistant.Application.Features.ExcretionLog.Dtos;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;
using BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Mappings;

public static class ExcretionLogMappingExtensions
{
    public static ExcretionLogDto ToDto(this ExcretionLog entity) => new()
    {
        SK = entity.SK,
        BabyId = entity.BabyId,
        Type = entity.Type,
        Notes = entity.Notes,
        EventTimeUtc = entity.EventTimeUtc,
        LocalDate = entity.LocalDate,
        LocalTime = entity.LocalTime
    };

    public static ExcretionLog ToEntity(this CreateExcretionLogDto dto) => new()
    {
        Type = dto.Type,
        Notes = dto.Notes
    };

    public static void UpdateEntity(this UpdateExcretionLogDto dto, ExcretionLog entity)
    {
        entity.Type = dto.Type;
        if (dto.Notes != null) entity.Notes = dto.Notes;
    }
}
