using hanapbahay_backend.Models.Entities;

namespace hanapbahay_backend.Dto.Property;

public class PropertyResponse
{
    public int Id { get; set; }
    public Guid LandlordId { get; set; }
    public string LandlordDisplayName { get; set; } = null!;

    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public PropertyType PropertyType { get; set; }

    public string Province { get; set; } = null!;
    public string City { get; set; } = null!;
    public string? Barangay { get; set; }
    public string? ZipCode { get; set; }

    public string? TargetLocation { get; set; }
    public string? Landmark { get; set; }

    public decimal MonthlyPrice { get; set; }
    public byte? MaxPersons { get; set; }
    public DateTime? MoveInDate { get; set; }
    public ListingStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public string[] AmenityCodes { get; set; } = Array.Empty<string>();
    public IEnumerable<PropertyMediaResponse> Media { get; set; } = Array.Empty<PropertyMediaResponse>();
}

