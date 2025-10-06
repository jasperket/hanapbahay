using AutoMapper;
using AutoMapper.QueryableExtensions;
using System;
using System.Collections.Generic;
using System.Linq;
using hanapbahay_backend.Data;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Models.Entities;
using hanapbahay_backend.Repositories.Generic;
using Microsoft.EntityFrameworkCore;

using PropertyEntity = hanapbahay_backend.Models.Entities.Property;

namespace hanapbahay_backend.Repositories.Property;

public class PropertyRepository : GenericRepository<PropertyEntity>, IPropertyRepository
{
    private readonly IMapper _mapper;

    public PropertyRepository(AppDbContext context, IMapper mapper)
        : base(context)
    {
        _mapper = mapper;
    }

    public async Task AddPropertyAsync(PropertyEntity property)
    {
        await _context.Properties.AddAsync(property);
    }

    public async Task<List<Amenity>> GetAmenitiesByCodesAsync(IEnumerable<string> codes)
    {
        if (codes is null)
            return new List<Amenity>();

        var codeSet = codes
            .Where(code => !string.IsNullOrWhiteSpace(code))
            .Select(code => code.Trim())
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        if (codeSet.Count == 0)
            return new List<Amenity>();

        return await _context.Amenities
            .Where(a => codeSet.Contains(a.Code))
            .ToListAsync();
    }

    public async Task<List<Amenity>> GetAllAmenitiesAsync()
    {
        return await _context.Amenities
            .AsNoTracking()
            .OrderBy(a => a.Label ?? a.Code)
            .ToListAsync();
    }

    public async Task<PropertyEntity?> GetPropertyDetailsAsync(int propertyId, bool asTracking = false)
    {
        IQueryable<PropertyEntity> query = _context.Properties
            .Where(p => p.Id == propertyId && !p.IsDeleted)
            .Include(p => p.Landlord)
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .Include(p => p.Media);

        if (!asTracking)
            query = query.AsNoTracking();

        return await query.FirstOrDefaultAsync();
    }

    public void RemovePropertyMedia(Media media)
    {
        _context.Media.Remove(media);
    }

    public async Task ReloadPropertyDetailsAsync(PropertyEntity property)
    {
        await _context.Entry(property).Reference(p => p.Landlord).LoadAsync();
        await _context.Entry(property)
            .Collection(p => p.PropertyAmenities)
            .Query()
            .Include(pa => pa.Amenity)
            .LoadAsync();
        await _context.Entry(property).Collection(p => p.Media).LoadAsync();
    }

    public new async Task SaveChangesAsync()
    {
        await base.SaveChangesAsync();
    }

    public async Task SetPropertyAmenitiesAsync(PropertyEntity property, IEnumerable<Amenity> amenities)
    {
        var amenityList = amenities?.ToList() ?? new List<Amenity>();
        if (!amenityList.Any())
            return;

        foreach (var amenity in amenityList)
        {
            _context.PropertyAmenities.Add(new PropertyAmenity
            {
                PropertyId = property.Id,
                AmenityId = amenity.Id
            });
        }

        await _context.SaveChangesAsync();

        property.PropertyAmenities = await _context.PropertyAmenities
            .Where(pa => pa.PropertyId == property.Id)
            .Include(pa => pa.Amenity)
            .ToListAsync();
    }

    public async Task UpdatePropertyAmenitiesAsync(PropertyEntity property, IEnumerable<Amenity> desiredAmenities)
    {
        var desiredList = desiredAmenities?.ToList() ?? new List<Amenity>();
        var desiredIds = desiredList.Select(a => a.Id).ToHashSet();
        var existing = property.PropertyAmenities.ToList();
        var existingIds = existing.Select(pa => pa.AmenityId).ToHashSet();

        var toRemove = existing.Where(pa => !desiredIds.Contains(pa.AmenityId)).ToList();
        foreach (var remove in toRemove)
        {
            _context.PropertyAmenities.Remove(remove);
        }

        var toAddIds = desiredIds.Except(existingIds).ToList();
        foreach (var amenityId in toAddIds)
        {
            _context.PropertyAmenities.Add(new PropertyAmenity
            {
                PropertyId = property.Id,
                AmenityId = amenityId
            });
        }

        await _context.SaveChangesAsync();

        property.PropertyAmenities = await _context.PropertyAmenities
            .Where(pa => pa.PropertyId == property.Id)
            .Include(pa => pa.Amenity)
            .ToListAsync();
    }

    public async Task<IEnumerable<PropertyResponse>> GetPropertiesAsync()
    {
        return await _context.Properties
            .AsNoTracking()
            .Where(p => !p.IsDeleted && p.Status == ListingStatus.Active)
            .OrderByDescending(p => p.CreatedAt)
            .ProjectTo<PropertyResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<IEnumerable<PropertyResponse>> GetPropertiesByLandlordAsync(Guid landlordId)
    {
        return await _context.Properties
            .AsNoTracking()
            .Where(p => !p.IsDeleted && p.LandlordId == landlordId)
            .OrderByDescending(p => p.CreatedAt)
            .ProjectTo<PropertyResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();
    }

    public async Task<(IEnumerable<PropertyResponse> Items, int TotalCount)>
    GetFilteredPropertiesAsync(PropertyQueryParameters parameters)
    {
        var query = _context.Properties
            .AsNoTracking()
            .Where(p => !p.IsDeleted)
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .AsQueryable();

        // Search by title
        if (!string.IsNullOrWhiteSpace(parameters.Search))
        {
            var term = parameters.Search.Trim().ToLower();
            query = query.Where(p => p.Title.ToLower().Contains(term));
        }

        // Filter by property type
        if (parameters.PropertyType.HasValue)
        {
            query = query.Where(p => (int)p.PropertyType == parameters.PropertyType.Value);
        }

        // Filter by amenities
        if (parameters.AmenityCodes != null && parameters.AmenityCodes.Any())
        {
            var codes = parameters.AmenityCodes.Select(a => a.Trim().ToUpper()).ToList();
            query = query.Where(p =>
                p.PropertyAmenities.Any(pa =>
                    codes.Contains(pa.Amenity.Code.ToUpper())));
        }

        // Pagination
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(p => p.CreatedAt)
            .Skip((parameters.Page - 1) * parameters.PageSize)
            .Take(parameters.PageSize)
            .ProjectTo<PropertyResponse>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return (items, totalCount);
    }

}
