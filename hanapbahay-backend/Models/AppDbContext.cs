using Microsoft.EntityFrameworkCore;
using hanapbahay_backend.Models;

namespace hanapbahay_backend.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<PropertyItem> Properties { get; set; } = null!;
}