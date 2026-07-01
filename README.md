# Calcura

A financial planning app that simulates year-by-year financial outcomes — income, expenses, debts, investment accounts, and retirement projections. Built with Nuxt 3 and Supabase.

## What it does

- Model a financial plan with income sources, expenses, debts, brokerages, IRAs, Roth IRAs, 401(k)s, HSAs, and cash reserves
- Run a year-by-year simulation until a retirement criterion is met (age, debt-free, percent rule, or target savings)
- Create multiple command sequences to compare different operation orderings (e.g., pay debt first vs. invest first)
- Browse and apply template plans and financial items

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Nuxt 3 + Vue 3 |
| UI | NaiveUI + Tailwind CSS |
| State | Pinia |
| Forms | NaiveUI FormRules |
| Charts | Chart.js via vue-chartjs |
| Backend | Supabase (Postgres + PostgREST + Auth) |
| Testing | Vitest + @vue/test-utils |

## Getting started

### Prerequisites

- Node.js 18+
- [Docker](https://www.docker.com/) (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_KEY from your Supabase project
```

For local development, use the values printed by `supabase start` (see below).

### 3. Start local Supabase

```bash
supabase start
# Prints local URL, anon key, and Studio URL
```

Update `.env` with the local credentials. Apply migrations:

```bash
supabase db reset
```

### 4. Generate TypeScript types

```bash
supabase gen types typescript --local > types/database.types.ts
```

### 5. Start the dev server

```bash
npm run dev
# → http://localhost:3000
# Supabase Studio → http://localhost:54323
```

## Commands

```bash
npm run dev          # Start Nuxt dev server
npm run build        # Build for production
npm test             # Run Vitest unit tests
npm run coverage     # Generate test coverage
npm run generate     # Static site generation
npm run preview      # Preview production build
npm run postinstall  # Regenerate Nuxt auto-imports
```

Supabase:
```bash
supabase start                    # Start local Docker instance
supabase db reset                 # Replay all migrations
supabase migration new <name>     # Create a new migration
supabase gen types typescript --local > types/database.types.ts
```

## Architecture

See `CLAUDE.md` for full architecture documentation. Key points:

- **Simulation engine** (`models/`) — pure TypeScript, no API dependencies. Takes configuration data, simulates year-by-year financial outcomes. Never touch this when doing API work.
- **Supabase** — all persistence via PostgREST. Fields are snake_case throughout (no conversion layer). Row-Level Security enforces data isolation.
- **Auth** — Supabase Auth (email/password + Google OAuth). Session held in `authStore`. No CSRF tokens.
- **Automation** — six Postgres triggers replace Django signal handlers (command creation, sequence population).

## Architecture decisions

Key decisions are documented in `docs/adr/`:

| ADR | Decision |
|-----|----------|
| [001](docs/adr/001-supabase-over-django.md) | Replaced Django with Supabase |
| [002](docs/adr/002-bigint-identity-primary-keys.md) | BIGINT sequential PKs (not UUID) |
| [003](docs/adr/003-numeric-for-financial-values.md) | NUMERIC for all financial columns |
| [004](docs/adr/004-postgres-triggers-over-edge-functions.md) | Postgres triggers for automation |
| [005](docs/adr/005-snake-case-field-names.md) | snake_case throughout TypeScript |
| [006](docs/adr/006-income-id-on-junction-tables.md) | IRA income FK on junction table |
| [007](docs/adr/007-supabase-redirect-false.md) | Custom auth middleware, not module redirect |

## Project structure

```
calcura/
├── components/         # Vue components grouped by domain
├── composables/        # Reusable composables (useAuth, domain services)
│   └── api/            # Domain service composables (Supabase queries)
├── docs/
│   └── adr/            # Architecture Decision Records
├── layouts/            # Nuxt layouts (default, auth, landing)
├── middleware/         # Nuxt route middleware (auth guard)
├── models/             # Pure-frontend simulation engine
├── pages/              # Nuxt file-based routes
├── stores/             # Pinia stores (auth, theme)
├── supabase/
│   └── migrations/     # SQL migrations (applied in order)
├── tests/              # Vitest unit tests
└── types/              # TypeScript interfaces (snake_case, matches DB schema)
```

## Google OAuth setup

Google OAuth requires one manual step in the Supabase dashboard:
1. Go to **Authentication → Providers → Google**
2. Enable and add your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
3. Add the Supabase callback URL to your Google app's authorized redirect URIs

See `docs/AUTH.md` for the full auth setup guide.
