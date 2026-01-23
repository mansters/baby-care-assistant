using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.GrowthLog;

public record CreateGrowthLogDto(
    [Required]
    Guid BabyId,

    [Required]
    DateTime DateMeasured,

    [Required]
    [Range(0, 999.99)]
    decimal? WeightKg,

    [Range(0, 400)]
    decimal? HeightCm,

    [Range(0, 400)]
    decimal? HeadCircumferenceCm
);