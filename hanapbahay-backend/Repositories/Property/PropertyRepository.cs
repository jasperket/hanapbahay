using AutoMapper;
using hanapbahay_backend.Data;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Repositories.Generic;
using Microsoft.EntityFrameworkCore;

namespace hanapbahay_backend.Repositories.Property;

public class PropertyRepository : GenericRepository<Models.Entities.Property>, IPropertyRepository
{
    private readonly IMapper _mapper;
    public PropertyRepository(AppDbContext context, IMapper mapper)
        : base(context)
    {
        _mapper = mapper;
    }

    public Task AddPropertyAsync(AddPropertyRequest request)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<PropertyResponse>> GetPropertiesAsync()
    {
        var properties = await _context.Properties
            .AsNoTracking()
            .Where(p => !p.IsDeleted)
            .Include(p => p.Landlord)
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .Include(p => p.Media)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<PropertyResponse>>(properties);
    }

    public async Task<IEnumerable<PropertyResponse>> GetPropertiesByLandlordAsync(Guid landlordId)
    {
        var properties = await _context.Properties
            .AsNoTracking()
            .Where(p => !p.IsDeleted && p.LandlordId == landlordId)
            .Include(p => p.Landlord)
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .Include(p => p.Media)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();

        return _mapper.Map<IEnumerable<PropertyResponse>>(properties);
    }
}
