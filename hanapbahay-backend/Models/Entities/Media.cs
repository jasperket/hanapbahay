namespace hanapbahay_backend.Models.Entities;

public class Media
{
    public int Id { get; set; }

    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;

    public string Url { get; set; } = null!;
    public int Order { get; set; } = 0;
    public bool IsCover { get; set; } = false;
}