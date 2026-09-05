# RestaurantApp

Aplicacion para administrar categorias y productos de un restaurante.
El repositorio contiene:

- `RestaurantApp.WebApi`: API ASP.NET Core con .NET 10, SQLite, Entity Framework Core, autenticacion JWT y Scalar/OpenAPI.
- `RestaurantApp.WebApp`: cliente React servido por Vite.

## Requisitos previos

Instala las siguientes herramientas antes de iniciar el proyecto:

- .NET SDK 10.0 o superior compatible con `net10.0`.
- Node.js y npm. Se recomienda Node.js LTS.
- Git, si vas a clonar el repositorio.

Puedes comprobar las versiones instaladas con:

```bash
dotnet --version
node --version
npm --version
```

El backend no necesita una instancia externa de SQL Server: utiliza SQLite y guarda la base de datos en `RestaurantApp.WebApi/restaurantapp.db`.

## Backend

### Paquetes del backend

Los paquetes NuGet ya estan declarados en `RestaurantApp.WebApi/RestaurantApp.WebApi.csproj` y se restauran automaticamente con `dotnet restore`:

| Paquete | Version | Uso |
| --- | --- | --- |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | `10.0.11` | Validacion de tokens JWT |
| `Microsoft.AspNetCore.OpenApi` | `10.0.11` | Documento OpenAPI |
| `Microsoft.EntityFrameworkCore.Design` | `10.0.11` | Comandos y soporte de diseno de EF Core |
| `Microsoft.EntityFrameworkCore.Sqlite` | `10.0.11` | Proveedor de base de datos SQLite |
| `Scalar.AspNetCore` | `2.17.2` | Interfaz web para consultar la API |

Instala la herramienta de linea de comandos de Entity Framework Core una sola vez:

```bash
dotnet tool install --global dotnet-ef --version 10.0.11
```

Si ya esta instalada, actualizala con:

```bash
dotnet tool update --global dotnet-ef --version 10.0.11
```

Comprueba que esta disponible:

```bash
dotnet ef --version
```

### Restaurar y preparar la base de datos

Ejecuta los comandos desde la raiz del repositorio:

```bash
cd RestaurantApp.WebApi
dotnet restore
dotnet ef database update
mkdir -p wwwroot/uploads
```

`dotnet ef database update` aplica las migraciones incluidas en `Data/Migrations`. La ruta `Data Source=restaurantapp.db` es relativa al directorio actual, por lo que debes ejecutar el comando desde `RestaurantApp.WebApi` para crear o actualizar la base de datos en la ubicacion esperada.

Si necesitas crear una migracion despues de modificar las entidades:

```bash
dotnet ef migrations add NombreDeLaMigracion
dotnet ef database update
```

### Configuracion del backend

La configuracion de desarrollo esta en `RestaurantApp.WebApi/appsettings.Development.json`:

```json
{
	"ConnectionStrings": {
		"Default": "Data Source=restaurantapp.db"
	},
	"FileStorage": {
		"UploadPath": "wwwroot/uploads"
	},
	"Jwt": {
		"Issuer": "RestaurantApp",
		"Audience": "ApiClient",
		"Key": "super-secret-key-at-least-32-characters-long"
	}
}
```

Para desarrollo local, esta configuracion ya permite iniciar la aplicacion. En un entorno compartido o de produccion debes:

- Cambiar `Jwt:Key` por una clave privada, larga y aleatoria. No uses la clave de ejemplo ni la guardes en el repositorio.
- Configurar `ConnectionStrings:Default` con la ruta de SQLite que corresponda al entorno.
- Mantener existente la carpeta configurada en `FileStorage:UploadPath` o cambiarla por una ruta con permisos de escritura.
- Configurar CORS para incluir el origen real del frontend. Actualmente el backend solo permite `http://localhost:5173`.

### Ejecutar el backend

Desde `RestaurantApp.WebApi`:

```bash
dotnet run --launch-profile http
```

El perfil de lanzamiento configura `ASPNETCORE_ENVIRONMENT=Development` y expone la API en:

- API: <http://localhost:5148>
- OpenAPI: <http://localhost:5148/openapi/v1.json>
- Scalar: <http://localhost:5148/scalar/v1>

Para compilar sin iniciar el servidor:

```bash
dotnet build
```

## Frontend

### Paquetes del frontend

Los paquetes se encuentran en `RestaurantApp.WebApp/package.json`. `npm install` instala las versiones determinadas por `package-lock.json`.

Dependencias principales:

- `react` y `react-dom` `19.2.8`.
- `react-router` `8.3.1`.

Dependencias de desarrollo:

- `vite` `8.2.2` y `@vitejs/plugin-react` `6.1.0`.
- `eslint` `10.9.0` y las configuraciones/plugins de ESLint incluidos en `package.json`.

### Instalar y ejecutar el frontend

Desde la raiz del repositorio:

```bash
cd RestaurantApp.WebApp
npm install
npm run dev
```

Vite mostrara en la terminal la URL disponible, normalmente <http://localhost:5173>. El frontend esta configurado para comunicarse con la API en `http://localhost:5148/api` y para cargar las imagenes desde `http://localhost:5148`.

Para validar y generar una compilacion de produccion:

```bash
npm run lint
npm run build
npm run preview
```

`npm run preview` sirve el contenido de `dist` despues de ejecutar `npm run build`.

## Inicio completo

Abre dos terminales desde la raiz del repositorio.

Terminal 1:

```bash
cd RestaurantApp.WebApi
dotnet restore
dotnet ef database update
dotnet run --launch-profile http
```

Terminal 2:

```bash
cd RestaurantApp.WebApp
npm install
npm run dev
```

Abre <http://localhost:5173> en el navegador. El backend debe estar ejecutandose antes de iniciar sesión, consultar productos o cargar imagenes.

## Cambiar las URLs locales

Actualmente las URLs del backend estan escritas en el frontend y el origen del frontend esta escrito en `RestaurantApp.WebApi/Program.cs`. Si cambias alguno de los puertos:

1. Actualiza el puerto del perfil `http` en `RestaurantApp.WebApi/Properties/launchSettings.json`.
2. Actualiza `WithOrigins(...)` en `RestaurantApp.WebApi/Program.cs` para que coincida con la URL del frontend.
3. Actualiza las referencias a `http://localhost:5148` en `RestaurantApp.WebApp/src`.

El proyecto no utiliza actualmente archivos `.env` para estas URLs.

## Solucion de problemas

- **No se puede conectar con la API:** confirma que el backend esta en `http://localhost:5148` y que el frontend se esta ejecutando en `http://localhost:5173`.
- **Error de CORS:** verifica que el origen del frontend coincide exactamente con el valor permitido en `Program.cs`.
- **Error de SQLite o tablas inexistentes:** ejecuta `dotnet ef database update` desde `RestaurantApp.WebApi`.
- **Error con `dotnet ef`:** instala o actualiza la herramienta global `dotnet-ef` con la version 10.0.11.
- **Las imagenes no cargan:** confirma que existe `RestaurantApp.WebApi/wwwroot/uploads` y que el backend esta ejecutandose; los archivos estaticos se sirven desde esa aplicacion.
