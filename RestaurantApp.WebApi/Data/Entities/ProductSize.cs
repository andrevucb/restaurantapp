namespace RestaurantApp.WebApi.Data.Entities;

public class ProductSize
{
    public int Id { get; set; }
    public int Size { get; set; }
    public required string Unit { get; set; }
}
