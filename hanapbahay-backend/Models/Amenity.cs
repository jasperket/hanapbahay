namespace hanapbahay_backend.Models;

public class Amenity
{
    public int Id { get; set; }
    public string Code { get; set; } = null!;
    public string? Label { get; set; }

    public ICollection<PropertyAmenity> PropertyAmenities { get; set; } = new List<PropertyAmenity>();
}