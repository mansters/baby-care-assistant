using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByCognitoIdAsync(string cognitoSubjectId, CancellationToken ct);
    Task<(User User, List<Family> Families, List<Baby> Babies)?> GetUserWithFamiliesAsync(string cognitoSubjectId, CancellationToken ct);
    Task<User> CreateAsync(User user, CancellationToken ct);
    Task<User?> UpdateAsync(string cognitoSubjectId, Action<User> mutate, CancellationToken ct);
}
