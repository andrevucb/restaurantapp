namespace RestaurantApp.WebApi.DTOs.ProductCategories;

public record class ProductCategoryResponse
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public List<ProductCategoryPriceResponse> Prices { get; set; } = [];
}

public record class ProductCategoryPriceResponse
{
    public int ProductSizeId { get; set; }
    public int Size { get; set; }
    public required string Unit { get; set; }
    public double Price { get; set; }
}