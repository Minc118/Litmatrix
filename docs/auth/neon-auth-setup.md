# Neon Auth Setup Guide

Follow this guide to enable, configure, and migrate Neon Auth in your local and staging/production environments.

## Manual Neon Console Setup

Since Neon Auth is a managed service, you must enable it in the Neon Console before the application can communicate with it:

1. Log in to the [Neon Console](https://console.neon.tech).
2. Select your project and navigate to the **Auth** tab in the sidebar.
3. Click **Enable Auth**.
4. Once enabled, navigate to the **Auth Configuration** section:
   - Select **Email & Password** as the authentication provider.
   - Configure your callback URLs to include your local development server (e.g. `http://localhost:3000`).
5. Copy your **Auth URL** (e.g. `https://your-project-auth.neon.tech`).

## Environment Variables

Configure the following variables in your `.env.local` file (do NOT commit this file):

```bash
# Pooled/pooled database connection string
DATABASE_URL=postgresql://...

# Neon Auth parameters
NEON_AUTH_BASE_URL=https://your-project-auth.neon.tech
NEON_AUTH_COOKIE_SECRET=your_32_character_long_random_cookie_secret

# Public registration & login are allowed by default. Set to true only for internal testing/private beta.
AUTH_ALLOWLIST_ENABLED=false
# Optional application-level restrictor (used ONLY when AUTH_ALLOWLIST_ENABLED=true).
# This is NOT your Neon Console account email.
AUTH_ALLOWED_EMAILS=
```

> [!TIP]
> Generate a secure 32+ character cookie secret with:
> `openssl rand -base64 32`

## Local Development Steps

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Generate migration schema files:
   ```bash
   npm run db:generate
   ```
3. Run the migrations against your local database or temporary branch:
   ```bash
   npm run db:migrate
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` to register a new account and test the protected `/projects` area.

## Migration Procedure & Safety Policy

### Neon MCP Safety Policy
- **No Direct main DB Alterations**: Never run migration scripts directly against the main/production database.
- **Verification on Temporary Branches**: Apply migrations only to a temporary database branch to verify correctness.

### How to Apply Schema Migrations
1. In development, run `npm run db:generate` to generate the migration SQL.
2. Create a temporary branch in the Neon Console (or via Neon MCP) to test the migration.
3. Run the migrations against the temporary branch using your database credentials.
4. Verify the database compiles, works, and does not regress existing data.
5. Only apply the migration to the production/main database during approved deployment windows.

## Public Registration & Optional Allowlist Gate

- **Public Signups & Logins (Default)**: By default, public registration and login are fully allowed (`AUTH_ALLOWLIST_ENABLED=false`). Any user can sign up, sign in, and access their own authenticated workspace.
- **Application Allowlist Gate (Optional)**: If you need to restrict workspace creation for private beta or internal testing, set `AUTH_ALLOWLIST_ENABLED=true` and provide a comma-separated list of permitted emails in `AUTH_ALLOWED_EMAILS`.
  - **Important**: The emails in `AUTH_ALLOWED_EMAILS` are application-level user accounts (e.g. `researcher@example.com`), **NOT** your administrative Neon Console account email. This restriction only applies when `AUTH_ALLOWLIST_ENABLED` is explicitly configured as `true`.
