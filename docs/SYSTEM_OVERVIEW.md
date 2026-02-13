# System Overview — U.D.A.A.N Platform

This document explains the U.D.A.A.N application so a new developer or a non-technical stakeholder can understand what it does, how it is organized, and how information flows through it. It is based only on code and configuration in the repository. Where the code doesn't explain purpose clearly, that is noted.

---

## 1. Big Picture (Non-Technical)

- What this application does
  - U.D.A.A.N is a web platform that provides user and citizen profile management services. It exposes a web frontend (what people interact with in a browser) and a backend API (server) that stores and retrieves data.

- Who it is for
  - Citizens or users who need to create accounts and manage their profiles, and administrators or downstream systems that consume the platform's API.

- What problem it solves
  - It centralizes user identity and citizen profile data, providing a consistent API and web interface to create, read, update, and manage profiles.

---

## 2. High Level Architecture

- Frontend
  - Single-page application (SPA) built with React and Vite. The frontend runs in the user's browser, provides the UI components (forms, tables, navigation), and talks to the backend API over HTTP.

- Backend
  - Node.js Express application that implements the REST API, request validation, authentication middleware, logging, health checks, and API routes for `users` and `profiles`.

- Database
  - The codebase targets PostgreSQL in production (entities defined under the backend models). During tests the code uses an in-memory SQLite configuration (see test setup). The database stores users, citizen profiles, documents, and audit logs.

- AI components
  - The code contains an AI configuration area with a huggingface model name (in `backend/src/config/index.ts`). That indicates where the system can call external AI services for tasks such as embeddings or text processing. The exact AI call sites are not obvious in the codebase — Purpose not clear from code.

- External services or APIs
  - Keycloak (optional integration) — configuration variables exist for Keycloak in `backend/src/config/index.ts`.
  - Redis — present in configuration (used for caching or session storage in some environments, if enabled).
  - Prometheus — metrics endpoint may be exposed when enabled via environment variables.
  - Swagger/OpenAPI — API documentation is generated and served from the backend.

- How they connect
  - Browser (frontend) → HTTP(S) → Backend API. Backend → Relational DB (Postgres). Backend optionally communicates with external services (Keycloak, Redis, AI provider) as configured.

---

## 3. Technology Stack & Why It Exists

- React + Vite (frontend)
  - Where: frontend/ folder.
  - Why: fast developer experience, modern SPA architecture, HMR for development.
  - Benefit: quick iteration, small production bundles.

- Axios (api client)
  - Where: `frontend/src/services/api.ts`.
  - Why: promise-based HTTP client with easy interceptors for auth and error handling.

- Express (backend)
  - Where: `backend/src/app.ts` and `backend/src/index.ts`.
  - Why: lightweight and commonly used HTTP server framework for Node.js.
  - Benefit: simple routing and middleware model.

- TypeORM (backend DB mapping)
  - Where: `backend/src/config/database.ts` and `backend/src/models`.
  - Why: Object-relational mapper to convert between JavaScript objects and database rows.

- PostgreSQL (production DB)
  - Where: referenced in backend config; migrations exist in `backend/migrations`.
  - Why: reliable relational database for structured data.

- SQLite (test-time DB)
  - Where: tests configure an in-memory SQLite DataSource during Jest runs.
  - Why: fast, no external dependency for unit/integration tests.

- Winston (logging)
  - Where: `backend/src/config/logger.ts`.
  - Why: structured logging with transports and formatting.

- Jest + ts-jest (testing)
  - Where: `backend/tests` and `backend/jest.config.js`.
  - Why: unit and integration tests for backend services.

- Swagger (OpenAPI)
  - Where: `backend/src/app.ts` config to generate API docs.
  - Why: self-documenting API endpoints for developers and integrators.

---

## 4. Project Structure (Folder & File Map)

Top-level folders and a short role for each:

