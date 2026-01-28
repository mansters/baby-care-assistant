using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IVaccinationRecordRepository
{
    Task<List<VaccinationRecord>> GetAllAsync();
    Task<VaccinationRecord?> GetByIdAsync(Guid id);
    Task<VaccinationRecord> CreateAsync(VaccinationRecord vaccinationRecord);
    Task<VaccinationRecord?> UpdateAsync(VaccinationRecord vaccinationRecord);
    Task<bool> DeleteAsync(Guid id);
}
