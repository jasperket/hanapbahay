namespace hanapbahay_backend.Models.Entities;

public enum UserRole : byte
{
    Renter = 0,
    Landlord = 1,
    Admin = 2
}

public enum PropertyType : byte
{
    House = 0,
    Condo = 1,
    Apartment = 2,
    BedSpacer = 3,
    Dorm = 4,
    Room = 5
}

public enum ListingStatus : byte
{
    Draft = 0,
    Active = 1,
    Paused = 2,
    Reserved = 3,
    Rented = 4,
    Removed = 5
}

public enum ReservationStatus : byte
{
    Proposed = 0,
    Accepted = 1,
    Declined = 2,
    Cancelled = 3,
    Completed = 4
}

public enum ReportTargetType : byte
{
    User = 0,
    Property = 1,
    Message = 2
}