using hanapbahay_backend.Dto.Property;

public interface IPropertyService
{
    Task<(bool Success, IEnumerable<string> Errors)> AddPropertyAsync(AddPropertyRequest request);
}