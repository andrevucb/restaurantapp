namespace RestaurantApp.WebApi.DTOs.Auth;

public record class RegisterRequest(
    string Username,
    string Email,
    string Password
);
