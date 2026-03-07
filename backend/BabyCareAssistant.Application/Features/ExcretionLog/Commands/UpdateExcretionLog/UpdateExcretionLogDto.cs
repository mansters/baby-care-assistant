using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;

public record UpdateExcretionLogDto
{
    [Required]
    public string BabyId { get; init; } = string.Empty;

    [Required]
    public string SK { get; init; } = string.Empty;

    [Required]
    public DateTime LocalDateTime { get; init; }

    [Required]
    public ExcretionType Type { get; init; }

    public string? Notes { get; init; }
}
