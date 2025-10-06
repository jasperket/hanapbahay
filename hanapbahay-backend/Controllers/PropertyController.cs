using System.Security.Claims;
using System.Linq;
using hanapbahay_backend.Dto.Property;
using hanapbahay_backend.Services.Property;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hanapbahay_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertyController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly ILogger<PropertyController> _logger;

    public PropertyController(IPropertyService propertyService, ILogger<PropertyController> logger)
    {
        _propertyService = propertyService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetProperties()
    {
        var properties = await _propertyService.GetPropertiesAsync();
        return Ok(properties);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> GetFilteredProperties([FromQuery] PropertyQueryParameters parameters)
    {
        var result = await _propertyService.GetFilteredPropertiesAsync(parameters);
        return Ok(result);
    }

    [HttpGet("mine")]
    [Authorize(Roles = "Landlord")]
    public async Task<IActionResult> GetLandlordProperties()
    {
        var landlordId = GetUserId();
        if (landlordId is null)
            return Unauthorized();

        var properties = await _propertyService.GetLandlordPropertiesAsync(landlordId.Value);
        return Ok(properties);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetProperty(int id)
    {
        var property = await _propertyService.GetPropertyByIdAsync(id);
        if (property is null)
            return NotFound();

        return Ok(property);
    }

    [HttpGet("amenities")]
    public async Task<IActionResult> GetAmenities()
    {
        var amenities = await _propertyService.GetAmenityOptionsAsync();
        return Ok(amenities);
    }

    [HttpPost]
    [Authorize(Roles = "Landlord")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateProperty([FromForm] PropertyCreateRequest request)
    {
        var landlordId = GetUserId();
        if (landlordId is null)
            return Unauthorized();

        var (success, property, errors) = await _propertyService.AddPropertyAsync(landlordId.Value, request);
        if (!success || property is null)
            return BadRequest(new { errors });

        return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = "Landlord")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateProperty(int id, [FromForm] PropertyUpdateRequest request)
    {
        var landlordId = GetUserId();
        if (landlordId is null)
            return Unauthorized();

        var (success, property, errors) = await _propertyService.UpdatePropertyAsync(id, landlordId.Value, request);
        if (!success || property is null)
            return MapErrorResult(errors);

        return Ok(property);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Landlord")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        var landlordId = GetUserId();
        if (landlordId is null)
            return Unauthorized();

        var (success, errors) = await _propertyService.DeletePropertyAsync(id, landlordId.Value);
        return success ? NoContent() : MapErrorResult(errors);
    }

    private IActionResult MapErrorResult(IEnumerable<string> errors)
    {
        var errorList = errors?.ToList() ?? new List<string>();
        if (errorList.Count == 0)
            return BadRequest(new { errors = Array.Empty<string>() });

        if (errorList.Any(e => e.Contains("not found", StringComparison.OrdinalIgnoreCase)))
            return NotFound(new { errors = errorList });

        if (errorList.Any(e => e.Contains("only", StringComparison.OrdinalIgnoreCase) && e.Contains("your", StringComparison.OrdinalIgnoreCase)))
            return Forbid();

        return BadRequest(new { errors = errorList });
    }

    private Guid? GetUserId()
    {
        var userIdValue = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (Guid.TryParse(userIdValue, out var userId))
            return userId;

        _logger.LogWarning("Unable to resolve user id from claims.");
        return null;
    }
}
