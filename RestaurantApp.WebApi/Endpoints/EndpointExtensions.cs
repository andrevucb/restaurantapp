namespace RestaurantApp.WebApi.Endpoints;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapProductCategoryEndpoints();
        
        return app;
    }
}
