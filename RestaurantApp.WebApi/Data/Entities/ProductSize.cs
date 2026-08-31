using System.ComponentModel.DataAnnotations;

namespace RestaurantApp.WebApi.Data.Entities;

public class ProductSize
{
    public int Id { get; set; }
    public int Size { get; set; }

    [MaxLength(100)]
    public required string Unit { get; set; }
}
