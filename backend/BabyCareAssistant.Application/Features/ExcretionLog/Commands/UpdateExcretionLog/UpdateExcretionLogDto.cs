using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;

public record UpdateExcretionLogDto(
    [Required]
    Guid Id,
    
    [Required]
    DateTime Time,

    [Required]
    ExcretionType Type,

    string? Notes
);
