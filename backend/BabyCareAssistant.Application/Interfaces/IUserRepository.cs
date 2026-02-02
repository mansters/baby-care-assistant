using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetUserWithFamiliesAsync(string cognitoSubjectId);
}