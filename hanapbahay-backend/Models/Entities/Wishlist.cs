namespace hanapbahay_backend.Models.Entities;

public class Wishlist
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}