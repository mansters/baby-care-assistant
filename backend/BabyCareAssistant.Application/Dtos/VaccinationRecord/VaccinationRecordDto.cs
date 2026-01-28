namespace BabyCareAssistant.Application.Dtos.VaccinationRecord;

public record VaccinationRecordDto(
    Guid Id,
    Guid BabyId,
    Guid VaccineCatalogId,
    DateTime AdministeredAt,
    string? Notes
);
