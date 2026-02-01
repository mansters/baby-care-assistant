using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;

public record CreateExcretionLogDto(
    [Required]
    Guid BabyId,

    [Required]
    DateTime Time,

    [Required]
    ExcretionType Type,

    string? Notes
);
