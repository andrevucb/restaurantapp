using System.ComponentModel.DataAnnotations;

namespace RestaurantApp.WebApi.DTOs.ProductCategories;

public record class UpdateProductCategoryRequest(
    [Required, StringLength(150, MinimumLength = 3)] string Name,
    List<ProductCategoryPriceRequest> Prices
);
