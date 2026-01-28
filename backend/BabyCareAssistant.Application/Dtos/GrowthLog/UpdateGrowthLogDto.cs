using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.GrowthLog;

public record UpdateGrowthLogDto(
    [Required]
    Guid Id,
    
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