using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RestaurantApp.WebApi.Data;
using RestaurantApp.WebApi.Data.Entities;
using RestaurantApp.WebApi.DTOs.Auth;
using RestaurantApp.WebApi.Services;

namespace RestaurantApp.WebApi.Endpoints;

public static class AuthEndpoints
{
    public static IEndpointRouteBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth")
                       .WithTags("Authentication");

        group.MapPost("/login", Login)
             .WithName("Login")
             .WithDescription("Authenticate a user and return a JWT token")
             .Accepts<LoginRequest>("application/json")
             .Produces<LoginResponse>(StatusCodes.Status200OK)
             .Produces(StatusCodes.Status400BadRequest)
             .Produces(StatusCodes.Status401Unauthorized);

        group.MapPost("/register", Register)
             .WithName("Register")
             .WithDescription("Register a new user")
             .Accepts<RegisterRequest>("application/json")
             .Produces<RegisterResponse>(StatusCodes.Status201Created)
             .Produces(StatusCodes.Status400BadRequest);

        return app;
    }

    private static async Task<IResult> Login(LoginRequest request, AppDbContext context, JwtTokenService jwtTokenService)
    {
        var user = await context.Users
            .SingleOrDefaultAsync(u => u.Username == request.Username);

        if (user is null)
            return TypedResults.Unauthorized();

        var hasher = new PasswordHasher<User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

        if (result == PasswordVerificationResult.Failed)
            return TypedResults.Unauthorized();

        var token = jwtTokenService.GenerateToken(user);

        return TypedResults.Ok(new LoginResponse(token));
    }

    private static async Task<IResult> Register(RegisterRequest request, AppDbContext context)
    {
        if (await context.Users.AnyAsync(u => u.Username == request.Username))
            return TypedResults.BadRequest(new { Message = "Username is already taken." });

        if (await context.Users.AnyAsync(u => u.Email == request.Email))
            return TypedResults.BadRequest(new { Message = "Email is already registered." });

        var hasher = new PasswordHasher<User>();
        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = string.Empty // Placeholder, will be set below
        };

        user.PasswordHash = hasher.HashPassword(user, request.Password);

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return TypedResults.Created($"/api/auth/users/{user.Id}", new RegisterResponse(user.Username, user.Email));
    }
}
