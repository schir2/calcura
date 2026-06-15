# ADR 004: Postgres triggers for all automation

**Status:** Accepted  
**Date:** 2026-06-15

## Context

Supabase offers two server-side automation mechanisms:
1. **Postgres triggers** — run inside the originating transaction, written in PL/pgSQL
2. **Edge Functions** — Deno/TypeScript functions invoked via HTTP webhooks or database webhooks

Six automation flows need replacing from Django signal handlers:
- Auto-create `command` row on financial item insert
- Auto-delete `command` row on financial item delete
- Auto-create `command_sequence` on plan creation
- Auto-populate `command_sequence` with existing commands on creation
- Auto-insert `command_sequence_command` on junction table insert
- Auto-delete `command_sequence_command` on junction table delete

Plus one auth flow:
- Auto-create `profiles` row when a user signs up (`auth.users` INSERT)

## Decision

Use Postgres triggers (PL/pgSQL, `SECURITY DEFINER`) for all automation. No Edge Functions.

All trigger functions are `SECURITY DEFINER` to bypass RLS for cross-table writes that the triggering user would not otherwise have permission to perform.

## Consequences

**Positive:**
- Atomic with the originating transaction — a trigger failure rolls back the entire INSERT/DELETE; data cannot be left in an inconsistent state
- No network round-trip — all automation is in-process with the Postgres query
- No cold-start latency (unlike Edge Functions)
- No additional Supabase billing for Edge Function invocations
- Self-contained in a migration file — easy to inspect and version-control

**Negative / Trade-offs:**
- PL/pgSQL is harder to unit-test than TypeScript — integration tests against a live Supabase instance are required
- Complex trigger logic (e.g., `on_command_sequence_created`) is harder to read than equivalent application code
- `SECURITY DEFINER` requires care — the function runs with elevated privileges; `SET search_path = public` must be set to prevent search path injection
- Debugging requires Supabase logs or `RAISE NOTICE` statements rather than familiar JS debugging tools

**On `SECURITY DEFINER`:**
All trigger functions set `SET search_path = public` explicitly to prevent privilege escalation via search path manipulation. This is a required practice; do not remove it.

## Related ADRs
- [001](001-supabase-over-django.md) — overall migration decision
