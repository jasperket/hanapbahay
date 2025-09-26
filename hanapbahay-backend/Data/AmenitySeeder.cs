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
            await amenityRepo.AddRangeAsync(new[]
            {
                new Amenity { Id = 1, Code = "OWN_CR_SINK",      Label = "Own CR/Sink" },
                new Amenity { Id = 2, Code = "COMMON_CR_SINK",   Label = "Common CR/Sink" },
                new Amenity { Id = 3, Code = "AIRCON",           Label = "With Aircon" },
                new Amenity { Id = 4, Code = "NON_AIRCON",       Label = "Non-Aircon" },
                new Amenity { Id = 5, Code = "MOTOR_PARK",       Label = "Motor Park" },
                new Amenity { Id = 6, Code = "CAR_PARK",         Label = "Car Park" },
                new Amenity { Id = 7, Code = "VISITORS_ALLOWED", Label = "Visitors Allowed" },
                new Amenity { Id = 8, Code = "PET_FRIENDLY",     Label = "Pet-Friendly" },
                new Amenity { Id = 9, Code = "CAN_COOK",         Label = "Can Cook" },
                new Amenity { Id = 10, Code = "DO_LAUNDRY",      Label = "Do Laundry" },
                new Amenity { Id = 11, Code = "NO_CURFEW",       Label = "No Curfew" },
                new Amenity { Id = 12, Code = "WITH_CURFEW",     Label = "With Curfew" }
            });
            await amenityRepo.SaveChangesAsync();
        }
    }
}

