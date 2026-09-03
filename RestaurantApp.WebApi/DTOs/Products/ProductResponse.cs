namespace RestaurantApp.WebApi.DTOs.Products;

public record class ProductResponse(
    int Id,
    string Name,
    string Description,
    string? Image,
    int CategoryId,
    CategoryResponse Category
);

public record class CategoryResponse(
    int Id,
    string Name
);