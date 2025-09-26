using hanapbahay_backend.Models.Entities;
using hanapbahay_backend.Repositories.Generic;

namespace hanapbahay_backend.Data;

public static class AmenitySeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var amenityRepo = services.GetRequiredService<IGenericRepository<Amenity>>();

        // Seed Amenities
        var amenities = await amenityRepo.GetAllAsync();
        if (!amenities.Any())
        {
            await amenityRepo.AddRangeAsync(AmenityTypes.All);
            await amenityRepo.SaveChangesAsync();
        }
    }
}

