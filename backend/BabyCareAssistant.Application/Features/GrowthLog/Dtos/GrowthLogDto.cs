namespace BabyCareAssistant.Application.Features.GrowthLog.Dtos;

public record GrowthLogDto(
    Guid Id,
    Guid BabyId,
    DateTime DateMeasured,
    decimal WeightKg,
    decimal? HeightCm,
    decimal? HeadCircumferenceCm,
    string? Note
);
