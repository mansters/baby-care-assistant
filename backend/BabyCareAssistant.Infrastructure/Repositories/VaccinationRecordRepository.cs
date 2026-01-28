using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class VaccinationRecordRepository(BabyCareAssistantDbContext dbContext) : IVaccinationRecordRepository
{
    public async Task<List<VaccinationRecord>> GetAllAsync()
    {
        return await dbContext.VaccinationRecords
            .Include(r => r.VaccineCatalog) // Include catalog information
            .Include(r => r.Baby) // Include baby information if needed
            .ToListAsync();
    }

    public async Task<VaccinationRecord?> GetByIdAsync(Guid id)
    {
        return await dbContext.VaccinationRecords
            .Include(r => r.VaccineCatalog)
            .Include(r => r.Baby)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<VaccinationRecord> CreateAsync(VaccinationRecord vaccinationRecord)
    {
        await dbContext.VaccinationRecords.AddAsync(vaccinationRecord);
        await dbContext.SaveChangesAsync();
        return vaccinationRecord;
    }

    public async Task<VaccinationRecord?> UpdateAsync(VaccinationRecord vaccinationRecord)
    {
        var existingRecord = await dbContext.VaccinationRecords.FindAsync(vaccinationRecord.Id);

        if (existingRecord == null)
        {
            return null;
        }
        
        existingRecord.AdministeredAt = vaccinationRecord.AdministeredAt;
        existingRecord.Notes = vaccinationRecord.Notes;
        
        await dbContext.SaveChangesAsync();

        return existingRecord;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingRecord = await dbContext.VaccinationRecords.FindAsync(id);

        if (existingRecord == null)
        {
            return false;
        }

        dbContext.VaccinationRecords.Remove(existingRecord);
        await dbContext.SaveChangesAsync();
        
        return true;
    }
}
