namespace RestaurantApp.WebApi.DTOs.ProductCategories;

public record class ProductCategoryResponse
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public List<ProductCategoryPriceResponse> Prices { get; set; } = [];

    public string GetProductPriceSummary()
    {
        return string.Join(", ", Prices.Select(p => 
            $"Bs. {p.Price:0.00} ({p.Size} {p.Unit})".Replace(".", ",")));
    }
}

public record class ProductCategoryPriceResponse
{
    public int ProductSizeId { get; set; }
    public int Size { get; set; }
    public required string Unit { get; set; }
    public double Price { get; set; }
}