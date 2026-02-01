using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.GrowthLog.Commands.CreateGrowthLog;

public record CreateGrowthLogDto(
    [Required]
    Guid BabyId,

    [Required]
    DateTime DateMeasured,

    [Required]
    [Range(0.01, 300)]
    decimal? WeightKg,

    [Range(0, 400)]
    decimal? HeightCm,

    [Range(0, 400)]
    decimal? HeadCircumferenceCm,

    [MaxLength(500)]
    string? Note
);
