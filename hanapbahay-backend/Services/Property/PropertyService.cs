using AutoMapper;
using hanapbahay_backend.Data;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Models.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using PropertyEntity = hanapbahay_backend.Models.Entities.Property;

namespace hanapbahay_backend.Services.Property;

public class PropertyService : IPropertyService
{
    private const string PropertyImagesContainer = "property-images";

    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly IBlobStorageService _blobStorageService;
    private readonly ILogger<PropertyService> _logger;

    public PropertyService(
        AppDbContext context,
        IMapper mapper,
        IBlobStorageService blobStorageService,
        ILogger<PropertyService> logger)
    {
        _context = context;
        _mapper = mapper;
        _blobStorageService = blobStorageService;
        _logger = logger;
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

    public async Task<PropertyResponse?> GetPropertyByIdAsync(int propertyId)
    {
        var property = await _context.Properties
            .AsNoTracking()
            .Include(p => p.Landlord)
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .Include(p => p.Media)
            .FirstOrDefaultAsync(p => p.Id == propertyId && !p.IsDeleted);

        return property is null
            ? null
            : _mapper.Map<PropertyResponse>(property);
    }

    public async Task<(bool Success, PropertyResponse? Property, IEnumerable<string> Errors)> AddPropertyAsync(Guid landlordId, PropertyCreateRequest request)
    {
        var (amenitiesValid, amenities, amenityErrors) = await ResolveAmenitiesAsync(request.AmenityCodes);
        if (!amenitiesValid)
            return (false, null, amenityErrors);

        var property = _mapper.Map<PropertyEntity>(request);
        property.LandlordId = landlordId;
        property.CreatedAt = DateTime.UtcNow;
        property.IsDeleted = false;

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        await SetPropertyAmenitiesAsync(property, amenities);
        await UploadImagesAsync(property, request.Images);
        RenumberMedia(property);
        EnsureCoverImage(property);

        await _context.Entry(property).Reference(p => p.Landlord).LoadAsync();
        await _context.Entry(property)
            .Collection(p => p.PropertyAmenities)
            .Query()
            .Include(pa => pa.Amenity)
            .LoadAsync();
        await _context.Entry(property).Collection(p => p.Media).LoadAsync();

        await _context.SaveChangesAsync();

        var response = _mapper.Map<PropertyResponse>(property);
        return (true, response, Array.Empty<string>());
    }

    public async Task<(bool Success, PropertyResponse? Property, IEnumerable<string> Errors)> UpdatePropertyAsync(int propertyId, Guid landlordId, PropertyUpdateRequest request)
    {
        var property = await _context.Properties
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .Include(p => p.Media)
            .Include(p => p.Landlord)
            .FirstOrDefaultAsync(p => p.Id == propertyId && !p.IsDeleted);

        if (property is null)
            return (false, null, new[] { "Property not found." });

        if (property.LandlordId != landlordId)
            return (false, null, new[] { "You can only update your own properties." });

        var (amenitiesValid, amenities, amenityErrors) = await ResolveAmenitiesAsync(request.AmenityCodes);
        if (!amenitiesValid)
            return (false, null, amenityErrors);

        ApplyPropertyFields(property, request);
        await UpdatePropertyAmenitiesAsync(property, amenities);

        if (request.RemoveImageIds.Length > 0)
            await RemovePropertyImagesAsync(property, request.RemoveImageIds);

        await UploadImagesAsync(property, request.NewImages);
        RenumberMedia(property);
        EnsureCoverImage(property);

        await _context.SaveChangesAsync();

        await _context.Entry(property)
            .Collection(p => p.PropertyAmenities)
            .Query()
            .Include(pa => pa.Amenity)
            .LoadAsync();
        await _context.Entry(property).Collection(p => p.Media).LoadAsync();

        var response = _mapper.Map<PropertyResponse>(property);
        return (true, response, Array.Empty<string>());
    }

    public async Task<(bool Success, IEnumerable<string> Errors)> DeletePropertyAsync(int propertyId, Guid landlordId, bool allowAdminOverride = false)
    {
        var property = await _context.Properties
            .Include(p => p.Media)
            .FirstOrDefaultAsync(p => p.Id == propertyId && !p.IsDeleted);

        if (property is null)
            return (false, new[] { "Property not found." });

        if (!allowAdminOverride && property.LandlordId != landlordId)
            return (false, new[] { "You can only delete your own properties." });

        foreach (var media in property.Media.ToList())
        {
            await DeleteBlobAsync(media.Url);
            _context.Media.Remove(media);
        }

        property.IsDeleted = true;
        property.Status = ListingStatus.Removed;

        await _context.SaveChangesAsync();
        return (true, Array.Empty<string>());
    }

    private static void ApplyPropertyFields(PropertyEntity property, AddPropertyRequest request)
    {
        property.Title = request.Title;
        property.Description = request.Description;
        property.PropertyType = request.PropertyType;
        property.Province = request.Province;
        property.City = request.City;
        property.Barangay = request.Barangay;
        property.ZipCode = request.ZipCode;
        property.TargetLocation = request.TargetLocation;
        property.Landmark = request.Landmark;
        property.MonthlyPrice = request.MonthlyPrice;
        property.MaxPersons = request.MaxPersons;
        property.MoveInDate = request.MoveInDate;
        property.Status = request.Status;
    }

    private async Task SetPropertyAmenitiesAsync(PropertyEntity property, IEnumerable<Amenity> amenities)
    {
        if (!amenities.Any())
            return;

        foreach (var amenity in amenities)
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

    private async Task UpdatePropertyAmenitiesAsync(PropertyEntity property, IEnumerable<Amenity> desiredAmenities)
    {
        var desiredIds = desiredAmenities.Select(a => a.Id).ToHashSet();
        var existingIds = property.PropertyAmenities.Select(pa => pa.AmenityId).ToHashSet();

        var toRemove = property.PropertyAmenities
            .Where(pa => !desiredIds.Contains(pa.AmenityId))
            .ToList();

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

    private async Task UploadImagesAsync(PropertyEntity property, IEnumerable<IFormFile> files)
    {
        if (files is null)
            return;

        var existingCount = property.Media.Count;
        var index = 0;

        foreach (var file in files)
        {
            if (file is null || file.Length == 0)
                continue;

            var blobName = BuildBlobName(property.Id, file.FileName);

            try
            {
                using var stream = file.OpenReadStream();
                var url = await _blobStorageService.UploadFileAsync(stream, blobName, PropertyImagesContainer);

                var media = new Media
                {
                    PropertyId = property.Id,
                    Url = url,
                    Order = existingCount + index,
                    IsCover = property.Media.Count == 0 && index == 0
                };

                property.Media.Add(media);
                index++;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to upload image for property {PropertyId}", property.Id);
            }
        }
    }

    private async Task RemovePropertyImagesAsync(PropertyEntity property, IEnumerable<int> mediaIds)
    {
        var ids = mediaIds.ToHashSet();
        if (ids.Count == 0)
            return;

        var toRemove = property.Media.Where(m => ids.Contains(m.Id)).ToList();
        foreach (var media in toRemove)
        {
            await DeleteBlobAsync(media.Url);
            _context.Media.Remove(media);
            property.Media.Remove(media);
        }
    }

    private async Task DeleteBlobAsync(string url)
    {
        try
        {
            var blobName = ExtractBlobName(url);
            if (blobName is not null)
            {
                await _blobStorageService.DeleteFileAsync(blobName, PropertyImagesContainer);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to delete blob for url {BlobUrl}", url);
        }
    }

    private static void RenumberMedia(PropertyEntity property)
    {
        var ordered = property.Media
            .OrderBy(m => m.Order)
            .ThenBy(m => m.Id)
            .ToList();

        for (var i = 0; i < ordered.Count; i++)
        {
            ordered[i].Order = i;
        }
    }

    private static void EnsureCoverImage(PropertyEntity property)
    {
        if (!property.Media.Any())
            return;

        var ordered = property.Media
            .OrderBy(m => m.Order)
            .ThenBy(m => m.Id)
            .ToList();

        var existingCover = ordered.FirstOrDefault(m => m.IsCover);
        var cover = existingCover ?? ordered.First();

        foreach (var media in ordered)
        {
            media.IsCover = media == cover;
        }
    }

    private static string BuildBlobName(int propertyId, string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = ".img";
        }

        var safeExtension = extension.Replace("\0", string.Empty);
        var uniqueName = $"property-{propertyId}-{Guid.NewGuid():N}{safeExtension}";
        return uniqueName;
    }

    private static string? ExtractBlobName(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            return null;

        if (!Uri.TryCreate(url, UriKind.Absolute, out var uri))
            return url;

        var path = uri.AbsolutePath.TrimStart('/');
        if (path.StartsWith(PropertyImagesContainer + '/', StringComparison.OrdinalIgnoreCase))
        {
            return path[(PropertyImagesContainer.Length + 1)..];
        }

        return path;
    }

    private async Task<(bool Success, List<Amenity> Amenities, IEnumerable<string> Errors)> ResolveAmenitiesAsync(IEnumerable<string> amenityCodes)
    {
        var codes = amenityCodes?
            .Where(code => !string.IsNullOrWhiteSpace(code))
            .Select(code => code.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray() ?? Array.Empty<string>();

        if (codes.Length == 0)
            return (true, new List<Amenity>(), Array.Empty<string>());

        var comparer = StringComparer.OrdinalIgnoreCase;
        var codeSet = new HashSet<string>(codes, comparer);

        var amenities = await _context.Amenities
            .Where(a => codeSet.Contains(a.Code))
            .ToListAsync();

        if (amenities.Count == codes.Length)
            return (true, amenities, Array.Empty<string>());

        var foundCodes = amenities.Select(a => a.Code).ToHashSet(comparer);
        var missing = codes.Where(code => !foundCodes.Contains(code)).ToArray();
        var errors = missing.Select(code => $"Amenity code '{code}' is invalid.").ToArray();
        return (false, amenities, errors);
    }
}
