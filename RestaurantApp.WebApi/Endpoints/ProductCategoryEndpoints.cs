using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data;
using RestaurantApp.WebApi.Data.Entities;
using RestaurantApp.WebApi.DTOs.ProductCategories;

namespace RestaurantApp.WebApi.Endpoints;

public static class ProductCategoryEndpoints
{
    public static IEndpointRouteBuilder MapProductCategoryEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/product-categories")
                       .WithTags("Product Categories");

        group.MapGet("/", GetAllProductCategories)
            .WithName("GetAllProductCategories")
            .WithDescription("Get all product categories")
            .Produces<IEnumerable<ProductCategoryResponse>>(StatusCodes.Status200OK);

        group.MapGet("/{id}", GetProductCategoryById)
            .WithName("GetProductCategoryById")
            .WithDescription("Get a product category by id")
            .Produces<ProductCategoryResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);

        group.MapPost("/", CreateProductCategory)
            .WithName("CreateProductCategory")
            .WithDescription("Create a new product category")
            .Accepts<CreateProductCategoryRequest>("application/json")
            .Produces<ProductCategory>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status400BadRequest);

        group.MapPut("/{id}", UpdateProductCategory)
            .WithName("UpdateProductCategory")
            .WithDescription("Update an existing product category")
            .Accepts<UpdateProductCategoryRequest>("application/json")
            .Produces<ProductCategory>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status400BadRequest)
            .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id}", DeleteProductCategory)
            .WithName("DeleteProductCategory")
            .WithDescription("Delete a product category")
            .Produces(StatusCodes.Status204NoContent)
            .Produces(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<Ok<IEnumerable<ProductCategoryResponse>>> GetAllProductCategories(AppDbContext db)
    {
        var categories = await db.ProductCategories
            .Include(p => p.Prices)
            .ThenInclude(p => p.ProductSize)
            .AsNoTracking()
            .ToListAsync();
        
        var categoryResponses = categories.Select(c => new ProductCategoryResponse
        {
            Id = c.Id,
            Name = c.Name,
            Prices = [.. c.Prices.Select(p => new ProductCategoryPriceResponse
            {
                ProductSizeId = p.ProductSizeId,
                Size = p.ProductSize.Size,
                Unit = p.ProductSize.Unit,
                Price = p.Price
            })]
        });

        return TypedResults.Ok(categoryResponses);
    }

    private static async Task<Results<Ok<ProductCategoryResponse>, NotFound>> GetProductCategoryById(int id, AppDbContext db)
    {
        var category = await db.ProductCategories
            .Include(p => p.Prices)
            .ThenInclude(p => p.ProductSize)
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);
        
        if (category is null)
            return TypedResults.NotFound();

        var categoryResponse = new ProductCategoryResponse
        {
            Id = category.Id,
            Name = category.Name,
            Prices = [.. category.Prices.Select(p => new ProductCategoryPriceResponse
            {
                ProductSizeId = p.ProductSizeId,
                Size = p.ProductSize.Size,
                Unit = p.ProductSize.Unit,
                Price = p.Price
            })]
        };

        return TypedResults.Ok(categoryResponse);
    }

    private static async Task<Created<ProductCategory>> CreateProductCategory(
        CreateProductCategoryRequest request, 
        AppDbContext db)
    {
        var category = new ProductCategory { Name = request.Name };
        
        db.ProductCategories.Add(category);
        await db.SaveChangesAsync();

        return TypedResults.Created($"/api/product-categories/{category.Id}", category);
    }

    private static async Task<Results<Ok<ProductCategory>, NotFound, BadRequest>> UpdateProductCategory(
        int id, 
        UpdateProductCategoryRequest request, 
        AppDbContext db)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return TypedResults.BadRequest();

        var category = await db.ProductCategories.FirstOrDefaultAsync(c => c.Id == id);
        
        if (category is null)
            return TypedResults.NotFound();

        category.Name = request.Name;
        await db.SaveChangesAsync();

        return TypedResults.Ok(category);
    }

    private static async Task<Results<NoContent, NotFound>> DeleteProductCategory(int id, AppDbContext db)
    {
        var category = await db.ProductCategories.FirstOrDefaultAsync(c => c.Id == id);
        
        if (category is null)
            return TypedResults.NotFound();

        db.ProductCategories.Remove(category);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}
