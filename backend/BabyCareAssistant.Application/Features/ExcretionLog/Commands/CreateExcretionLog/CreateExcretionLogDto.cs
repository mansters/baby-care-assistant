using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;

public record CreateExcretionLogDto
{
    [Required]
    public string BabyId { get; init; } = string.Empty;

    [Required]
    public DateTime EventTimeUtc { get; init; }

    [Required]
    public ExcretionType Type { get; init; }

    public string? Notes { get; init; }
}
