using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data.Entities;

namespace RestaurantApp.WebApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<ProductPrice> ProductPrices { get; set; }
    public DbSet<ProductSize> ProductSizes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);

        optionsBuilder.UseSeeding((context, _) =>
        {
            if (!context.Set<ProductSize>().Any())
            {
                context.Set<ProductSize>().AddRange(
                [
                    new() { Unit = "porciones", Size = 4 },
                    new() { Unit = "porciones", Size = 6 },
                    new() { Unit = "porciones", Size = 8 },
                    new() { Unit = "porciones", Size = 10 }
                ]);

                context.SaveChanges();
            }
        });
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProductPrice>()
            .HasKey(pp => new {pp.ProductCategoryId, pp.ProductSizeId});
    }
}
