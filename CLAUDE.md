# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Information Reporting
When reporting information to me, be extremly concise and sacrafice grammer for the sake of concision.

## Commands

```bash
npm run dev          # Start Nuxt development server
npm run build        # Build for production
npm test             # Run Vitest unit tests
npm run coverage     # Generate test coverage report
npm run generate     # Static site generation
npm run preview      # Preview production build
npm run postinstall  # Regenerate Nuxt auto-imports and type declarations
```

Run a single test file:
```bash
npx vitest run tests/models/plan/PlanManager.test.ts
```

Supabase:
```bash
supabase start                    # Start local Supabase (Docker)
supabase stop                     # Stop local Supabase
supabase db reset                 # Replay all migrations on local DB
supabase migration new <name>     # Create a timestamped migration file
supabase gen types typescript --local > shared/types/database.types.ts  # Regenerate TS types
```

## Tech Stack

- **Framework:** Nuxt 4 + Vue 3
- **UI:** NaiveUI + Tailwind CSS
- **State:** Pinia stores + mitt event bus
- **Forms:** NaiveUI `<n-form>` with `FormRules` (see `app/utils/validators/`)
- **Charts:** Chart.js via vue-chartjs
- **Testing:** Vitest + @vue/test-utils + happy-dom
- **Backend:** Supabase (Postgres + PostgREST + Auth)

The Django REST backend has been fully replaced by Supabase. There is no server to run.

## Architecture

### Manager / Orchestrator Pattern

Business logic lives in `models/`, not in components or stores.

- **`BaseManager`** (`models/common/BaseManager.ts`) — Abstract base for a single financial entity. Each manager tracks configuration, a current state, and state history across time periods. Subclasses implement `process()` and `advanceTimePeriod()`.
- **`BaseOrchestrator`** (`models/common/BaseOrchestrator.ts`) — Coordinates multiple managers, drives the year-by-year simulation loop, and handles inter-manager fund flows.
- **`PlanManager`** (`models/plan/PlanManager.ts`) — The central orchestrator. It instantiates all financial managers (income, expense, debt, brokerage, tax-deferred, IRA, Roth IRA, cash reserve), runs the simulation forward until retirement criteria are met, and tracks tax/contribution limits per year.

**The simulation engine is pure frontend logic and must not be coupled to any API or store.**

### API Layer (Supabase)

The app queries Supabase directly from the frontend via `@supabase/supabase-js`. There is no intermediate server.

- `useSupabaseClient()` — provided by `@nuxtjs/supabase`, available in any composable or component
- `useSupabaseUser()` — reactive current user from Supabase Auth
- Domain Pinia stores in `stores/` (via `modelStoreFactory`) are the canonical way to read and mutate domain data — call `store.fetchAll()` on mount, bind `store.list` in templates, call `store.create/patch/purge` for mutations

**Field names are snake_case throughout** — PostgREST returns column names as defined in the schema. Do not add camelCase conversions. See [ADR 005](docs/adr/005-snake-case-field-names.md).

### Auth

Auth uses Supabase Auth (email/password + Google OAuth). See [ADR 001](docs/adr/001-supabase-over-django.md).

- `composables/useAuth.ts` — wraps `supabase.auth.*` methods
- `stores/authStore.ts` — holds `Session` and `User` from `@supabase/supabase-js`
- `middleware/auth.ts` — protects private routes using `useSupabaseUser()`
- `supabase.redirect: false` in `nuxt.config.ts` — the module's built-in redirect is disabled; `middleware/auth.ts` is the only auth gate (see [ADR 007](docs/adr/007-supabase-redirect-false.md))
- Profiles auto-created via Postgres trigger on `auth.users` INSERT

**No CSRF tokens.** The old `plugins/api.ts` CSRF plugin has been deleted.

### Database

Migrations live in `supabase/migrations/`. See `supabase/CLAUDE.md` for migration conventions.

- All PKs: `BIGINT GENERATED ALWAYS AS IDENTITY` (see [ADR 002](docs/adr/002-bigint-identity-primary-keys.md))
- All financial columns: `NUMERIC` (see [ADR 003](docs/adr/003-numeric-for-financial-values.md))
- All automation: Postgres triggers (see [ADR 004](docs/adr/004-postgres-triggers-over-edge-functions.md))
- All data isolation: Row-Level Security policies

### Routing & Layouts

Nuxt file-based routing under `pages/`. Main layouts:
- `layouts/default.vue` — authenticated app shell (navbar + sidebar)
- `layouts/auth.vue` — login/register pages
- `layouts/landing.vue` — public landing page

