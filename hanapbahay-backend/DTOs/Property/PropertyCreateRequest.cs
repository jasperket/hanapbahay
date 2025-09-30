
namespace hanapbahay_backend.Dto.Property;

public class PropertyCreateRequest : AddPropertyRequest
{
    public IFormFile[] Images { get; set; } = Array.Empty<IFormFile>();
}

