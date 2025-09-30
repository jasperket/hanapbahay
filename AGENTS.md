# Repository Guidelines

## Project Structure & Module Organization
- `hanapbahay-backend/` hosts the ASP.NET Core 9 API: `Controllers/` expose endpoints, `Services/` hold domain logic, `Repositories/` wrap data access, and `Migrations/` tracks EF Core history. Startup seeds roles and amenities; connection strings live in `.env`.
- `hanapbahay-frontend/` is a Vite + React + TypeScript app: keep routed views in `src/pages/`, shared UI in `src/components/`, helpers in `src/lib/`, and global styles in `src/index.css`.
- `docker/entrypoint.sh` prepares the SQL Server container, while `compose.yaml` orchestrates database, API, and UI services for local development.

## Build, Test, and Development Commands
- Backend: `dotnet restore` + `dotnet build` validate dependencies; `dotnet ef database update` applies migrations; `dotnet watch run` serves the API on http://localhost:5057 (https://localhost:7081).
- Frontend: `npm install` once per workstation; `npm run dev` serves http://localhost:5173; `npm run build` checks production bundles; `npm run lint` enforces ESLint + TypeScript rules.
- Full stack: run `docker compose up --watch` from the repo root to boot SQL Server, the API, and the client with live reload.

## Coding Style & Naming Conventions
- C#: 4-space indentation, PascalCase for classes/public members, camelCase for locals, and suffix async methods with `Async`. Keep DTOs in `DTOs/` and AutoMapper profiles in `Mappings/`.
- Frontend: Prettier (with the Tailwind plugin) auto-sorts class lists; always format before committing. Use PascalCase component files (`AuthDialog.tsx`), camelCase hooks/util names, and kebab-case assets.

## Testing Guidelines
- Back end tests should target xUnit under a `hanapbahay-backend.Tests` project, grouped by feature folders (e.g., `Services/Auth`). Run `dotnet test` before merging and add FluentAssertions for readability.
- Front end tests belong beside code in `__tests__` directories using Vitest + Testing Library once added. Until the suite lands, rely on `npm run build` (type checks) and `npm run lint` for regression signals.

## Commit & Pull Request Guidelines
- Follow the existing short, verb-led subject lines (`Add theme colors`, `Remove "use client"`); keep subjects under 72 characters and skip trailing punctuation.
- Reference related issues in the body, call out migrations or env var changes, and attach UI screenshots/GIFs for visual updates.
- PR descriptions should list test evidence (`dotnet test`, `npm run lint`) and note any follow-up work or rollout steps.

## Security & Configuration Tips
- Never commit `.env`, `db_password.txt`, or Azure credentials; rotate secrets through Azure Key Vault or your secrets manager and load them via environment variables.
- When adding new secrets, mirror them in `compose.yaml` and document default values or setup steps in the relevant README.
