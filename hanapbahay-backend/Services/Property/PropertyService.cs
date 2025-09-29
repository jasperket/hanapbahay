using AutoMapper;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Models.Entities;
using hanapbahay_backend.Repositories.Generic;

public class PropertyService : IPropertyService
{
    private readonly IMapper _mapper;
    private readonly IGenericRepository<Property> _propertyRepository;
    private readonly IGenericRepository<Amenity> _amenityRepository;
    public PropertyService(IMapper mapper, IGenericRepository<Property> propertyRepository, IGenericRepository<Amenity> amenityRepository)
    {
        _mapper = mapper;
        _propertyRepository = propertyRepository;
        _amenityRepository = amenityRepository;
    }
    public Task<(bool Success, IEnumerable<string> Errors)> AddPropertyAsync(AddPropertyRequest request)
    {
        var property = _mapper.Map<Property>(request);
        throw new NotImplementedException();
    }
}