- `backend/` — server-side code and tests
  - `backend/src/app.ts` — Express app configuration (routes, middleware, security). If removed, the server would not be assembled and routes would be unavailable. Called by `backend/src/index.ts` on start.
  - `backend/src/index.ts` — server entry point that starts the HTTP listener. If removed, no server process would exist to run the API.
  - `backend/src/config/` — application configuration (database, logger, redis, etc.). These files supply values used across the backend.
  - `backend/src/controllers/` — HTTP controllers that handle requests for users, profiles, and health endpoints. Controllers are invoked by the routes.
  - `backend/src/routes/` — route definitions; connect HTTP paths to controllers. If removed, endpoints won't be reachable.
  - `backend/src/models/` — TypeORM entity definitions (User, CitizenProfile, Document, AuditLog). They map to database tables; removing them breaks data storage and migrations.
  - `backend/src/repositories/` — data access helpers that encapsulate queries for models. Controllers and services call repositories.
  - `backend/src/services/` — domain/business logic. Services are called from controllers and use repositories.
  - `backend/src/middlewares/` — auth, error handling, logging, and request ID middleware used by Express pipeline.
  - `backend/migrations/` — DB migrations to create schema. Removing migrations does not immediately break runtime, but prevents reproducible schema creation.
  - `backend/tests/` — Jest tests for backend logic. Good safety net for changes.

- `frontend/` — client-side React app
  - `frontend/src/main.tsx` — application bootstrap (mounts React to the DOM). If removed, nothing renders.
  - `frontend/src/App.tsx` — main router and page composition.
  - `frontend/src/pages/` — page-level components such as `SignUpPage` and `Login`.
  - `frontend/src/components/` — small UI components (Button, Card, FormInput). Reused across pages.
  - `frontend/src/services/` — API wrappers (for auth, users, etc.). `frontend/src/services/api.ts` contains the Axios instance and interceptors — central place to change base URL and auth handling. If removed, all HTTP calls would break.
  - `frontend/src/hooks/` — custom hooks (e.g., `useUsers`, `useLoading`) that encapsulate logic used by components.

- `docs/` — documentation (you will find this new file here).
- top-level markdown: README.md, QUICK_START.md, LOCAL_SETUP_GUIDE.md — operational instructions for developers.

Files that are especially important and who calls them:

- [backend/src/app.ts](backend/src/app.ts)
  - Responsibility: Build Express app (middleware, rate limiting, CORS, route registration, swagger setup). Called from `backend/src/index.ts` during startup.

- [backend/src/config/index.ts](backend/src/config/index.ts)
  - Responsibility: Central configuration values sourced from environment variables. Many modules import this to behave differently between dev/test/prod.

- [frontend/src/services/api.ts](frontend/src/services/api.ts)
  - Responsibility: The single Axios instance used by frontend services. Intercepts requests to add `Authorization` header and handles 401 responses. All frontend service modules import and use this.

---

## 5. Application Flow (Step by Step)

This is a typical user story: new user signs up.

1. User opens the website in a browser.
   - The browser requests the frontend assets (served by Vite in development or built assets in production) which boot the React app.

2. Page loads and the React app mounts.
   - `frontend/src/main.tsx` initializes the router and renders `App.tsx`.

3. User navigates to the Sign Up page and fills the form.
   - `SignUpPage` uses `useUsers` which delegates to `frontend/src/services/userService.ts`.

4. The frontend calls the backend API.
   - `userService.createUser()` calls `apiClient.post('/users', userData)`. The `apiClient` is configured with a base URL and authorization headers in `frontend/src/services/api.ts`.

5. The request reaches the backend Express server at `POST /api/users`.
   - The route defined in `backend/src/routes/userRoutes.ts` forwards to a controller which validates the input and calls `UserService`.

6. Backend service uses repositories and TypeORM entities to persist the new user into the database.
   - `UserService` calls the appropriate repository to create a record in the database (Postgres in production).

7. Database writes the data and returns the created user to the backend service.

8. Backend controller returns an HTTP response with a standard API wrapper (status/data or error payload) which flows back to the frontend.

9. Frontend receives the response; `createUser` resolves and `SignUpPage` shows a success toast and navigates to login.

If errors occur (validation, network, CORS, auth), the frontend's `useLoading` will catch and show an error toast (e.g., 'Network error').

---

## 6. Data Flow

- Where data starts
  - From user inputs on the frontend forms or from external systems calling the API.

- How it is transformed
  - Frontend sends data as JSON via Axios. Backend controllers may validate and transform these into domain objects used by services and repositories.
  - TypeORM maps these domain objects to database rows and columns defined in entity files under `backend/src/models/`.

- Where it is stored
  - Persisted in a relational database (Postgres by default). During tests the project uses an in-memory SQLite DB.

- Where it is returned
  - The backend returns JSON responses to the frontend. The frontend services unwrap the API envelope and pass domain objects back to UI components.

---

## 7. AI / Intelligence Logic (if present)

