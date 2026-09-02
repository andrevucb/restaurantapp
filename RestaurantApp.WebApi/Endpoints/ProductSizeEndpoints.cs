using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data;
using RestaurantApp.WebApi.Data.Entities;

namespace RestaurantApp.WebApi.Endpoints;

public static class ProductSizeEndpoints
{
    public static IEndpointRouteBuilder MapProductSizeEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/product-sizes")
                       .WithTags("Product Sizes");

        group.MapGet("/", GetAllProductSizes)
            .WithName("GetAllProductSizes")
            .WithDescription("Get all product sizes")
            .Produces<List<ProductSize>>(StatusCodes.Status200OK);

        return app;
    }

    private static async Task<Ok<List<ProductSize>>> GetAllProductSizes(AppDbContext db)
    {
        var sizes = await db.ProductSizes.AsNoTracking().ToListAsync();

        return TypedResults.Ok(sizes);
    }
}
