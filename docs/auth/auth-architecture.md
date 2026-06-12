# Authentication Architecture: Neon Auth

This document outlines the authentication architecture implemented in LitMatrix.

## Why Neon Auth instead of Keycloak?

Keycloak is an excellent enterprise-grade Identity Provider, but it introduces substantial architectural overhead for LitMatrix:
1. **Infrastructure Complexity**: Keycloak requires maintaining a separate Java-based container service, managing a separate database instance, and configuring complex realm settings.
2. **Local Development Overhead**: Developers must run Docker Compose with Keycloak locally, which is slow to start, resource-intensive, and prone to state sync errors.
3. **Database Branching Alignment**: A critical superpower of Neon Postgres is **instant database branching** (branching both schemas and contents). With Keycloak, authentication data is kept in a separate database, meaning when you branch your Neon application database, user registration data is not synchronized.
4. **All-in-One Service**: Neon Auth (managed Better Auth) stores authentication tables directly inside the Neon Postgres project (within the `neon_auth` schema). Therefore, auth data and application data branch **together**, providing seamless previews and local test environments.

## Next.js App Router Integration

LitMatrix utilizes a unified Neon Auth Next.js server instance (`lib/auth/server.ts`) and client-side SDK client (`lib/auth/client.ts`).

```mermaid
graph TD
  User(Browser Client) -->|Client actions/hooks| AuthClient(authClient)
  User -->|Interacted Views| AppPages(Next.js App Pages)
  AppPages -->|Server Session| AuthServer(auth)
  AuthClient -->|HTTP API calls| AuthRoute(app/api/auth/[...path])
  AuthRoute -->|Backend verify| AuthServer
  AuthServer -->|Neon Connection| Database[(Neon Postgres Database)]
  Middleware(middleware.ts) -->|RSC/API route check| AuthServer
```

### Route Interception & Protection
- **Edge Middleware**: `middleware.ts` intercepts requests at the Next.js routing layer. It blocks unauthenticated access to `/new`, `/projects/**`, and `/api/projects/**` (while ignoring static assets and Next.js internals).
- **Public Entrypoints**: The homepage `/` and the public demo project `ocpm-demo` (UI paths like `/projects/ocpm-demo/**` and API paths like `/api/projects/ocpm-demo/**`) bypass authentication entirely, preserving the public preview workflow.

## Data Storage Strategy

- **Authentication Data**: Stored in your Neon Postgres database inside the managed `neon_auth` schema (including tables like `neon_auth.users`, `neon_auth.sessions`, and `neon_auth.accounts`). This schema is fully managed by the Neon Console Auth service.
- **Application Data**: Stored in the standard `public` database schema (tables like `public.projects`, `public.papers`, etc.).
- **User Association**: We added a nullable `projects.user_id` column referencing the user ID in `neon_auth.users` to support project ownership. nullable status ensures legacy seeded data and public `ocpm-demo` remain fully functional without data loss or breaking constraints.

## Access Control Policies & Public Registration

LitMatrix is designed to support open public registration and logins:
- **Public Signups/Logins (Default)**: Any visitor can register an account, sign in, and create project workspaces. By default, `AUTH_ALLOWLIST_ENABLED=false` is configured in the environment.
- **Project Isolation**: Authenticated users can only see and access their own projects. Ownership is checked at the UI page layout level and in every nested project API route. Non-owner access requests are rejected (returning 403 Forbidden or redirecting to `/projects`).
- **Public Workspace Exception**: The `ocpm-demo` project is flagged as a public demo, allowing unauthenticated read-only access.
- **Optional Registration Restrictor (Allowlist)**: To gate creation for internal testing or private releases:
  - Set `AUTH_ALLOWLIST_ENABLED=true`.
  - Provide a comma-separated list of permitted emails in `AUTH_ALLOWED_EMAILS`.
  - **Note**: The allowed emails are application-level user accounts (e.g. `tester@example.com`), **NOT** your administrative Neon Console login credentials. This filter only triggers when `AUTH_ALLOWLIST_ENABLED` is explicitly `true`.
