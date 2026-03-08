using Amazon.DynamoDBv2.Model;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Interfaces;

public interface IDynamoDbBaseRepository<T> where T : DynamoBaseEntity
{
    Task<T?> GetByKeyAsync(string pk, string sk, CancellationToken ct);
    Task<List<T>> GetListAsync(string pk, string skPrefix, bool ascending, int limit, string? cursor, CancellationToken ct, string? entityTypeFilter = null);
    Task<List<T>> GetListBeforeAsync(string pk, string skPrefix, DateTime maxTime, int limit, CancellationToken ct, string? entityTypeFilter = null);
    Task<T?> GetLatestAsync(string pk, string skPrefix, CancellationToken ct, string? entityTypeFilter = null);
    Task<T> CreateAsync(T entity, CancellationToken ct);
    Task<T?> UpdateAsync(string pk, string sk, Action<T> mutate, CancellationToken ct);
    Task<bool> DeleteAsync(string pk, string sk, CancellationToken ct);
}