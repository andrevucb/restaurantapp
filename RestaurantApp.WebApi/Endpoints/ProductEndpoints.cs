using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data;
using RestaurantApp.WebApi.Data.Entities;
using RestaurantApp.WebApi.DTOs.Products;

namespace RestaurantApp.WebApi.Endpoints;

public static class ProductEndpoints
{
    public static IEndpointRouteBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products")
                       .WithTags("Products")
                       .RequireAuthorization();

        group.MapGet("/", GetAllProducts)
             .WithName("GetAllProducts")
             .WithDescription("Get all products")
             .Produces<IEnumerable<ProductResponse>>(StatusCodes.Status200OK);

        group.MapGet("/{id}", GetProductById)
             .WithName("GetProductById")
             .WithDescription("Get a product by id")
             .Produces<ProductResponse>(StatusCodes.Status200OK)
             .Produces(StatusCodes.Status404NotFound);

           group.MapPost("/", CreateProduct)
               .WithName("CreateProduct")
               .WithDescription("Create a product")
               .Accepts<Product>("multipart/form-data")
               .Produces<ProductResponse>(StatusCodes.Status201Created)
               .Produces(StatusCodes.Status400BadRequest);

           group.MapPut("/{id}", UpdateProduct)
               .WithName("UpdateProduct")
               .WithDescription("Update a product")
               .Accepts<Product>("multipart/form-data")
               .Produces<ProductResponse>(StatusCodes.Status200OK)
               .Produces(StatusCodes.Status400BadRequest)
               .Produces(StatusCodes.Status404NotFound);

        group.MapDelete("/{id}", DeleteProduct)
             .WithName("DeleteProduct")
             .WithDescription("Delete a product")
             .Produces(StatusCodes.Status204NoContent)
             .Produces(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<Ok<IEnumerable<ProductResponse>>> GetAllProducts(AppDbContext db)
    {
        var products = await db.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .ToListAsync();

        var productResponses = products.Select(p => new ProductResponse(
            p.Id,
            p.Name,
            p.Description,
            p.Image,
            p.CategoryId,
            new CategoryResponse(p.Category.Id, p.Category.Name)
        ));

        return TypedResults.Ok(productResponses);
    }

    private static async Task<Results<Ok<ProductResponse>, NotFound>> GetProductById(int id, AppDbContext db)
    {
        var product = await db.Products
            .Include(p => p.Category)
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product is null)
        {
            return TypedResults.NotFound();
        }

        var productResponse = new ProductResponse(
            product.Id,
            product.Name,
            product.Description,
            product.Image,
            product.CategoryId,
            new CategoryResponse(product.Category.Id, product.Category.Name)
        );

        return TypedResults.Ok(productResponse);
    }

    private static async Task<Results<Created<ProductResponse>, BadRequest>> CreateProduct(
        [FromForm] Product product,
        AppDbContext db)
    {
        if (!await db.ProductCategories.AnyAsync(category => category.Id == product.CategoryId))
        {
            return TypedResults.BadRequest();
        }

        db.Products.Add(product);
        await db.SaveChangesAsync();

        await db.Entry(product).Reference(p => p.Category).LoadAsync();

        var productResponse = new ProductResponse(
            product.Id,
            product.Name,
            product.Description,
            product.Image,
            product.CategoryId,
            new CategoryResponse(product.Category.Id, product.Category.Name)
        );

        return TypedResults.Created($"/api/products/{product.Id}", productResponse);
    }

    private static async Task<Results<Ok<ProductResponse>, NotFound, BadRequest>> UpdateProduct(
        int id,
        [FromForm] Product product,
        AppDbContext db)
    {
        var productEntity = await db.Products.FindAsync(id);

        if (productEntity is null)
        {
            return TypedResults.NotFound();
        }

        if (!await db.ProductCategories.AnyAsync(category => category.Id == product.CategoryId))
        {
            return TypedResults.BadRequest();
        }

        productEntity.Name = product.Name;
        productEntity.Description = product.Description;
        productEntity.Image = product.Image;
        productEntity.CategoryId = product.CategoryId;

        await db.SaveChangesAsync();
        await db.Entry(productEntity).Reference(p => p.Category).LoadAsync();

        var productResponse = new ProductResponse(
            productEntity.Id,
            productEntity.Name,
            productEntity.Description,
            productEntity.Image,
            productEntity.CategoryId,
            new CategoryResponse(productEntity.Category.Id, productEntity.Category.Name)
        );

        return TypedResults.Ok(productResponse);
    }

    private static async Task<Results<NoContent, NotFound>> DeleteProduct(int id, AppDbContext db)
    {
        var product = await db.Products.FindAsync(id);

        if (product is null)
        {
            return TypedResults.NotFound();
        }

        db.Products.Remove(product);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}
