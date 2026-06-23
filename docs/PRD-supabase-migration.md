# PRD: Migrate Backend to Supabase

## Problem Statement

Calcura's financial planning features are currently blocked by a broken Django REST Framework backend that is no longer functioning correctly as an API layer. Users cannot reliably save or retrieve financial plans, income sources, debts, investment accounts, or command sequences. The frontend (Nuxt) is tightly coupled to a session-based CSRF auth flow and a custom HTTP client that must be replaced. The existing backend adds operational overhead (server management, Django upgrades, deployment) that slows development and makes the app harder to maintain as a solo project.

## Solution

Replace the Django backend entirely with Supabase. All financial data (plans, incomes, expenses, debts, investment accounts, command sequences) moves to Postgres tables in Supabase. Row-Level Security (RLS) policies enforce user data isolation at the database level. Six Postgres triggers replace Django's signal handlers. Supabase Auth (with Google OAuth) replaces django-allauth. The Nuxt frontend replaces its custom HTTP client with the Supabase JS client, querying Supabase directly via PostgREST. The financial simulation engine in `models/` is untouched — it remains pure frontend logic.

## User Stories

1. As a user, I want to sign up with my Google account, so that I don't have to manage a separate password for Calcura.
2. As a user, I want to sign up with an email and password, so that I can use Calcura without a Google account.
3. As a user, I want to receive an email verification link after signing up, so that my account is secured.
4. As a user, I want to log in with my existing credentials, so that I can access my saved financial plans.
5. As a user, I want to log out, so that my account is protected on shared devices.
6. As a user, I want my profile (birthday, life expectancy) to be automatically created when I register, so that I don't have to set it up manually.
7. As a user, I want to create a financial plan, so that I can model my long-term financial situation.
8. As a user, I want to give my plan a name, age, year, inflation rate, and retirement strategy, so that the simulation has accurate parameters.
9. As a user, I want to create income sources (salary, freelance, etc.) and reuse them across multiple plans, so that updating an income once reflects everywhere.
10. As a user, I want to create expenses and attach them to one or more plans, so that I can model my spending across different scenarios.
11. As a user, I want to create debt records (mortgage, student loans, etc.) and reuse them across plans, so that I can model debt payoff across multiple scenarios.
12. As a user, I want to create brokerage investment accounts and attach them to plans, so that I can model taxable investment growth.
13. As a user, I want to create IRA accounts and associate them with a specific income source per plan, so that contribution percentage calculations are plan-specific.
14. As a user, I want to create Roth IRA accounts and associate them with a specific income source per plan, so that contribution calculations are accurate per scenario.
15. As a user, I want to create tax-deferred accounts (401k, 403b) and associate them with a specific income source per plan, including employer match configuration, so that I can model employer contributions per scenario.
16. As a user, I want to create HSA accounts and attach them to plans, so that I can model health savings.
17. As a user, I want to create cash reserve configurations and attach them to plans, so that I can model emergency fund targets.
18. As a user, I want to remove a financial item from a plan without deleting the item itself, so that I can reassign it to a different plan.
19. As a user, I want each plan to automatically have a command sequence created when the plan is created, so that I can immediately start ordering financial operations.
20. As a user, I want command sequences to be automatically populated with commands for all items already attached to a plan, so that I don't have to manually add them.
21. As a user, I want a command to be automatically created when I add a financial item, so that it appears in my command sequences without manual steps.
22. As a user, I want a command to be automatically removed when I delete a financial item, so that command sequences stay clean.
23. As a user, I want to create multiple command sequences per plan, so that I can compare different operation orderings (e.g. pay debt first vs. invest first).
24. As a user, I want to reorder commands within a sequence, so that I can control the priority of financial operations in the simulation.
25. As a user, I want to mark individual commands as inactive within a sequence, so that I can exclude a financial item from a simulation without removing it from the plan.
26. As a user, I want to switch a command sequence between predefined and custom ordering, so that I can either use best-practice defaults or define my own order.
27. As a user, I want to browse template financial plans, incomes, expenses, debts, and investment accounts, so that I can quickly start with a realistic baseline.
28. As a user, I want to apply a plan template to create a new plan pre-populated with standard configurations, so that I don't have to build a plan from scratch.
29. As a user, I want my financial data to be private and inaccessible to other users, so that my personal financial information is secure.
30. As an admin, I want to create and edit template financial items and plan templates, so that I can curate useful starting points for users.
31. As an admin, I want regular users to only be able to read templates, so that shared reference data stays consistent.

## Implementation Decisions

### Modules

**1. Supabase Schema & Migrations**
All Django models are represented as Postgres tables in Supabase. A single migration file (or a sequence) defines: all enums (frequency, contribution strategies, retirement strategies, etc.), all financial tables with audit columns (created_at, edited_at, creator_id, editor_id), all template tables, all M2M junction tables, and the commands/command sequence tables.

Key schema changes from the Django original:
- `Command.content_type_id + object_id` → `model_name text enum + model_id bigint` (discriminated pair, no ContentType abstraction)
- `ira.income_id`, `roth_ira.income_id`, `tax_deferred.income_id` → moved to `plan_iras.income_id`, `plan_roth_iras.income_id`, `plan_tax_deferreds.income_id` (plan-specific income association)
- `GlossaryTerm` table is not created

