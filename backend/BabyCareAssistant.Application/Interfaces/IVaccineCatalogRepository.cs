using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IVaccineCatalogRepository
{
    Task<List<VaccineCatalog>> GetAllAsync();
    Task<VaccineCatalog?> GetByIdAsync(Guid id);
    Task<VaccineCatalog> CreateAsync(VaccineCatalog vaccineCatalog);
    Task<VaccineCatalog?> UpdateAsync(VaccineCatalog vaccineCatalog);
    Task<bool> DeleteAsync(Guid id);
}
