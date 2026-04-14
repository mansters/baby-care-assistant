using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;
using BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;
using BabyCareAssistant.Domain.Entities;

namespace BabyCareAssistant.Application.Mappings;

public static class BabyMappingExtensions
{
    public static BabyDto ToDto(this Baby entity) => new()
    {
        Id = entity.BabyId,
        FirstName = entity.FirstName,
        LastName = entity.LastName,
        PreferredName = entity.PreferredName,
        DateOfBirth = entity.DateOfBirth,
        TimeZone = entity.TimeZone,
        Gender = entity.Gender
    };

    public static Baby ToEntity(this CreateBabyDto dto) => new()
    {
        FirstName = dto.FirstName,
        LastName = dto.LastName,
        PreferredName = dto.PreferredName,
        DateOfBirth = dto.DateOfBirth,
        Gender = dto.Gender ?? string.Empty
    };

    public static void UpdateEntity(this UpdateBabyDto dto, Baby entity)
    {
        entity.FirstName = dto.FirstName ?? entity.FirstName;
        entity.LastName = dto.LastName ?? entity.LastName;
        entity.PreferredName = dto.PreferredName ?? entity.PreferredName;
        entity.DateOfBirth = dto.DateOfBirth;
        entity.Gender = dto.Gender ?? entity.Gender;
    }
}
