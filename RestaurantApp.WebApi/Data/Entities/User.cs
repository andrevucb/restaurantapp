using System.ComponentModel.DataAnnotations;

namespace RestaurantApp.WebApi.Data.Entities;

public class User
{
    public Guid Id { get; set; }

    [MaxLength(50)]
    public required string Username { get; set; }
    
    [MaxLength(256)]
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }

    [MaxLength(50)]
    public string Role { get; set; } = "User";
}
