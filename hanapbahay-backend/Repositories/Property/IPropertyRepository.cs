using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Repositories.Generic;

namespace hanapbahay_backend.Repositories.Property;

public interface IPropertyRepository
{
    Task AddPropertyAsync(AddPropertyRequest request);
}