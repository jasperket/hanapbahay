using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace hanapbahay_backend.Models;

[Index(nameof(Province))]
[Index(nameof(City))]
[Index(nameof(Province), nameof(City), nameof(ZipCode))]
public class PropertyItem
{
    public int Id { get; set; }

    [Required]
    [StringLength(150, MinimumLength = 3,
        ErrorMessage = "Property name must be 3-150 characters long.")]
    public string Name { get; set; } = default!;

    [StringLength(2000,
        ErrorMessage = "Description must be at most 2000 characters long.")]
    public string? Description { get; set; }

    [Required]
    public PropertyType PropertyType { get; set; }

    [Required]
    public CRType CRType { get; set; }

    [Required]
    public ParkingType ParkingType { get; set; }

    // If price can be missing, make it nullable. Enforce > 0 if needed.
    [Precision(18, 2)]
    [Range(0, 999999999.99, ErrorMessage = "Price must be between 0 and 999,999,999.99.")]
    public decimal Price { get; set; }

    [Range(0, 100000, ErrorMessage = "Units must be between 0 and 100000.")]
    public int Units { get; set; } = 1;

    // Address fields (can be moved to an owned type if you prefer)
    [Required]
    [StringLength(200, MinimumLength = 3,
        ErrorMessage = "Street address must be 3-200 characters long.")]
    public string StreetAddress { get; set; } = default!;

    [Required]
    [StringLength(100, MinimumLength = 2,
        ErrorMessage = "City must be 2-100 characters long.")]
    public string City { get; set; } = default!;

    [Required]
    [StringLength(100, MinimumLength = 2,
        ErrorMessage = "Province must be 2-100 characters long.")]
    public string Province { get; set; } = default!;

    [Required]
    [RegularExpression(@"^\d{4}$", ErrorMessage = "Zip code must be 4 digits.")]
    public string ZipCode { get; set; } = default!;

    public bool HasAircon { get; set; }
    public bool VisitorsAllowed { get; set; }
    public bool PetsAllowed { get; set; }
    public bool LaundryAllowed { get; set; }
    public bool HasCurfew { get; set; }

    // Optional, but highly recommended
    [Timestamp]
    public byte[] RowVersion { get; set; } = default!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
}

public enum PropertyType
{
    Unknown = 0,
    House = 1,
    Condominium = 2,
    Apartment = 3,
    Dormitory = 4,
    Room = 5,
    BedSpace = 6,
}

public enum CRType
{
    Unknown = 0,
    HasCommonCR = 1,
    HasOwnCR = 2
}

public enum ParkingType
{
    Unknown = 0,
    NoParking = 1,
    MotorParking = 2,
    CarParking = 3
}
