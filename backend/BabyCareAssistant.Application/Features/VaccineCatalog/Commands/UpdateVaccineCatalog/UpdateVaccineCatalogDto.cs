using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands.UpdateVaccineCatalog;

public record UpdateVaccineCatalogDto(
    [Required]
    Guid Id,

    [Required]
    string Name,

    [Required]
    [Range(0, 240)]
    decimal DueAtMonths
);
