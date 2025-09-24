using System.ComponentModel.DataAnnotations;

namespace hanapbahay_backend.Models.Entities;

public class User
{
    public Guid Id { get; set; }

    [Required, MaxLength(80)]
    public string DisplayName { get; set; } = null!;

    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Phone]
    public string? Phone { get; set; }

    public UserRole Role { get; set; } = UserRole.Renter;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Property> Properties { get; set; } = new List<Property>();
    public ICollection<Wishlist> Wishlists { get; set; } = new List<Wishlist>();
    public ICollection<LandlordRating> RatingsGiven { get; set; } = new List<LandlordRating>(); // as renter
    public ICollection<LandlordRating> RatingsReceived { get; set; } = new List<LandlordRating>(); // as landlord

}

