using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Dtos;

public record ExcretionLogDto(
    Guid Id,
    Guid BabyId,
    DateTime Time,
    ExcretionType Type,
    string? Notes
);
