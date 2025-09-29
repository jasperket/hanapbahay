using hanapbahay_backend.Data;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Repositories.Generic;

namespace hanapbahay_backend.Repositories.Property;

public class PropertyRepository : GenericRepository<Models.Entities.Property>, IPropertyRepository
{
    public PropertyRepository(AppDbContext context) : base(context)
    {
    }

    public Task AddPropertyAsync(AddPropertyRequest request)
    {
        throw new NotImplementedException();
    }
}
