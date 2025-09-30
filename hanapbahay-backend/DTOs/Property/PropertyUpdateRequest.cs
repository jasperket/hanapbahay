using Microsoft.AspNetCore.Http;

namespace hanapbahay_backend.Dto.Property;

public class PropertyUpdateRequest : AddPropertyRequest
{
    public IEnumerable<IFormFile> NewImages { get; set; } = Array.Empty<IFormFile>();
    public int[] RemoveImageIds { get; set; } = Array.Empty<int>();
}

