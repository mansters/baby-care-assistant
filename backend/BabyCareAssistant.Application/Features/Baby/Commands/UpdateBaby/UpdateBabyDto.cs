using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Features.Baby.Commands.UpdateBaby;

public record UpdateBabyDto
{
    [Required]
    public Guid Id { get; init; }

    [Required]
    public string FirstName { get; init; } = string.Empty;

    [Required]
    public string LastName { get; init; } = string.Empty;

    public string? PreferredName { get; init; }

    [Required]
    public DateTime DateOfBirth { get; init; }
}
