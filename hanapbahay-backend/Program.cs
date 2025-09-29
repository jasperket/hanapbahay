using hanapbahay_backend.Data;
using hanapbahay_backend.Models.Entities;
using hanapbahay_backend.Services.Auth;
using hanapbahay_backend.Services.Property;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using hanapbahay_backend.Repositories.Generic;
using Microsoft.Extensions.Azure;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApiDocument();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthorization();

builder.Services.AddIdentityApiEndpoints<User>()
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AppDbContext>();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.LicenseKey = builder.Configuration["AutoMapper:LicenseKey"];
    cfg.AddMaps(typeof(Program));
});

builder.Services.AddAzureClients(clientBuilder =>
{
    var tenantId = builder.Configuration["Azure:AZURE_TENANT_ID"];
    var clientId = builder.Configuration["Azure:AZURE_CLIENT_ID"];
    var clientSecret = builder.Configuration["Azure:AZURE_CLIENT_SECRET"];

    clientBuilder.AddBlobServiceClient(new Uri("https://rentahanstorage.blob.core.windows.net"));

    clientBuilder.UseCredential(new ClientSecretCredential(tenantId, clientId, clientSecret));
});

// Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBlobStorageService, BlobStorageService>();
builder.Services.AddScoped<IPropertyService, PropertyService>();

// Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
    await IdentitySeeder.SeedRolesAsync(scope.ServiceProvider);
    await AmenitySeeder.SeedAsync(scope.ServiceProvider);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
