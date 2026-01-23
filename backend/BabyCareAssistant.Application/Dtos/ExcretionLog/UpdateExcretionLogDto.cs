using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Dtos.ExcretionLog;

public record UpdateExcretionLogDto(
    [Required]
    Guid Id,
    
    [Required]
    DateTime Time,

    [Required]
    ExcretionType Type,

    string? Notes
);
