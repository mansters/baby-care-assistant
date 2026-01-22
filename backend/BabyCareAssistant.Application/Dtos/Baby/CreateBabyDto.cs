using System.ComponentModel.DataAnnotations;

namespace BabyCareAssistant.Application.Dtos.Baby;

public record CreateBabyDto(
    [Required] string FirstName,
    [Required] string LastName,
    [Required] DateTime DateOfBirth
);