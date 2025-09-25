using System.ComponentModel.DataAnnotations;
using hanapbahay_backend.Models.Entities;

namespace hanapbahay_backend.Dto.Auth;

public class RegisterRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Required, MinLength(6)]
    public string Password { get; set; } = null!;

    [Required, MaxLength(80)]
    public string DisplayName { get; set; } = null!;

    // Defaults to Renter if not provided
    public UserRole Role { get; set; } = UserRole.Renter;
}