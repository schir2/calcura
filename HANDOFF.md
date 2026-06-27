# Handoff — Calcura Supabase Migration

**Date:** 2026-06-15
**Branch:** `feature/supabase`
**Repo:** https://github.com/schir2/calcura

---

## What this project is

Calcura is a financial planning Nuxt 3 app. The Django REST backend is broken and being replaced entirely with Supabase. The simulation engine in `models/` is pure frontend logic and is **not being touched**.

See the full PRD: GitHub issue #1 on schir2/calcura.

---

## What was done this session

### Issue #2 — `@nuxtjs/supabase` install ✅ CLOSED
- Installed `@nuxtjs/supabase`
- Registered in `nuxt.config.ts` with `supabase: { redirect: false }` (defers to existing `middleware/auth.ts`)
- `.env.example` created documenting `SUPABASE_URL` and `SUPABASE_KEY`
- `nuxt prepare` runs cleanly; `useSupabaseClient()` and `useSupabaseUser()` are available app-wide
- Note: `.env` already had `SUPABASE_URL`, `SUPABASE_KEY`, and `SUPABASE_SERVICE_KEY`. The service key env var name is deprecated — Supabase now wants `NUXT_SUPABASE_SECRET_KEY` but it's non-breaking for now.

### Issue #3 — Schema migration ✅ CLOSED
- `supabase/migrations/20250302012355_brokerages-schema.sql` was fully rewritten (supersedes the old partial draft)
- Key design decisions applied:
  - `BIGINT GENERATED ALWAYS AS IDENTITY` PKs (not UUID v4; not BIGSERIAL)
  - `NUMERIC` for all financial values (not `FLOAT`)
  - `TEXT` for all string columns (not `VARCHAR(255)`)
  - `TIMESTAMPTZ` for timestamps
  - `creator_id`/`editor_id` as `UUID REFERENCES auth.users(id)` (no custom `users` table)
  - `profiles` table with `user_id UUID → auth.users`, `birthday`, `life_expectancy`, `is_admin BOOLEAN DEFAULT FALSE`
  - `income_id` removed from `ira`, `roth_ira`, `tax_deferred` item tables — lives on `plan_iras`, `plan_roth_iras`, `plan_tax_deferreds` junction tables instead (plan-specific association)
  - `hsa` and `hsa_template` tables added; `plan_hsas` junction table added
  - `command` table uses `model_name model_name` enum + `model_id BIGINT` (replaces Django ContentType)
  - All template junction tables included
- Migration confirmed running on local Supabase instance (user verified)

### Triage — all remaining issues
- Created state labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`
- #1 (PRD tracking): `needs-triage`
- #4–#15: all labeled `ready-for-agent`
- Agent briefs posted on the 4 immediately unblocked issues: #4, #5, #6, #7

---

## Current state of open issues

All issues are enhancements under the Supabase migration PRD (#1).

### Immediately actionable (no blockers):

| # | Title | Brief posted? |
|---|-------|---------------|
| #4 | Auth: signup, login, logout + Google OAuth + profile auto-creation | ✅ |
| #5 | Generate TypeScript types from schema + snake_case sweep | ✅ |
| #6 | Postgres triggers: replace all 6 Django signal handlers | ✅ |
| #7 | RLS policies: user-owned tables, junction tables, templates | ✅ |

#4, #5, #6, #7 can all be worked **in parallel** — no cross-dependencies.

### Blocked (fully specified, briefs deferred until deps land):

| # | Title | Blocked by |
|---|-------|-----------|
| #8 | Supabase client plugin + base composable layer | #4, #5 |
| #9 | Plans: CRUD + UI wiring | #6, #7, #8 |
| #10 | Income & Expense: CRUD + plan attachment | #9 |
| #11 | Debt & CashReserve: CRUD + plan attachment | #9 |
| #12 | Brokerage & HSA: CRUD + plan attachment | #9 |
| #13 | IRA, RothIRA, TaxDeferred: CRUD + plan-specific income FK | #9, #10 |
| #14 | Command sequences: reorder, toggle is_active, switch ordering_type | #9 |
| #15 | Templates: read-only browsing for users, admin writes | #7, #8 |

---

## Architecture decisions made this session

- **PKs:** `BIGINT GENERATED ALWAYS AS IDENTITY` — sequential, 8 bytes, no fragmentation. UUID v4 was rejected (index fragmentation). UUIDv7 is the right choice if UUIDs are ever needed later.
- **`income_id` on junction tables:** IRA/RothIRA/TaxDeferred `income_id` is plan-specific — stored on `plan_iras`, `plan_roth_iras`, `plan_tax_deferreds`, not on the item tables.
- **`supabase.redirect: false`:** Disables the module's own redirect middleware; the existing `middleware/auth.ts` handles routing.
- **No Edge Functions:** All automation (command creation, profile creation) is done via Postgres triggers.

---

## Key files changed

- `nuxt.config.ts` — `@nuxtjs/supabase` added to modules, `supabase.redirect: false`
- `supabase/migrations/20250302012355_brokerages-schema.sql` — complete rewrite
- `.env.example` — created (documents `SUPABASE_URL`, `SUPABASE_KEY`)
- `package.json` / `package-lock.json` — `@nuxtjs/supabase` installed

---

## Environment

- Local Supabase running (`supabase start` already done by user; migration is applied)
- `.env` has `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY` (real values, not redacted here — check `.env` directly)
- Nuxt dev server: `npm run dev`
- Supabase local Studio: http://localhost:54323

---

## Suggested next steps

The 4 unblocked issues (#4, #5, #6, #7) are the logical next work. Suggested order if working serially:

1. **#6 (triggers)** + **#7 (RLS)** — pure SQL/DB work, no frontend changes needed
2. **#4 (auth)** — requires removing `plugins/api.ts` and rewriting `authStore`/`useAuth`
3. **#5 (TS types)** — run `supabase gen types typescript --local`, then sweep `types/`, `pages/`, `components/`, `composables/`, `models/`
4. Then #8 unblocks and the domain CRUD issues follow in order

---

## Suggested skills

- `/supabase` — use for any Supabase-specific task (RLS, triggers, client, auth, CLI). The skill loads the security checklist and Supabase-specific gotchas automatically. **Always invoke before working on #4, #6, #7.**
- `/supabase-postgres-best-practices` — use when writing SQL (triggers, indexes, RLS expressions). Contains rules on primary keys, data types, RLS performance, connection management.
- `/triage` — use to move issues through the state machine as they complete or new ones come in. Agent briefs for #8–#15 should be written once their blockers land.
- `/code-review` — run before closing any issue to catch correctness bugs.