`middleware/auth.ts` guards all protected routes.

### Retirement Strategies

Plans support four retirement triggers (defined in `types/Plan.ts`): age-based, debt-free, percent rule (projected income ≥ goal), and target savings. `PlanManager` checks the active strategy each simulated year.

### Component Organization

Components under `components/` are grouped by domain (`brokerage/`, `debt/`, `income/`, `expense/`, `ira/`, `rothIra/`, `taxDeferred/`, `plan/`) plus `base/` for primitive inputs, `chart/` for visualizations, `common/` for shared UI, and `layout/` for structural chrome.

### Key Type Files

- `shared/types/database.types.ts` — **auto-generated** by `supabase gen types typescript --local`. Do not edit by hand.
- `types/Plan.ts` — core plan interface and strategy/limit enums
- `types/[Domain].ts` — config and state types per financial entity; all snake_case
- `types/Auth.ts` — auth-related types (Supabase session, credentials)

## Styling & Design System

**All color/radius/elevation styling follows [`docs/design-system.md`](docs/design-system.md). Read it before styling anything.**

The short version:
- **`app/theme/palette.ts` is the single source of truth** for color. It generates the CSS vars (consumed by Tailwind `skin` tokens) and the NaiveUI theme (literal values — NaiveUI can't read `var()`). See [ADR 008](docs/adr/008-design-tokens-tailwind-source-of-truth.md).
- Use `skin` tokens (`bg-skin-*`, `text-skin-*`, `border-skin-*`) for color — **never raw Tailwind colors** (`text-red-500`, `text-white`) in app/dashboard components.
- **Always use a NaiveUI component when one exists.** Tailwind is for layout/spacing only.
- To recolor the app, edit `palette.ts` — never patch colors per-component or in `tailwind.css`.

## Architecture Decisions

Key decisions are documented in `docs/adr/`. Read these before making changes that touch:
- Primary keys → ADR 002
- Financial column types → ADR 003
- Automation (triggers) → ADR 004
- Field naming → ADR 005
- IRA income association → ADR 006
- Auth redirect → ADR 007
- Design tokens / styling → ADR 008

## Change Communication Protocol

Before making any file changes, follow this step-through workflow by default:

1. **Announce scope** — state what files will change and why before touching anything
2. **Await approval** — wait for the user to confirm before executing
3. **Execute the phase** — make the changes
4. **Preview the next phase** — describe what comes next and why
5. **Await approval** — repeat until done

**Override:** If the user says **"just do it"**, skip all pauses, execute every phase, then report at the end.

### Rationale detail level
- **Minor change** (single file, mechanical fix): one sentence — what changed and why
- **Significant change** (design decision, multi-file impact, public API/type change): explain what, why, and any trade-offs before proceeding
- Any decision made without explicit user input must be surfaced and approved before acting

## Conventions

### Code style
- **Use as few comments as possible — only when absolutely necessary.** Prefer self-documenting code (clear names, small functions) over explanatory comments. Do not add comments that restate what the code already says. Reserve comments for genuinely non-obvious rationale ("why", not "what").

### Do
- Keep business logic in `models/`, not in components or stores
- Use `useSupabaseClient()` in composables for all DB access
- Write field names in snake_case to match the DB schema
- Create a migration file for any schema change; never edit the DB directly
- Run `supabase gen types typescript --local > shared/types/database.types.ts` after any migration
- Use `SECURITY DEFINER` + `SET search_path = public` on all trigger functions
- Wrap `auth.uid()` in `(select auth.uid())` in RLS policies to prevent per-row re-evaluation
- Use typed `defineEmits` with Vue 3.3+ tuple syntax in every component
- Use `*Insert` / `*Update` Supabase-derived types for emit payloads and page handlers

### Don't
- Add camelCase ↔ snake_case conversion utilities
- Call `$fetch` with CSRF headers (the Django API is gone)
- Put API calls directly in components — use composables
- Modify the simulation engine in `models/` when doing API migration work
- Edit `shared/types/database.types.ts` by hand
- Add `supabase.redirect: true` — the custom middleware handles redirects
- Use `Partial<Model>` or `*Partial` types as emit payloads — use `*Insert` / `*Update` instead
- Use untyped `defineEmits(['create', 'update'])` — always type your emits
- Add new `*Partial` type aliases — they are deprecated

### Git — never switch or create branches
**Never run `git checkout`/`git switch`/`git branch` to change or create branches, and never create a new branch, unless I explicitly ask.** Do all work on whatever branch is currently checked out. I handle branching and committing myself.
