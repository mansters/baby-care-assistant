using System.ComponentModel.DataAnnotations;
using BabyCareAssistant.Domain.Enums;

namespace BabyCareAssistant.Application.Features.ExcretionLog.Commands.UpdateExcretionLog;

public record UpdateExcretionLogDto
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public DateTime Time { get; init; }

    [Required]
    public ExcretionType Type { get; init; }

    public string? Notes { get; init; }
}
