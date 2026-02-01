using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccinationRecord.Commands.UpdateVaccinationRecord;

public record UpdateVaccinationRecordDto(
    [Required]
    Guid Id,

    [Required]
    DateTime AdministeredAt,

    string? Notes
);
