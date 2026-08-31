using System.ComponentModel.DataAnnotations;

namespace RestaurantApp.WebApi.Data.Entities;

public class ProductCategory
{
    public int Id { get; set; }

    [MaxLength(150)]
    public required string Name { get; set; }
}
