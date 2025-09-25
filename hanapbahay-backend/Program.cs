using hanapbahay_backend.Data;
using hanapbahay_backend.Models.Entities;
using hanapbahay_backend.Services.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

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

builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddAutoMapper(cfg =>
{
    cfg.LicenseKey = "eyJhbGciOiJSUzI1NiIsImtpZCI6Ikx1Y2t5UGVubnlTb2Z0d2FyZUxpY2Vuc2VLZXkvYmJiMTNhY2I1OTkwNGQ4OWI0Y2IxYzg1ZjA4OGNjZjkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2x1Y2t5cGVubnlzb2Z0d2FyZS5jb20iLCJhdWQiOiJMdWNreVBlbm55U29mdHdhcmUiLCJleHAiOiIxNzkwMjk0NDAwIiwiaWF0IjoiMTc1ODc5MjE1NiIsImFjY291bnRfaWQiOiIwMTk5ODAyOGNiZDc3MjZlODg0NTA2YjFhOTY1NjdkNCIsImN1c3RvbWVyX2lkIjoiY3RtXzAxazYwMngxc2ZjNXpkOHhmZ20wYXgybjJtIiwic3ViX2lkIjoiLSIsImVkaXRpb24iOiIwIiwidHlwZSI6IjIifQ.YJ30oZOynBeL_vU1pGtW6g8Xb7-Fm9pEXLwF6RR1MG5IUv6I8CslmfE-D47xwdAS3X7O0nwuTANLYCg64A8ot8AxhBO1M26GdwDyUDeEw0dZQDW3K2IaZXKhsK-3y4m38w9_Sw6UdD7gj7b0IXxHcUbPyVEgvwzIyx9ClNwUDDHkrhkb_oEhpHOC1ehYTxia4U4frV3TE_XyIezgILc5YZJkRjBB3i5nzvPxIBSJ1bEAZ-N80RGPhvFPO_Xal-PIGIVS-_oJUFeNI8FKJgPZDXnaov2AC3F5TqtMorn7FDJrXlYPWEVwPYwuYrkCNmC79YyacInzZmY2jOWJNOmM7A";
    cfg.AddMaps(typeof(Program));
});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    db.Database.Migrate();
    await SeedData.SeedRolesAsync(scope.ServiceProvider);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseOpenApi();
    app.UseSwaggerUi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
