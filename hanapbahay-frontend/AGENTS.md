# Repository Guidelines

## Project Structure & Module Organization
Hanapbahay's frontend runs on React + TypeScript with Vite. Source lives under src/: shared UI in components/, route screens in pages/, router definitions in outes/, API facades in services/, app context in providers/, pure helpers in utils/ and lib/, and shared contracts in 	ypes/. Static assets belong in src/assets/, while user-facing files that must be served untouched stay in public/. Production bundles land in dist/; never commit the folder. Dockerfiles and compose.yaml at the root mirror deployment assumptions—keep them current when dependencies shift.

## Build, Test, and Development Commands
Run 
pm install after cloning. Use 
pm run dev for local development (Vite with hot refresh at http://localhost:5173). 
pm run build executes the TypeScript project build then emits an optimized bundle to dist/, and 
pm run preview serves that bundle for smoke tests. Enforce code quality with 
pm run lint before opening a pull request.

## Coding Style & Naming Conventions
ESLint ships with the recommended TypeScript and React presets plus React Hooks guardrails; treat warnings as blockers. Prettier (with the Tailwind plugin) owns formatting—keep the default 2-space indent, semicolons, and ordered Tailwind utilities. Name React components and files in PascalCase (PropertyCard.tsx), hooks in useCamelCase, and helpers in camelCase. Prefer typed props, React Query hooks for async calls, and Tailwind utility classes over ad-hoc CSS.

## Testing Guidelines
A dedicated runner is not yet configured, so add colocated *.test.tsx or *.spec.ts files with Vitest + Testing Library when introducing new coverage, and document any required setup in the pull request. Until that lands, rely on 
pm run lint plus manual sanity checks in 
pm run dev as the minimal quality gate. Call out untested edge cases in PR descriptions.

## Commit & Pull Request Guidelines
Recent history favors short, imperative messages (e.g., "Add GuestRoute component"). Keep the subject under 72 characters and add a short body when context or trade-offs matter. For pull requests, include a summary, linked issue, test evidence (
pm run lint, manual flows exercised), and screenshots or gifs for UI changes. Request review from another frontend contributor before merging.

## Environment & Configuration Tips
Use components.json, Tailwind, and the shared design tokens already wired into Vite—introduce new styling primitives sparingly. Run inside Docker via docker compose up --build web for parity when adjusting infrastructure. Store secrets in .env.local (already git-ignored) and avoid hardcoding API endpoints inside components.
