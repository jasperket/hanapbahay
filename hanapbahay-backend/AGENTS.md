# Repository Guidelines

## Project Structure & Module Organization
The backend uses a layered architecture under `hanapbahay-backend.csproj`. Controllers expose HTTP endpoints and immediately hand off to `Services/`. Data access stays in `Repositories/` (`Generic` for cross-cutting logic, `Property` for domain queries). EF Core models and context live in `Models/` and `Data/AppDbContext.cs`. Transport types and AutoMapper rules sit in `DTOs/` and `Mappings/`, while schema history resides in `Migrations/`. Keep shared configuration in `Properties/` and environment overrides in `appsettings*.json`.

## Build, Test, and Development Commands
`dotnet restore` pulls NuGet packages and `dotnet build` validates the compilation pipeline. Use `dotnet watch run` for iterative local work; `dotnet run --launch-profile Development` mirrors production startup. Apply migrations with `dotnet ef database update` once `DefaultConnection` points to SQL Server. Container flows rely on `docker compose up --build` as outlined in `README.Docker.md`.

## Coding Style & Naming Conventions
Target .NET 9 with nullable reference types enabled. Stick to four-space indentation, file-scoped namespaces when practical, and expression-bodied members only when they clarify intent. Use PascalCase for types and public members, camelCase for locals and parameters, and prefix injected fields as `_field`. Async APIs should end with `Async`. Keep controllers thin, relying on AutoMapper profiles and attribute-based validation (or FluentValidation when introduced).

## Testing Guidelines
Create a `HanapBahay.Backend.Tests` project with xUnit (`dotnet new xunit`). Mirror the feature namespace, suffix files with `Tests.cs`, and focus on service and repository seams. Prefer `[Trait("Category","Service")]` or similar tags to group coverage. Run the suite with `dotnet test`, substituting Azure dependencies through the `IBlobStorageService` abstraction. Integration tests should spin up in-memory SQL or Testcontainers to cover persistence.

## Configuration & Secrets
Read configuration from `appsettings.json`, `appsettings.Development.json`, or the `Azure:*` environment variables (`AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`). Use `dotnet user-secrets` for local credentials and refresh sample JSON whenever keys change. Document defaults so other agents can sync quickly.

## Commit & Pull Request Guidelines
Commits use imperative subjects ("Add property filtering") under 72 characters, with bodies describing migrations or configuration changes. Reference trackers using `Refs #123` when relevant. Pull requests should summarize behaviour changes, call out database or API impacts, include updated Swagger screenshots for endpoint work, and list manual validation. Highlight new migrations and configuration tweaks so reviewers can apply them.

