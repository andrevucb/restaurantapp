namespace RestaurantApp.WebApi.DTOs.Auth;

public record class LoginRequest(
    string Username,
    string Password
);
