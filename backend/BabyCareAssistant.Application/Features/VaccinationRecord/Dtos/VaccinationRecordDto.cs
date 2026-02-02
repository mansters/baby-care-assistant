namespace BabyCareAssistant.Application.Features.VaccinationRecord.Dtos;

public record VaccinationRecordDto
{
    public Guid Id { get; init; }
    public Guid BabyId { get; init; }
    public Guid VaccineCatalogId { get; init; }
    public DateTime AdministeredAt { get; init; }
    public string? Notes { get; init; }
}
