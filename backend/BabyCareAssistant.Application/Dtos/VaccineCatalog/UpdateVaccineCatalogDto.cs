using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.VaccineCatalog;

public record UpdateVaccineCatalogDto(
    [Required]
    Guid Id,

    [Required]
    string Name,

    [Required]
    [Range(0, 240)]
    decimal DueAtMonths
);
