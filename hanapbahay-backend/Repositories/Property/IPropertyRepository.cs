using System;
using System.Collections.Generic;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Models.Entities;

using PropertyEntity = hanapbahay_backend.Models.Entities.Property;

namespace hanapbahay_backend.Repositories.Property;

public interface IPropertyRepository
{
    Task<IEnumerable<PropertyResponse>> GetPropertiesAsync();
    Task<IEnumerable<PropertyResponse>> GetPropertiesByLandlordAsync(Guid landlordId);
    Task<PropertyEntity?> GetPropertyDetailsAsync(int propertyId, bool asTracking = false);
    Task AddPropertyAsync(PropertyEntity property);
    Task SetPropertyAmenitiesAsync(PropertyEntity property, IEnumerable<Amenity> amenities);
    Task UpdatePropertyAmenitiesAsync(PropertyEntity property, IEnumerable<Amenity> desiredAmenities);
    Task ReloadPropertyDetailsAsync(PropertyEntity property);
    Task<List<Amenity>> GetAmenitiesByCodesAsync(IEnumerable<string> codes);
    void RemovePropertyMedia(Media media);
    Task SaveChangesAsync();
}
