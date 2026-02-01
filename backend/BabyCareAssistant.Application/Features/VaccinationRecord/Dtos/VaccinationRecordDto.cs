namespace BabyCareAssistant.Application.Features.VaccinationRecord.Dtos;

public record VaccinationRecordDto(
    Guid Id,
    Guid BabyId,
    Guid VaccineCatalogId,
    DateTime AdministeredAt,
    string? Notes
);
