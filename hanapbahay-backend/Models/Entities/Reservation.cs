namespace hanapbahay_backend.Models.Entities;

public class Reservation
{
    public int Id { get; set; }

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public Guid RenterId { get; set; }
    public User Renter { get; set; } = null!;

    public ReservationStatus Status { get; set; } = ReservationStatus.Proposed;

    public string? Note { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}