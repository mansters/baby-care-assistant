using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.VaccineCatalog.Commands.UpdateVaccineCatalog;

public record UpdateVaccineCatalogDto
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public string Name { get; init; } = string.Empty;

    [Required]
    [Range(0, 240)]
    public decimal DueAtMonths { get; init; }
}
