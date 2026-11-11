# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `253664a` · model `claude-sonnet-5`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
note pad 7 is a generated two-app repository: a Vue 3 + Vite frontend containing approved, already-reviewed note-taking screens that currently run entirely on seeded local sample data (persisted via localforage/Pinia), and a Spring Boot 4.1 (Java 21, Maven) backend that only exposes a health check plus a Note JPA entity/repository scaffold -- no note routes are wired up yet. The backend uses PostgreSQL 16 in production (via docker-compose) and falls back to an in-memory H2 database when no DATABASE_URL is set.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js (for the frontend, Vite 6 / vue-tsc toolchain)
- npm
- Java 21
- Maven (via the bundled mvnw wrapper, no separate install needed)
- Docker and Docker Compose (to run the PostgreSQL 16 service in docker-compose.yml)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. cd frontend && npm install
2. (optional) cp ../.env.example ../.env and fill in any values it defines
3. (optional, for a real Postgres instead of H2) from the repo root: docker-compose up -d db
4. cd backend; the mvnw wrapper downloads Maven and dependencies on first use, no separate install step is required
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| frontend dev | `npm run dev` | Starts the Vite dev server for the Vue 3 frontend |
| frontend build | `npm run build` | Bundles the frontend for production (does not typecheck) |
| frontend preview | `npm run preview` | Serves the production build locally |
| backend run | `sh mvnw spring-boot:run` | Runs the Spring Boot API (from backend/); listens on PORT (default 8000) |
| db | `docker-compose up -d db` | Starts a local PostgreSQL 16 instance on port 5432 for the backend |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.devcontainer` | VS Code devcontainer configuration |
| `.quorq` | Platform metadata (handoff.json, prepared.json) used by the Quorq AI SDLC platform |
| `frontend` | Vue 3 + Vite single-page app with the approved, generated note-taking screens |
| `frontend/src` | App source: entry point, App.vue shell/routes, screens, lib, stores |
| `frontend/src/screens` | One single-file component per approved screen (Notes, NoteDetail) |
| `frontend/src/lib` | Shared utilities: api.ts (backend client), ui.ts, icons.ts, brand.ts, navigate.ts |
| `frontend/src/stores` | Pinia store(s) for notes state, e.g. notes.ts |
| `frontend/e2e` | Playwright acceptance tests |
| `backend` | Spring Boot (Java 21, Maven) API service |
| `backend/src/main/java/app` | Application entry point, HealthController, Stubs.java, WebConfig, DatabaseUrlEnvironmentPostProcessor |
| `backend/src/main/java/app/model` | JPA entity (Note) and Spring Data repository (NoteRepository) |
| `backend/src/main/resources` | application.properties and spring.factories configuration |
| `backend/src/test` | Backend unit/integration tests |
| `backend/docker` | HealthCheck.java used by the Docker image's HEALTHCHECK |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Frontend screens are one single-file component per approved design, kept under src/screens
- Component tests live beside the component/store they cover (e.g. Notes.test.ts next to Notes.vue, notes.test.ts next to notes.ts)
- Playwright e2e specs live in frontend/e2e, separate from Vitest's src/**/*.test.ts scope
- Frontend API base URL and shared secret are read from VITE_API_BASE_URL / VITE_API_SECRET_KEY at build time, with localhost:8000 as the dev fallback (src/lib/api.ts)
- Backend uses Spring Data JPA with hibernate.ddl-auto=update and globally quoted identifiers; no migration tool configured
- Backend Java formatting/linting enforced via Spotless (google-java-format) and Checkstyle (backend/checkstyle.xml)
- Backend falls back to an in-memory H2 database when DATABASE_URL is not set
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| frontend unit tests | `npm test` | Runs Vitest component/unit tests (vitest run --passWithNoTests) |
| frontend lint | `npm run lint` | Runs ESLint over the frontend app |
| frontend typecheck | `npm run typecheck` | Runs vue-tsc --noEmit over the TypeScript code |
| frontend format check | `npm run format:check` | Checks formatting with Prettier |
| frontend e2e install | `npm run test:e2e:install` | Installs the Chromium browser Playwright needs |
| frontend e2e | `npm run test:e2e` | Runs Playwright acceptance tests in e2e/; builds/boots the backend and frontend locally unless E2E_BASE_URL is set |
| backend test | `sh mvnw test` | Runs backend unit and integration tests with JaCoCo coverage |
| backend checks | `sh mvnw checkstyle:check spotless:check` | Verifies Checkstyle and Spotless formatting rules |
| backend format | `sh mvnw spotless:apply` | Auto-formats backend Java code with Spotless |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| Backend won't start or fails to connect to a database | Without a DATABASE_URL set, the backend automatically falls back to an in-memory H2 database, so it can run with no database server; set DATABASE_URL or run docker-compose up -d db for real PostgreSQL 16 |
| npm run build succeeds but hides type errors | The build step does not typecheck; run npm run typecheck separately to catch TypeScript issues in frontend/src |
| npm run test:e2e fails immediately with no browser found | Run npm run test:e2e:install first to fetch the Chromium browser Playwright needs |
| Frontend screens don't reflect real backend data | The generated screens currently render seeded sample data only; src/lib/api.ts is the prepared seam for wiring a screen to the real backend, which hasn't been done yet |
| Backend Docker image health checks fail with curl/wget errors | The image intentionally has no curl, wget, or Python; it uses the included aisdlc-health script (backed by docker/HealthCheck.java) instead |
<!-- sdlc:auto:end troubleshooting -->
