using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.Baby;

public record UpdateBabyDto(
    [Required] Guid Id,
    [Required] string FirstName,
    [Required] string LastName,
    [Required] DateTime DateOfBirth
);