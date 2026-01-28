using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Dtos.ExcretionLog;

public record ExcretionLogDto(
    Guid Id,
    Guid BabyId,
    DateTime Time,
    ExcretionType Type,
    string? Notes
);
