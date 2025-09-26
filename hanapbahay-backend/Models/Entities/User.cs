using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace hanapbahay_backend.Models.Entities;

public class User : IdentityUser<Guid>
{
    [Required, MaxLength(80)]
    public string DisplayName { get; set; } = null!;

    public UserRole Role { get; set; } = UserRole.Renter;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Property> Properties { get; set; } = new List<Property>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<LandlordRating> RatingsGiven { get; set; } = new List<LandlordRating>();
    public ICollection<LandlordRating> RatingsReceived { get; set; } = new List<LandlordRating>();
}

