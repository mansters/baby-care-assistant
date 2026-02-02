using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.UpdateVaccinationRecord;

public record UpdateVaccinationRecordDto
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public DateTime AdministeredAt { get; init; }

    public string? Notes { get; init; }
}
