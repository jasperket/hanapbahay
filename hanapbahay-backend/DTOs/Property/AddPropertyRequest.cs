using System.ComponentModel.DataAnnotations;
using hanapbahay_backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace hanapbahay_backend.Dto.Property;

public class AddPropertyRequest
{
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

    public string[] AmenityCodes { get; set; } = Array.Empty<string>();
}
