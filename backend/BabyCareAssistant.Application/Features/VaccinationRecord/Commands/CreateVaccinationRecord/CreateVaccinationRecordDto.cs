using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.CreateVaccinationRecord;

public record CreateVaccinationRecordDto(
    [Required]
    Guid BabyId,

    [Required]
    Guid VaccineCatalogId,

    [Required]
    DateTime AdministeredAt,

    string? Notes
);
