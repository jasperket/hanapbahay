using System.ComponentModel.DataAnnotations;

namespace hanapbahay_backend.Models.Entities;

public class LandlordRating
{
    public int Id { get; set; }

    [Required]
    public Guid RenterId { get; set; }
    public User Renter { get; set; } = null!;

    [Required]
    public Guid LandlordId { get; set; }
    public User Landlord { get; set; } = null!;

    [Range(1, 5)]
    public int Score { get; set; }   // e.g., 1–5 stars

    [MaxLength(1000)]
    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}