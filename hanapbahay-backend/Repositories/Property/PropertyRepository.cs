using hanapbahay_backend.Data;
using hanapbahay_backend.Dto.Property;

namespace hanapbahay_backend.Repositories.Property;

public class PropertyRepository : IPropertyRepository
{
    private readonly AppDbContext _context;

    public PropertyRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddPropertyAsync(AddPropertyRequest request)
    {
        throw new NotImplementedException();
    }
}