Junction tables: `plan_incomes`, `plan_expenses`, `plan_debts`, `plan_cash_reserves`, `plan_brokerages`, `plan_iras` (+ income_id), `plan_roth_iras` (+ income_id), `plan_hsas`, `plan_tax_deferreds` (+ income_id).

**2. Postgres Triggers**
Six triggers replace Django signal handlers. All run inside the originating transaction (atomic). No Edge Functions are used for this logic.

- `on_user_created` — insert profile row with defaults on new auth.users insert
- `on_financial_item_insert` — insert a command row when any financial item is inserted (one trigger function shared by all financial item tables)
- `on_financial_item_delete` — delete the associated command row when a financial item is deleted
- `on_plan_created` — insert a command sequence named after the plan
- `on_command_sequence_created` — populate command_sequence_commands from the plan's existing commands
- `on_plan_item_junction_insert` / `on_plan_item_junction_delete` — create or remove command_sequence_command entries when items are added to or removed from a plan

**3. Row-Level Security Policies**
RLS enforces all data isolation at the database level, not in application code.

Policy rules:
- All user-owned tables (plan, income, expense, debt, brokerage, ira, roth_ira, hsa, tax_deferred, cash_reserve, command, command_sequence, command_sequence_command, profile): `creator_id = auth.uid()` for SELECT/INSERT/UPDATE/DELETE
- Junction tables (plan_incomes, plan_expenses, etc.): policy checks that the associated plan's creator_id matches auth.uid()
- Template tables (income_template, expense_template, etc.): SELECT for any authenticated user, INSERT/UPDATE/DELETE restricted to `profiles.is_admin = true`

**4. Supabase Auth Integration**
Replace django-allauth with Supabase Auth.

- Email + password signup with built-in email verification
- Google OAuth provider configured in Supabase dashboard
- JWT replaces Django sessions — no CSRF tokens
- `api.ts` Nuxt plugin is replaced by a Supabase client plugin
- `useAuth.ts` composable is rewritten to use `supabase.auth.signInWithPassword`, `signInWithOAuth`, `signOut`, `onAuthStateChange`
- `authStore.ts` is updated to store the Supabase session/user

**5. Supabase Client Plugin (replaces `api.ts` + `useApi.ts` + `baseService.ts`)**
A single Nuxt plugin provides the typed Supabase client app-wide. All composables in `composables/api/` are rewritten to use `supabase.from(table).select/insert/update/delete` instead of HTTP calls.

- `addRelatedModel` / `removeRelatedModel` become direct inserts/deletes on junction tables — triggers cascade from there automatically
- `toSnakeCase` conversion is dropped; all field names are snake_case throughout

**6. TypeScript Type Updates**
All types in `types/` are updated to snake_case to match Supabase PostgREST responses. Database types can be auto-generated from the Supabase CLI (`supabase gen types typescript`).

### Architecture Notes

- The financial simulation engine in `models/` is not touched — it receives plain data objects and its interface is unaffected by the snake_case change as long as the calling composables map correctly
- `ordering_type` (`predefined` | `custom`) remains a frontend-interpreted hint; no trigger logic is needed for predefined ordering
- `is_active` on `command_sequence_command` is a plain boolean column — no trigger needed, toggled directly by the client
- No Edge Functions are needed for this migration

## Testing Decisions

A good test verifies observable behavior — what data ends up in the database, what the composable returns — not internal implementation details like which Supabase method was called.

**Modules to test:**

- **Postgres triggers** — integration tests using the Supabase local dev environment: verify that inserting a financial item creates a command, deleting it removes the command, creating a plan creates a command sequence, adding an item to a plan's junction table creates a command_sequence_command entry
- **RLS policies** — integration tests with two distinct test users: verify that user A cannot read, update, or delete user B's plans, incomes, or other financial items
- **Auth composable (`useAuth.ts`)** — unit tests with a mocked Supabase client: verify sign-in, sign-out, and session state transitions
- **API composables (`composables/api/`)** — unit tests with a mocked Supabase client: verify that CRUD operations call the correct table with correct filters

Prior art: existing vitest tests in `tests/` using `@nuxt/test-utils` and `happy-dom`.

## Out of Scope

- Blog app migration — the blog stays on Django or is handled separately
- GlossaryTerm — dropped; will be rebuilt differently in the frontend if needed
- Data migration — there is no production data to migrate; this is a clean start
- Edge Functions — no business logic requires them
- Celery / background jobs — none exist
- Payment integrations — none exist
- Admin UI — Supabase dashboard serves as the admin interface for templates and user management

## Further Notes

- A partial Supabase migration already exists at `supabase/migrations/20250302012355_brokerages-schema.sql`. It defines most enums and tables but does not yet include RLS policies, triggers, or the corrected junction table schema (income_id on junction tables rather than on the item). The new migration should supersede or extend this file.
- The `@nuxtjs/supabase` Nuxt module is the recommended integration (handles client SSR/CSR, session hydration, and typed client). It is not yet installed.
- Supabase CLI is already initialized in the repo (`supabase/config.toml` exists).
- All snake_case type changes will require a sweep of `pages/`, `components/`, and `composables/` wherever field names are accessed directly.
