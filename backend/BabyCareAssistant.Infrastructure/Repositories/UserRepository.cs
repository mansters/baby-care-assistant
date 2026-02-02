using BabyCareAssistant.Application.Interfaces;
using BabyCareAssistant.Domain.Entities;
using BabyCareAssistant.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BabyCareAssistant.Infrastructure.Repositories;

public class UserRepository(BabyCareAssistantDbContext dbContext): IUserRepository
{
    public async Task<User?> GetUserWithFamiliesAsync(string cognitoSubjectId)
    {
        return await dbContext.Users.Include(u => u.FamilyMemberships)
            .ThenInclude(ff => ff.Family)
            .ThenInclude(ff => ff.Babies)
            .FirstOrDefaultAsync(u => u.CognitoSubjectId == cognitoSubjectId);
    }
}