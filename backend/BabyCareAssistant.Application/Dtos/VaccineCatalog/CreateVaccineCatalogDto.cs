using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.VaccineCatalog;

public record CreateVaccineCatalogDto(
    [Required]
    string Name,

    [Required]
    [Range(0, 240)] // Up to 20 years (240 months)
    decimal DueAtMonths
);
