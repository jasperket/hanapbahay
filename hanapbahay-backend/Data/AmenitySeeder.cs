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
                new Amenity { Code = "OWN_CR_SINK",      Label = "Own CR/Sink" },
                new Amenity { Code = "COMMON_CR_SINK",   Label = "Common CR/Sink" },
                new Amenity { Code = "AIRCON",           Label = "With Aircon" },
                new Amenity { Code = "NON_AIRCON",       Label = "Non-Aircon" },
                new Amenity { Code = "MOTOR_PARK",       Label = "Motor Park" },
                new Amenity { Code = "CAR_PARK",         Label = "Car Park" },
                new Amenity { Code = "VISITORS_ALLOWED", Label = "Visitors Allowed" },
                new Amenity { Code = "PET_FRIENDLY",     Label = "Pet-Friendly" },
                new Amenity { Code = "CAN_COOK",         Label = "Can Cook" },
                new Amenity { Code = "DO_LAUNDRY",      Label = "Do Laundry" },
                new Amenity { Code = "NO_CURFEW",       Label = "No Curfew" },
                new Amenity { Code = "WITH_CURFEW",     Label = "With Curfew" }
            });
            await amenityRepo.SaveChangesAsync();
        }
    }
}

