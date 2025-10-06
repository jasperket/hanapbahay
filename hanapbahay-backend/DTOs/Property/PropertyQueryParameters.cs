namespace hanapbahay_backend.Dto.Property;

public class PropertyQueryParameters
{
    public string? Search { get; set; }
    public int? PropertyType { get; set; }
    public List<string>? AmenityCodes { get; set; } = new();
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
