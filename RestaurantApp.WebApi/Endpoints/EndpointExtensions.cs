namespace RestaurantApp.WebApi.Endpoints;

public static class EndpointExtensions
{
    public static IEndpointRouteBuilder MapApiEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAuthEndpoints();
        app.MapProductCategoryEndpoints();
        app.MapProductSizeEndpoints();
        
        return app;
    }
}
