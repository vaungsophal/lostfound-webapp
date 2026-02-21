using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using api.Models;
using api.Services;

var builder = WebApplication.CreateBuilder(args);

DotNetEnv.Env.Load();

var mongoUri = Environment.GetEnvironmentVariable("MONGODB_URI") ?? "mongodb://localhost:27017";
var databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE") ?? "lostfound";
var frontendUrl = Environment.GetEnvironmentVariable("FRONTEND_URL") ?? "http://localhost:4200";
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? "your-super-secret-key-change-in-production-min-32-chars";

builder.Services.AddSingleton<IMongoClient>(new MongoClient(mongoUri));
builder.Services.AddScoped<IMongoDatabase>(sp => sp.GetRequiredService<IMongoClient>().GetDatabase(databaseName));
builder.Services.AddScoped<ItemService>();
builder.Services.AddScoped<AuthService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/register", ([FromServices] AuthService authService, [FromBody] RegisterRequest request) => authService.Register(request));
app.MapPost("/api/auth/login", ([FromServices] AuthService authService, [FromBody] LoginRequest request) => authService.Login(request));
app.MapGet("/api/auth/me", ([FromServices] AuthService authService, HttpContext context) => authService.GetCurrentUser(context)).RequireAuthorization();

app.MapGet("/api/items", ([FromServices] ItemService itemService) => itemService.GetAllItems());
app.MapGet("/api/items/{id}", ([FromServices] ItemService itemService, string id) => itemService.GetItemById(id));
app.MapGet("/api/items/type/{type}", ([FromServices] ItemService itemService, string type) => itemService.GetItemsByType(type));
app.MapPost("/api/items", ([FromServices] ItemService itemService, [FromBody] Item item) => itemService.CreateItem(item)).RequireAuthorization();
app.MapPut("/api/items/{id}", ([FromServices] ItemService itemService, string id, [FromBody] Item item) => itemService.UpdateItem(id, item)).RequireAuthorization();
app.MapDelete("/api/items/{id}", ([FromServices] ItemService itemService, string id) => itemService.DeleteItem(id)).RequireAuthorization();

app.Run();
