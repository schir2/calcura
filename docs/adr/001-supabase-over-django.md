# ADR 001: Replace Django backend with Supabase

**Status:** Accepted  
**Date:** 2026-06-15

## Context

Calcura's Django REST Framework backend broke and became a maintenance burden for a solo project. The Django layer added:
- Server management and deployment overhead (gunicorn, nginx, systemd)
- CSRF token choreography on every mutating HTTP request
- A custom `plugins/api.ts` plugin just to inject CSRF headers
- A `toSnakeCase`/`toCamelCase` conversion layer because Django's DRF returns snake_case but the frontend used camelCase
- Django upgrade and security patch obligations
- No built-in auth beyond session cookies; `django-allauth` needed for email/password and OAuth

The financial simulation engine (`models/`) is entirely client-side; it does not need a server at all. The only server role was persisting and serving user data (plans, incomes, expenses, etc.).

## Decision

Replace the Django backend entirely with Supabase. All persistence moves to Postgres tables managed by Supabase. The Nuxt frontend queries Supabase directly via PostgREST (through the `@supabase/supabase-js` client). Row-Level Security enforces data isolation. Supabase Auth handles sign-up, login, and Google OAuth. Postgres triggers replace Django signal handlers.

## Consequences

**Positive:**
- No server to manage or deploy — Supabase is hosted infrastructure
- CSRF tokens eliminated; Supabase uses JWT-based auth
- PostgREST returns snake_case column names, eliminating the conversion layer
- `supabase.auth.*` replaces the CSRF-laden `$fetch` calls in `useAuth`
- RLS policies enforce isolation at the DB level, not application layer
- Supabase dashboard provides a Studio UI for data inspection during development

**Negative / Trade-offs:**
- Vendor dependency on Supabase (mitigated: Postgres is open-source; can self-host)
- Business logic that used to live in Django views must move to Postgres triggers or the frontend
- Complex server-side operations (batch jobs, background tasks) are harder without a server

**Neutral:**
- The simulation engine in `models/` is untouched — it remains pure frontend TypeScript
- Domain composables must be rewritten to use the Supabase client instead of `useApi`

## Related ADRs
- [002](002-bigint-identity-primary-keys.md) — PK strategy chosen to work well with Postgres/PostgREST
- [004](004-postgres-triggers-over-edge-functions.md) — automation approach within Supabase
- [007](007-supabase-redirect-false.md) — auth redirect handling
