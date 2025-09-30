
namespace hanapbahay_backend.Dto.Property;

public class PropertyCreateRequest : AddPropertyRequest
{
    public IEnumerable<IFormFile> Images { get; set; } = Array.Empty<IFormFile>();
}

