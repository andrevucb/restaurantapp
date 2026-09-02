namespace RestaurantApp.WebApi.DTOs.Auth;

public record class RegisterResponse(
    string Username,
    string Email
);
