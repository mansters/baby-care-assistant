using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.CreateVaccinationRecord;

public record CreateVaccinationRecordDto
{
    [Required]
    public Guid BabyId { get; init; }

    [Required]
    public Guid VaccineCatalogId { get; init; }

    [Required]
    public DateTime AdministeredAt { get; init; }

    public string? Notes { get; init; }
}
