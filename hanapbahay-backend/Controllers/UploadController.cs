using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IBlobStorageService _blobService;

    public UploadController(IBlobStorageService blobService)
    {
        _blobService = blobService;
    }

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        using var stream = file.OpenReadStream();
        var url = await _blobService.UploadFileAsync(stream, file.FileName, "images");

        return Ok(new { url });
    }
}
