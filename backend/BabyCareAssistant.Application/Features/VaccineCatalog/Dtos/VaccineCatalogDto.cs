namespace BabyCareAssistant.Application.Features.VaccineCatalog.Dtos;

public record VaccineCatalogDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public decimal DueAtMonths { get; init; }
}
