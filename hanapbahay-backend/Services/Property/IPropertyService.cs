using hanapbahay_backend.Dto.Property;

namespace hanapbahay_backend.Services.Property;

public interface IPropertyService
{
    Task<IEnumerable<PropertyResponse>> GetPropertiesAsync();
    Task<IEnumerable<PropertyResponse>> GetLandlordPropertiesAsync(Guid landlordId);
    Task<PropertyResponse?> GetPropertyByIdAsync(int propertyId);
    Task<IEnumerable<AmenityOptionResponse>> GetAmenityOptionsAsync();
    Task<(bool Success, PropertyResponse? Property, IEnumerable<string> Errors)> AddPropertyAsync(Guid landlordId, PropertyCreateRequest request);
    Task<(bool Success, PropertyResponse? Property, IEnumerable<string> Errors)> UpdatePropertyAsync(int propertyId, Guid landlordId, PropertyUpdateRequest request);
    Task<(bool Success, IEnumerable<string> Errors)> DeletePropertyAsync(int propertyId, Guid landlordId, bool allowAdminOverride = false);
}