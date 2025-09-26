namespace hanapbahay_backend.Models.Entities;

public class Conversation
{
    public long Id { get; set; }

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public Guid LandlordId { get; set; }
    public Guid RenterId { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastMessageAt { get; set; }

    public ICollection<Message> Messages { get; set; } = new List<Message>();
}