- Where AI is used
  - There is an AI configuration present in `backend/src/config/index.ts` with keys like `provider` and `model`. This indicates planned or partial integration with an AI provider such as Hugging Face.

- What triggers it
  - Purpose not clear from code — there are no obvious service files that perform AI inference directly. The configuration shows support, but the call sites are not clear.

- Inputs & outputs
  - Purpose not clear from code.

---

## 8. Configuration & Environment

Key configuration points are pulled from environment variables. Important variables are documented across the codebase in `backend/src/config/index.ts`.

- API & server
  - `PORT`, `HOST` — server port and host.
  - `API_BASE_URL` — used when constructing servers or docs.

- Database
  - `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`.

- Authentication & secrets
  - `JWT_SECRET` — used to sign JSON Web Tokens.
  - `KEYCLOAK_*` variables — Keycloak connection and credentials (if Keycloak is used).

- External integrations
  - `HUGGINGFACE_API_KEY` — if AI provider is Hugging Face, this key would be required.

- Frontend base URL
  - `VITE_API_BASE_URL` — used in `frontend/src/services/api.ts` to set the base URL for API calls. In development it defaults to `http://localhost:3000/api`.

Build settings
  - Frontend development uses Vite; production builds generate static assets. Backend may run with `NODE_ENV=production` for production behavior.

---

## 9. Rules Developers Must Not Break

- Keep the API envelope consistent
  - Frontend expects certain response shapes (`{ data: ..., meta?: ... }`). Changing envelope structure without updating clients will break consumers.

- Respect middleware contracts
  - Middlewares (auth, error handler) are wired to Express with the assumption that non-success paths send a response and then return. Changing this flow can create duplicate responses or unhandled rejections.

- Migration and entity contracts
  - Database migrations in `backend/migrations/` correspond to entity definitions. Changing entities without updating or adding migrations can lead to schema mismatch in production.

- Configuration-driven behavior
  - Many runtime behaviors (CORS origin, JWT settings, Prometheus) are controlled by environment variables in `backend/src/config/index.ts`. Do not hard-code these values in code.

---

## 10. How to Safely Modify or Extend

Suggested approach for adding a new feature (e.g., new entity + UI page):

1. Backend API design
   - Add or update a TypeORM entity under `backend/src/models/` and create a migration in `backend/migrations/`.
   - Add repository methods in `backend/src/repositories/` and corresponding service logic in `backend/src/services/`.
   - Add controller logic in `backend/src/controllers/` and expose a route under `backend/src/routes/`.
   - Add tests in `backend/tests/` to validate behavior. Run Jest locally.

2. Frontend UI
   - Create a new page under `frontend/src/pages/` and small UI components under `frontend/src/components/` if needed.
   - Add service methods in `frontend/src/services/` that call the new backend endpoints via `apiClient`.
   - Use existing hooks patterns (`frontend/src/hooks/`) or add a new hook to encapsulate data logic.
   - Add navigation and route to `frontend/src/App.tsx`.

3. Local verification
   - Start backend (`backend`) and frontend (`frontend`) in parallel and verify the flow end-to-end. Use the API health endpoint at `/api/health` to confirm backend availability.

---

## 11. Glossary

- API: Application Programming Interface — the server endpoints the frontend calls.
- SPA: Single Page Application — a web app that runs on a single web page and updates dynamically.
- CORS: Cross-Origin Resource Sharing — browser security rules that control which origins can call the API. If frontend runs on a different port, server CORS must allow that origin.
- JWT: JSON Web Token — a compact token format used for authentication (signed with `JWT_SECRET`).
- ORM: Object-Relational Mapper — software (TypeORM) that maps code objects to database rows.
- Migration: a script that changes the database schema in a controlled way.

---

If any specific area above is unclear from the code (for example, exact AI usage or a custom Keycloak flow), the code states "Purpose not clear from code" and a developer who knows the original intent should clarify.

Files to open first when onboarding:

- [frontend/src/main.tsx](frontend/src/main.tsx) — see how the app boots.
- [frontend/src/services/api.ts](frontend/src/services/api.ts) — central HTTP client and interceptors.
- [backend/src/app.ts](backend/src/app.ts) — where middleware and routes are assembled.
- [backend/src/config/index.ts](backend/src/config/index.ts) — environment-driven configuration.

---

Document created from repository contents only. If you want, I can add a small diagram (ASCII) that visualizes the runtime: browser ↔ frontend ↔ backend ↔ database / external services.
