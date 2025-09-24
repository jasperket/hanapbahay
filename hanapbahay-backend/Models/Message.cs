namespace hanapbahay_backend.Models;

public class Message
{
    public long Id { get; set; }

    public long ConversationId { get; set; }
    public Conversation Conversation { get; set; } = null!;

    public Guid SenderId { get; set; }

    public string Body { get; set; } = null!;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;

    public bool IsRead { get; set; } = false;
}