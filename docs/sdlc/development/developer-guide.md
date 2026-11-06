# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `a117cfc` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Note Pad 7 is a generated two-app repository from the Quorq AI SDLC platform: a Vite + Vue 3 frontend containing the approved, reviewed screens (currently rendering seeded sample data, not live API calls) and a Spring Boot 4.1 (Java 21, Maven) backend that currently exposes only a health check, since no backend architecture had been approved yet. The frontend and backend are independent apps in one repo, wired together through a small API client seam (`frontend/src/lib/api.ts`) that is ready for screens to be connected to real endpoints one at a time.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for npm, Vite, Vue 3, Vitest, Playwright)
- Java 21 (backend uses the Maven wrapper, no local Maven install required)
- Docker and Docker Compose (to run the PostgreSQL 16 database via docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. Clone the repository
2. cd frontend && npm install
3. (optional) docker compose up -d db — starts a PostgreSQL 16 container on port 5432 for the backend
4. cd backend — no install step needed; sh mvnw will fetch dependencies on first run
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server for the Vue 3 app |
| frontend build | `cd frontend && npm run build` | Bundles the app for production (does not typecheck) |
| frontend preview | `cd frontend && npm run preview` | Serves the production build locally |
| backend run | `cd backend && sh mvnw spring-boot:run` | Starts the Spring Boot API; defaults to port 8000 and falls back to an in-memory H2 database if DATABASE_URL is not set |
| db up | `docker compose up -d db` | Starts the PostgreSQL 16 database defined in docker-compose.yml |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer` | Dev container configuration for a consistent development environment |
| `.quorq` | Platform metadata (handoff.json) used by the Quorq AI SDLC tooling |
| `backend` | Spring Boot (Java 21, Maven) API service; currently only has a health check and stubs |
| `backend/src` | Java source (main app code and tests) |
| `backend/docker` | HealthCheck.java used by the Docker image's HEALTHCHECK |
| `backend/.mvn` | Maven wrapper configuration |
| `frontend` | Vite + Vue 3 single-page app with the approved, reviewed screens, running on seeded sample data |
| `frontend/src` | App source: entry point, lib (api client, ui/icons helpers), styles |
| `frontend/e2e` | Playwright end-to-end acceptance tests |
| `docker-compose.yml` | Defines the local PostgreSQL 16 database service |
| `.env.example` | Example environment variables for local setup |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Frontend screens are plain single-file Vue components built against a shared component/icon vocabulary in src/lib/ui.ts and src/lib/icons.ts
- API access is centralized through apiFetch in src/lib/api.ts, which attaches a bearer token (session token if set, else the shared secret) and prefixes requests with API_BASE_URL
- Frontend screens currently render seeded sample data rather than calling the backend; api.ts is the designated seam for wiring real calls
- Backend follows standard Spring Boot layout under app package; HealthController is the only real handler, with Stubs.java as a placeholder
- Backend database schema updates automatically via Hibernate ddl-auto=update (no migrations yet); falls back to H2 in-memory DB with no DATABASE_URL
- Java code is formatted/checked with Spotless (Google Java Format) and Checkstyle (checkstyle.xml)
- Frontend code is linted with ESLint and formatted with Prettier (.prettierrc)
- Backend listens on HOST/PORT env vars (default 0.0.0.0:8000); the Docker image runs as a non-root user
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests (Vue Test Utils) colocated with components |
| frontend e2e tests | `cd frontend && npm run test:e2e` | Runs Playwright acceptance tests from e2e/; builds/serves the frontend and boots the backend locally unless E2E_BASE_URL is set |
| e2e browser install | `cd frontend && npm run test:e2e:install` | Installs the Chromium browser Playwright needs |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend app (the platform's development gate) |
| frontend typecheck | `cd frontend && npm run typecheck` | Runs vue-tsc --noEmit over the TypeScript around the generated screens |
| backend tests | `cd backend && sh mvnw test` | Runs the Spring Boot test suite (JUnit, including *IT integration tests) with JaCoCo coverage |
| backend style checks | `cd backend && sh mvnw checkstyle:check spotless:check` | Verifies Java code style and formatting |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Backend fails to start or create tables against PostgreSQL | Run `docker compose up -d db` first to start the PostgreSQL 16 container, or omit DATABASE_URL to let the app fall back to an in-memory H2 database |
| `npm run typecheck` fails even though `npm run build` succeeded | Expected: build only bundles and does not typecheck; run `npm run typecheck` (vue-tsc --noEmit) separately to catch TypeScript issues |
| Playwright e2e tests fail to start the backend | The e2e config builds and runs the backend jar itself (`mvn package` then `java -jar target/app.jar` on port 8000); ensure Java 21 is installed, or set E2E_BASE_URL to point at an already-running deployment instead |
| Frontend screens show sample data instead of real content | This is expected — screens run on seeded sample data by design; connect a screen to the backend via the apiFetch helper in src/lib/api.ts |
<!-- sdlc:auto:end troubleshooting -->
