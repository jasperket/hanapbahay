// Services/Auth/AuthService.cs
using AutoMapper;
using hanapbahay_backend.Dto.Auth;
using hanapbahay_backend.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace hanapbahay_backend.Services.Auth;

public class AuthService : IAuthService
{
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, IMapper mapper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
    }

    public async Task<(bool Success, IEnumerable<string> Errors)> RegisterAsync(RegisterRequest request)
    {
        var user = _mapper.Map<User>(request);

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return (false, result.Errors.Select(e => e.Description));

        await _userManager.AddToRoleAsync(user, request.Role.ToString());
        return (true, Enumerable.Empty<string>());
    }

    public async Task<(bool Success, string? Role)> LoginAsync(LoginRequest request)
    {
        var result = await _signInManager.PasswordSignInAsync(
            request.Email,
            request.Password,
            isPersistent: false,
            lockoutOnFailure: false);

        if (!result.Succeeded)
            return (false, null);

        var user = await _userManager.FindByEmailAsync(request.Email);
        return (true, user?.Role.ToString());
    }

    public async Task LogoutAsync()
    {
        await _signInManager.SignOutAsync();
    }
}
