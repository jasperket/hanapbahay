using hanapbahay_backend.Dto.Auth;

namespace hanapbahay_backend.Services.Auth;

public interface IAuthService
{
    Task<(bool Success, IEnumerable<string> Errors)> RegisterAsync(RegisterRequest request);
    Task<(bool Success, string? Role)> LoginAsync(LoginRequest request);
    Task LogoutAsync();
}