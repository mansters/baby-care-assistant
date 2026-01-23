namespace BabyCareAssistant.Application.Dtos.GrowthLog;

public record GrowthLogDto(
    Guid Id,
    Guid BabyId,
    DateTime DateMeasured,
    decimal WeightKg,
    decimal? HeightCm,
    decimal? HeadCircumferenceCm
);