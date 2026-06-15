# supabase/ — Conventions

## Directory structure

```
supabase/
├── config.toml          # Local Supabase configuration
├── migrations/          # SQL migration files (ordered by timestamp)
│   └── YYYYMMDDHHMMSS_name.sql
└── snippets/            # Reusable SQL snippets (not applied automatically)
```

## Migration naming

Use the Supabase CLI to create migrations — it generates the correct timestamp prefix:
```bash
supabase migration new <descriptive-name>
```
This creates `supabase/migrations/YYYYMMDDHHMMSS_descriptive-name.sql`.

**Never rename or reorder migration files.** Supabase applies them in lexicographic order by filename.

## Applied migrations

| File | What it does |
|------|-------------|
| `20250302012355_brokerages-schema.sql` | Full schema: all tables, enums, indexes |
| `20260615000001_triggers.sql` | Six Postgres trigger functions for command automation |
| `20260615000002_rls_policies.sql` | Row-Level Security on all public schema tables |
| `20260615000003_auth_trigger.sql` | `on_user_created` trigger for profiles auto-creation |

## Rules for migration files

- **Never modify an already-applied migration.** If you need to change something, create a new migration.
- Each migration must be idempotent where possible — use `CREATE OR REPLACE FUNCTION`, `IF NOT EXISTS`, etc.
- Trigger functions must be `SECURITY DEFINER` and include `SET search_path = public` to prevent privilege escalation.
- Use `(select auth.uid())` in RLS policies, not bare `auth.uid()` — this prevents per-row re-evaluation.

## Local development workflow

```bash
supabase start               # Start local Supabase (needs Docker)
supabase db reset            # Drop and replay all migrations (safe for local)
supabase migration up        # Apply only new/pending migrations
supabase gen types typescript --local > ../types/database.types.ts
```

## Schema conventions

All columns follow the conventions in the ADRs:
- PKs: `BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` (see ADR 002)
- Financial values: `NUMERIC` (see ADR 003)
- Strings: `TEXT` (not `VARCHAR(n)`)
- Timestamps: `TIMESTAMPTZ` (not `TIMESTAMP`)
- Audit columns: `creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL`, `editor_id UUID ...`
- No custom `users` table — reference `auth.users` directly

## Trigger conventions (see ADR 004)

All automation triggers are in `20260615000001_triggers.sql`. To add a new trigger:
1. Create a new migration (never edit the existing trigger migration)
2. Use `CREATE OR REPLACE FUNCTION`
3. Always `SECURITY DEFINER` + `SET search_path = public`
4. Test by inserting rows in Supabase Studio and inspecting resulting table state

## RLS conventions

All tables have RLS enabled. Rules:
- User-owned tables: `creator_id = (select auth.uid())`
- Junction tables: join to parent `plan.creator_id`
- Profiles: `user_id = (select auth.uid())`
- Templates: SELECT open to `authenticated`; writes restricted to `is_admin = true`

Never add a table without also adding an RLS policy migration.
