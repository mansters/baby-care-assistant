namespace BabyCareAssistant.Application.Features.VaccineCatalog.Dtos;

public record VaccineCatalogDto(
    Guid Id,
    string Name,
    decimal DueAtMonths
);
