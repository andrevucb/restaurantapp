namespace RestaurantApp.WebApi.Data.Entities;

public class ProductPrice
{
    public int ProductCategoryId { get; set; }
    public int ProductSizeId { get; set; }
    public double Price { get; set; }
}
