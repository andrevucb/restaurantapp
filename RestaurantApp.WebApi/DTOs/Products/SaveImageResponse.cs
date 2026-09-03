namespace RestaurantApp.WebApi.DTOs.Products;

public record class SaveImageResponse(
    bool Success,
    string? Path,
    string? ErrorMessage
);
