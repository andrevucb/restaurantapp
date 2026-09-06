using System.ComponentModel.DataAnnotations;

namespace RestaurantApp.WebApi.DTOs.ProductCategories;

public record class ProductCategoryPriceRequest(
    [Required] int ProductSizeId,
    [Range(0, 500)] double Price
);
