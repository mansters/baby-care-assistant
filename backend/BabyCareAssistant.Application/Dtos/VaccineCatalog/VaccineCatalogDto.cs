namespace BabyCareAssistant.Application.Dtos.VaccineCatalog;

public record VaccineCatalogDto(
    Guid Id,
    string Name,
    decimal DueAtMonths
);
