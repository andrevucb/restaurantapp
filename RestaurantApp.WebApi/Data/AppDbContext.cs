using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data.Entities;

namespace RestaurantApp.WebApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<ProductPrice> ProductPrices { get; set; }
    public DbSet<ProductSize> ProductSizes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ProductPrice>()
            .HasKey(pp => new {pp.ProductCategoryId, pp.ProductSizeId});
    }
}
