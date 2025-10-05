# Repository Guidelines

## Project Structure & Module Organization
HanapBahay has two app directories. `hanapbahay-backend/` hosts the ASP.NET Core API; controllers, services, repositories, DTOs, mappings, and EF migrations each live in their named folders. `hanapbahay-frontend/` carries the Vite React client with shared UI in `src/components/`, route screens in `src/pages/`, routing helpers in `src/routes/`, utilities in `src/utils/` and `src/lib/`, and static assets in `public/`. Root-level `compose.yaml`, Dockerfiles, and `docker/entrypoint.sh` describe the container stack. Keep secrets in the git-ignored `.env`.

## Build, Test, and Development Commands
- `docker compose up --build` – build and run the full stack (backend, frontend, SQL Server, Nginx).
- `cd hanapbahay-backend; dotnet restore && dotnet build` – install packages and validate the API build.
- `cd hanapbahay-backend; dotnet watch run` – hot-reload the API on port 5000.
- `cd hanapbahay-frontend; npm install && npm run dev` – start the Vite dev server on port 5173; `npm run build` emits production artifacts; `npm run lint` runs ESLint/Prettier.

## Coding Style & Naming Conventions
Backend code targets .NET 9 with nullable references. Use four-space indentation, file-scoped namespaces when helpful, PascalCase for types, camelCase for locals, and `_field` for injected dependencies; keep controllers thin and delegate to services plus AutoMapper profiles. Frontend files follow Prettier defaults (2 spaces, semicolons) and ESLint rules; components use PascalCase (`PropertyCard.tsx`), hooks use `useCamelCase`, utilities stay camelCase, and shared contracts belong in `src/types/`. Treat lint warnings as errors.

## Testing Guidelines
A backend test project is not yet committed; create xUnit suites named `*Tests.cs`, mirror feature namespaces, and run `dotnet test`. Mock Azure Blob access through the storage abstraction or use Testcontainers for integration coverage. Frontend tests belong beside components as `*.test.tsx` with Vitest and Testing Library; until configured, rely on `npm run lint` plus manual smoke tests in `npm run dev`. Document gaps in pull requests.

## Commit & Pull Request Guidelines
Recent history uses short, imperative subjects (e.g., `Add property filter route`) under 72 characters, with optional bodies for context or `Refs #123` issue links. Pull requests should summarize scope, list test evidence (`dotnet test`, `npm run lint`, manual steps), attach UI screenshots or GIFs, and flag new environment variables, migrations, or Swagger updates. Validate Docker or compose adjustments locally before requesting review.
