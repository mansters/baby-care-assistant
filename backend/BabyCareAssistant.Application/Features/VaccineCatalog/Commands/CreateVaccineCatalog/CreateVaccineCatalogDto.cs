using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands.CreateVaccineCatalog;

public record CreateVaccineCatalogDto
{
    [Required]
    public string Name { get; init; } = string.Empty;

    [Required]
    [Range(0, 240)] // Up to 20 years (240 months)
    public decimal DueAtMonths { get; init; }
}
