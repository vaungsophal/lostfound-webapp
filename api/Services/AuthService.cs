using MongoDB.Driver;
using api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace api.Services;

public class AuthService
{
    private readonly IMongoCollection<User> _users;
    private readonly string _jwtSecret;
    private readonly int _jwtExpiryHours;

    public AuthService(IMongoDatabase database)
    {
        _users = database.GetCollection<User>("users");
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "default-secret-key-change-in-production-min-32-chars";
        _jwtExpiryHours = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS") ?? "24");
    }

    public async Task<AuthResponse?> Register(RegisterRequest request)
    {
        var existingUser = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
        if (existingUser != null)
            return null;

        var user = new User
        {
            Email = request.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Name = request.Name,
            CreatedAt = DateTime.UtcNow
        };

        await _users.InsertOneAsync(user);

        var token = GenerateToken(user);
        return new AuthResponse
        {
            Token = token,
            User = new UserDto { Id = user.Id!, Email = user.Email, Name = user.Name }
        };
    }

    public async Task<AuthResponse?> Login(LoginRequest request)
    {
        var user = await _users.Find(u => u.Email == request.Email).FirstOrDefaultAsync();
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            return null;

        var token = GenerateToken(user);
        return new AuthResponse
        {
            Token = token,
            User = new UserDto { Id = user.Id!, Email = user.Email, Name = user.Name }
        };
    }

    public UserDto? GetCurrentUser(HttpContext context)
    {
        var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return null;

        var user = _users.Find(u => u.Id == userId).FirstOrDefault();
        if (user == null)
            return null;

        return new UserDto { Id = user.Id!, Email = user.Email, Name = user.Name };
    }

    private string GenerateToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwtSecret);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id!),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name)
            }),
            Expires = DateTime.UtcNow.AddHours(_jwtExpiryHours),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
