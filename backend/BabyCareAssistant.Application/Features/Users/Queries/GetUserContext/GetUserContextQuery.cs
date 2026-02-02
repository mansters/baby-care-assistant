using BabyCareAssistant.Application.Common;
using BabyCareAssistant.Application.Common.Interfaces;
using BabyCareAssistant.Application.Features.Baby.Dtos;
using BabyCareAssistant.Application.Interfaces;
using MediatR;

namespace BabyCareAssistant.Application.Features.Users.Queries.GetUserContext;

public record GetUserContextQuery : IRequest<Result<UserContextDto>>;

internal sealed class GetUserContextQueryHandler(ICurrentUserService currentUserService, IUserRepository userRepository) : IRequestHandler<GetUserContextQuery, Result<UserContextDto>>
{
    public async Task<Result<UserContextDto>> Handle(GetUserContextQuery request, CancellationToken cancellationToken)
    {
        var cognitoSubjectId = currentUserService.CognitoSubjectId;

        if (string.IsNullOrEmpty(cognitoSubjectId)) {
            return Result<UserContextDto>.Success(new UserContextDto { Status = "Unauthenticated" });
        }

        var user = await userRepository.GetUserWithFamiliesAsync(cognitoSubjectId);

        if (user == null) {
            return Result<UserContextDto>.Success(new UserContextDto { Status = "UserNotFound" });
        }

        return Result<UserContextDto>.Success(new UserContextDto {
            Status = "Ready",
            UserProfile = new UserProfileDto {
                Id = user.Id,
                CognitoSubjectId = user.CognitoSubjectId,
                Email = user.Email,
                DisplayName = user.DisplayName,
            },
            Families = user.FamilyMemberships.Select(fm => new ContextFamilyDto {
                Id = fm.Family.Id,
                Name = fm.Family.Name,
                Role = (int)fm.Role,
                Babies = fm.Family.Babies.Select(b => new BabyDto {
                    Id = b.Id,
                    FirstName = b.FirstName,
                    LastName = b.LastName,
                    PreferredName = b.PreferredName,
                    DateOfBirth = b.DateOfBirth
                }).ToList()
            }).ToList()
        });

    }
}
