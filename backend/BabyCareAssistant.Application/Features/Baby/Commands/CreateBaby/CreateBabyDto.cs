using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.Baby.Commands.CreateBaby;

public record CreateBabyDto(
    [Required] string FirstName,
    [Required] string LastName,
    string? PreferredName,
    [Required] DateTime DateOfBirth
);
