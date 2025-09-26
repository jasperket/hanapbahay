using hanapbahay_backend.Models.Entities;

namespace hanapbahay_backend.Data;

public static class AmenityTypes
{
    public static readonly Amenity OWN_CR_SINK = new() { Id = 1, Code = "OWN_CR_SINK", Label = "Own CR/Sink" };
    public static readonly Amenity COMMON_CR_SINK = new() { Id = 2, Code = "COMMON_CR_SINK", Label = "Common CR/Sink" };
    public static readonly Amenity AIRCON = new() { Id = 3, Code = "AIRCON", Label = "With Aircon" };
    public static readonly Amenity NON_AIRCON = new() { Id = 4, Code = "NON_AIRCON", Label = "Non-Aircon" };
    public static readonly Amenity MOTOR_PARK = new() { Id = 5, Code = "MOTOR_PARK", Label = "Motor Park" };
    public static readonly Amenity CAR_PARK = new() { Id = 6, Code = "CAR_PARK", Label = "Car Park" };
    public static readonly Amenity VISITORS_ALLOWED = new() { Id = 7, Code = "VISITORS_ALLOWED", Label = "Visitors Allowed" };
    public static readonly Amenity PET_FRIENDLY = new() { Id = 8, Code = "PET_FRIENDLY", Label = "Pet-Friendly" };
    public static readonly Amenity CAN_COOK = new() { Id = 9, Code = "CAN_COOK", Label = "Can Cook" };
    public static readonly Amenity DO_LAUNDRY = new() { Id = 10, Code = "DO_LAUNDRY", Label = "Do Laundry" };
    public static readonly Amenity NO_CURFEW = new() { Id = 11, Code = "NO_CURFEW", Label = "No Curfew" };
    public static readonly Amenity WITH_CURFEW = new() { Id = 12, Code = "WITH_CURFEW", Label = "With Curfew" };

    public static IEnumerable<Amenity> All => new[]
    {
        OWN_CR_SINK,
        COMMON_CR_SINK,
        AIRCON,
        NON_AIRCON,
        MOTOR_PARK,
        CAR_PARK,
        VISITORS_ALLOWED,
        PET_FRIENDLY,
        CAN_COOK,
        DO_LAUNDRY,
        NO_CURFEW,
        WITH_CURFEW
    };
}
