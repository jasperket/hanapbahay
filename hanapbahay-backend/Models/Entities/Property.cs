using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace hanapbahay_backend.Models.Entities;

[Index(nameof(City))]
[Index(nameof(Province), nameof(City), nameof(ZipCode))]
[Index(nameof(Status), nameof(City), nameof(PropertyType))]
public class Property
{
    public int Id { get; set; }

    [Required]
    public Guid LandlordId { get; set; }
    public User Landlord { get; set; } = null!;

    [Required, StringLength(150, MinimumLength = 3)]
    public string Title { get; set; } = null!;

    [StringLength(2000)]
    public string? Description { get; set; }

    public PropertyType PropertyType { get; set; }

    [Required]
    public string Province { get; set; } = null!;
    [Required]
    public string City { get; set; } = null!;
    public string? Barangay { get; set; }
    public string? ZipCode { get; set; }

    public string? TargetLocation { get; set; }
    public string? Landmark { get; set; }

    [Precision(18, 2)]
    public decimal MonthlyPrice { get; set; }

    public byte? MaxPersons { get; set; }

    public DateTime? MoveInDate { get; set; }

    public ListingStatus Status { get; set; } = ListingStatus.Draft;

    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<PropertyAmenity> PropertyAmenities { get; set; } = new List<PropertyAmenity>();
    public ICollection<Media> Media { get; set; } = new List<Media>();
}
