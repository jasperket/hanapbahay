using Microsoft.EntityFrameworkCore;
using hanapbahay_backend.Models.Entities;

namespace hanapbahay_backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Property> Properties { get; set; } = null!;
    public DbSet<Amenity> Amenities { get; set; } = null!;
    public DbSet<PropertyAmenity> PropertyAmenities { get; set; } = null!;
    public DbSet<Media> Media { get; set; } = null!;
    public DbSet<Wishlist> Wishlists { get; set; } = null!;
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<Message> Messages { get; set; } = null!;
    public DbSet<Reservation> Reservations { get; set; } = null!;
    public DbSet<Report> Reports { get; set; } = null!;
    public DbSet<LandlordRating> LandlordRatings { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // PropertyAmenity (many-to-many composite key)
        modelBuilder.Entity<PropertyAmenity>()
            .HasKey(pa => new { pa.PropertyId, pa.AmenityId });

        modelBuilder.Entity<PropertyAmenity>()
            .HasOne(pa => pa.Property)
            .WithMany(p => p.Amenities)
            .HasForeignKey(pa => pa.PropertyId);

        modelBuilder.Entity<PropertyAmenity>()
            .HasOne(pa => pa.Amenity)
            .WithMany(a => a.PropertyAmenities)
            .HasForeignKey(pa => pa.AmenityId);

        // Wishlist (composite key)
        modelBuilder.Entity<Wishlist>()
            .HasKey(w => new { w.UserId, w.PropertyId });

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.User)
            .WithMany(u => u.Wishlists)
            .HasForeignKey(w => w.UserId);

        modelBuilder.Entity<Wishlist>()
            .HasOne(w => w.Property)
            .WithMany()
            .HasForeignKey(w => w.PropertyId);

        // Conversation
        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Property)
            .WithMany()
            .HasForeignKey(c => c.PropertyId);

        // Message
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId);

        // Reservation → Property
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Property)
            .WithMany()
            .HasForeignKey(r => r.PropertyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Reservation → Renter (User)
        modelBuilder.Entity<Reservation>()
            .HasOne(r => r.Renter)
            .WithMany()
            .HasForeignKey(r => r.RenterId)
            .OnDelete(DeleteBehavior.Restrict);

        // Report
        modelBuilder.Entity<Report>()
            .HasOne(r => r.Reporter)
            .WithMany()
            .HasForeignKey(r => r.ReporterId);

        // LandlordRating
        modelBuilder.Entity<LandlordRating>()
            .HasOne(lr => lr.Renter)
            .WithMany(u => u.RatingsGiven)
            .HasForeignKey(lr => lr.RenterId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<LandlordRating>()
            .HasOne(lr => lr.Landlord)
            .WithMany(u => u.RatingsReceived)
            .HasForeignKey(lr => lr.LandlordId)
            .OnDelete(DeleteBehavior.Restrict);

        // Optional: prevent duplicate ratings (one per renter per landlord)
        modelBuilder.Entity<LandlordRating>()
            .HasIndex(lr => new { lr.RenterId, lr.LandlordId })
            .IsUnique();

        modelBuilder.Entity<Property>()
            .HasOne(p => p.Landlord)
            .WithMany(u => u.Properties)
            .HasForeignKey(p => p.LandlordId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}