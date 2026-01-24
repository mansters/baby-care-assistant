using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.VaccinationRecord;

public record CreateVaccinationRecordDto(
    [Required]
    Guid BabyId,

    [Required]
    Guid VaccineCatalogId,

    [Required]
    DateTime AdministeredAt,

    string? Notes
);
