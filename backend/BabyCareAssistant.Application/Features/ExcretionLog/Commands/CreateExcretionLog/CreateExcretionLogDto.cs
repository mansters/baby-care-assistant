using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.CreateExcretionLog;

public record CreateExcretionLogDto
{
    [Required]
    public Guid BabyId { get; init; }

    [Required]
    public DateTime Time { get; init; }

    [Required]
    public ExcretionType Type { get; init; }

    public string? Notes { get; init; }
}
