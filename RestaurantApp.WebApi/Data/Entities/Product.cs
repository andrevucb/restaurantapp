using System.ComponentModel.DataAnnotations;

namespace RestaurantApp.WebApi.Data.Entities;

public class Product
{
    public int Id { get; set; }

    [MaxLength(150)]
    public required string Name { get; set; }

    [MaxLength(250)]
    public required string Description { get; set; }

    public string? Image { get; set; }
    public int CategoryId { get; set; }

    public ProductCategory Category { get; set; } = null!;
}
