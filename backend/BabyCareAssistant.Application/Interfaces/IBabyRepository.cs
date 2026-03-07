using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IBabyRepository
{
    Task<Baby?> GetByIdAsync(string babyId, CancellationToken ct);
    Task<List<Baby>> GetByFamilyIdAsync(string familyId, CancellationToken ct);
    Task<Baby> CreateAsync(Baby baby, CancellationToken ct);
    Task<Baby?> UpdateAsync(string babyId, Baby item, CancellationToken ct);
    Task<bool> DeleteAsync(string babyId, CancellationToken ct);
}
