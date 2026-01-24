using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class VaccineCatalogRepository(BabyCareAssistantDbContext dbContext) : IVaccineCatalogRepository
{
    public async Task<List<VaccineCatalog>> GetAllAsync()
    {
        return await dbContext.VaccineCatalogs.ToListAsync();
    }

    public async Task<VaccineCatalog?> GetByIdAsync(Guid id)
    {
        return await dbContext.VaccineCatalogs.FindAsync(id);
    }

    public async Task<VaccineCatalog> CreateAsync(VaccineCatalog vaccineCatalog)
    {
        await dbContext.VaccineCatalogs.AddAsync(vaccineCatalog);
        await dbContext.SaveChangesAsync();
        return vaccineCatalog;
    }

    public async Task<VaccineCatalog?> UpdateAsync(VaccineCatalog vaccineCatalog)
    {
        var existingCatalog = await dbContext.VaccineCatalogs.FindAsync(vaccineCatalog.Id);

        if (existingCatalog == null)
        {
            return null;
        }
        
        existingCatalog.Name = vaccineCatalog.Name;
        existingCatalog.DueAtMonths = vaccineCatalog.DueAtMonths;
        
        await dbContext.SaveChangesAsync();

        return existingCatalog;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingCatalog = await dbContext.VaccineCatalogs.FindAsync(id);

        if (existingCatalog == null)
        {
            return false;
        }

        dbContext.VaccineCatalogs.Remove(existingCatalog);
        await dbContext.SaveChangesAsync();
        
        return true;
    }
}
