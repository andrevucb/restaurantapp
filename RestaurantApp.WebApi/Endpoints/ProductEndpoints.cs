using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data;
using RestaurantApp.WebApi.Data.Entities;
using RestaurantApp.WebApi.DTOs.Products;

namespace RestaurantApp.WebApi.Endpoints;

public static class ProductEndpoints
{
    private const long MaxImageSize = 5 * 1024 * 1024;

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
        [FromForm] IFormFile? image,
        IConfiguration configuration,
        AppDbContext db)
    {
        if (!await db.ProductCategories.AnyAsync(category => category.Id == product.CategoryId))
        {
            return TypedResults.BadRequest();
        }

        if (!IsValidImage(image))
        {
            return TypedResults.BadRequest();
        }

        product.Image = await SaveImage(image, configuration);
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
        [FromForm] IFormFile? image,
        IConfiguration configuration,
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

        if (!IsValidImage(image))
        {
            return TypedResults.BadRequest();
        }

        productEntity.Name = product.Name;
        productEntity.Description = product.Description;
        productEntity.CategoryId = product.CategoryId;

        if (image is not null)
        {
            var previousImage = productEntity.Image;
            productEntity.Image = await SaveImage(image, configuration);
            DeleteImage(previousImage, configuration);
        }

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

    private static async Task<string?> SaveImage(IFormFile? image, IConfiguration configuration)
    {
        if (image is null || image.Length == 0)
        {
            return null;
        }

        var uploadPath = GetUploadPath(configuration);
        Directory.CreateDirectory(uploadPath);

        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadPath, fileName);

        await using var stream = File.Create(filePath);
        await image.CopyToAsync(stream);

        return $"/uploads/{fileName}";
    }

    private static bool IsValidImage(IFormFile? image)
    {
        return image is null ||
            (image.Length > 0 && image.Length <= MaxImageSize &&
             image.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase));
    }

    private static void DeleteImage(string? imagePath, IConfiguration configuration)
    {
        if (string.IsNullOrWhiteSpace(imagePath))
        {
            return;
        }

        var fileName = Path.GetFileName(imagePath);
        var filePath = Path.Combine(GetUploadPath(configuration), fileName);

        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
    }

    private static string GetUploadPath(IConfiguration configuration)
    {
        var configuredPath = configuration["FileStorage:UploadPath"] ?? "wwwroot/uploads";
        return Path.GetFullPath(configuredPath);
    }

    private static async Task<Results<NoContent, NotFound>> DeleteProduct(
        int id,
        IConfiguration configuration,
        AppDbContext db)
    {
        var product = await db.Products.FindAsync(id);

        if (product is null)
        {
            return TypedResults.NotFound();
        }

        DeleteImage(product.Image, configuration);
        db.Products.Remove(product);
        await db.SaveChangesAsync();

        return TypedResults.NoContent();
    }
}
