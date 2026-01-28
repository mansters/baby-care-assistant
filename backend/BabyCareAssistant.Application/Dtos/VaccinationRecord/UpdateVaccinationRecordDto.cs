using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.VaccinationRecord;

public record UpdateVaccinationRecordDto(
    [Required]
    Guid Id,

    [Required]
    DateTime AdministeredAt,

    string? Notes
);
