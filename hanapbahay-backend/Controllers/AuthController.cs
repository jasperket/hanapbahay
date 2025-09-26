using hanapbahay_backend.Dto.Auth;
using hanapbahay_backend.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace hanapbahay_backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var (success, errors) = await _authService.RegisterAsync(request);
        if (!success)
        {
            foreach (var error in errors)
            {
                _logger.LogWarning("Error:" + error);
            }
            return BadRequest(new { errors });
        }

        return Ok(new { message = "User registered successfully", role = request.Role });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var (success, role) = await _authService.LoginAsync(request);
        if (!success)
        {
            _logger.LogWarning("Invalid credentials");
            return Unauthorized(new { message = "Invalid credentials" });
        }

        return Ok(new { message = "Login successful", role });
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        await _authService.LogoutAsync();
        return Ok(new { message = "Logout successful" });
    }
}
