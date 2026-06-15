# ADR 002: BIGINT GENERATED ALWAYS AS IDENTITY for all primary keys

**Status:** Accepted  
**Date:** 2026-06-15

## Context

Choosing a primary key strategy involves three options in Postgres:
1. `SERIAL` / `BIGSERIAL` — legacy sequence shorthand
2. `UUID v4` — globally unique, random
3. `BIGINT GENERATED ALWAYS AS IDENTITY` — modern SQL standard sequential integer
4. `UUID v7` — time-ordered UUID (not yet standard in Postgres)

## Decision

Use `BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY` for every table.

```sql
id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
```

## Consequences

**Positive:**
- Sequential insertion order means B-tree indexes stay ordered — no fragmentation (unlike random UUIDv4)
- 8 bytes vs 16 bytes for UUID — smaller index footprint
- Human-readable in logs, Studio UI, and debug output
- `GENERATED ALWAYS` prevents accidental manual inserts overriding the sequence
- Standard SQL (ISO/IEC 9075) — not PostgreSQL-specific syntax like SERIAL

**Negative / Trade-offs:**
- IDs are not globally unique — cannot safely merge rows from two databases by ID
- IDs are predictable (enumerability attack surface) — mitigated entirely by RLS; users cannot access rows they don't own regardless of ID guessing

**If UUIDs become necessary:**
Switch to `UUID v7` (time-ordered, no fragmentation). UUIDv4 would be the wrong choice — it has all the global-uniqueness upside of UUIDs but also index fragmentation. The current sequential approach is deliberately chosen and should not be changed without re-evaluating the full index strategy.

## Related ADRs
- [001](001-supabase-over-django.md) — overall migration context
