using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Dtos.ExcretionLog;

public record CreateExcretionLogDto(
    [Required]
    Guid BabyId,

    [Required]
    DateTime Time,

    [Required]
    ExcretionType Type,

    string? Notes
);
