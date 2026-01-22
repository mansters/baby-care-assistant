using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class BabyRepository(BabyCareAssistantDbContext dbContext): IBabyRepository
{
    public async Task<List<Baby>> GetAllAsync()
    {
        return await dbContext.Babies.ToListAsync();
    }

    public async Task<Baby?> GetByIdAsync(Guid id)
    {
        return await dbContext.Babies.FindAsync(id);
    }

    public async Task<Baby> CreateAsync(Baby baby)
    {
        await dbContext.Babies.AddAsync(baby);
        await dbContext.SaveChangesAsync();
        return baby;
    }

    public async Task<Baby?> UpdateAsync(Baby baby)
    {
        var existingBaby = await GetByIdAsync(baby.Id);

        if (existingBaby == null)
        {
            return null;
        }
        
        existingBaby.FirstName = baby.FirstName;
        existingBaby.LastName = baby.LastName;
        existingBaby.DateOfBirth = baby.DateOfBirth;
        
        await dbContext.SaveChangesAsync();
        return existingBaby;
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var existingBaby = await GetByIdAsync(id);

        if (existingBaby == null)
        {
            return false;
        }

        dbContext.Remove(existingBaby);
        await dbContext.SaveChangesAsync();
        
        return true;
    }
}