using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands.CreateVaccineCatalog;

public record CreateVaccineCatalogDto(
    [Required]
    string Name,

    [Required]
    [Range(0, 240)] // Up to 20 years (240 months)
    decimal DueAtMonths
);
