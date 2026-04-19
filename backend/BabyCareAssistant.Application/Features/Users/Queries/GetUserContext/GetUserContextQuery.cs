using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Common.Interfaces;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;

namespace BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;

public record GetUserContextQuery ;

public sealed class GetUserContextQueryHandler(ICurrentUserService currentUserService, IUserRepository userRepository) {
    public async Task<Result<UserContextDto>> Handle(GetUserContextQuery request, CancellationToken cancellationToken)
    {
        var cognitoSubjectId = currentUserService.CognitoSubjectId;

        if (string.IsNullOrEmpty(cognitoSubjectId)) {
            return Result<UserContextDto>.Success(new UserContextDto { Status = "Unauthenticated" });
        }

        var userResult = await userRepository.GetUserWithFamiliesAsync(cognitoSubjectId, cancellationToken);

        if (userResult == null) {
            return Result<UserContextDto>.Success(new UserContextDto { Status = "UserNotFound" });
        }

        var u = userResult.Value.User;
        var members = userResult.Value.Members;
        var families = userResult.Value.Families;
        var babies = userResult.Value.Babies;

        return Result<UserContextDto>.Success(new UserContextDto {
            Status = "Ready",
            UserProfile = new UserProfileDto {
                Id = u.CognitoSubjectId,
                CognitoSubjectId = u.CognitoSubjectId,
                Email = u.Email,
                DisplayName = u.DisplayName,
            },
            Families = members.Select(fm => {
                var family = families.FirstOrDefault(f => f.PK == $"FAMILY#{fm.FamilyId}");
                if (family == null) return null;

                var fBabies = babies.Where(b => b.FamilyId == fm.FamilyId).ToList();

                return new ContextFamilyDto {
                    Id = family.PK.Replace("FAMILY#", ""),
                    Name = family.Name,
                    Role = (int)fm.Role,
                    Babies = fBabies.Select(b => new BabyDto {
                        Id = b.BabyId,
                        FirstName = b.FirstName,
                        LastName = b.LastName,
                        PreferredName = b.PreferredName,
                        DateOfBirth = b.DateOfBirth,
                        Gender = b.Gender
                    }).ToList()
                };
            }).Where(f => f != null).ToList()!
        });

    }
}
