# ADR 003: NUMERIC for all financial columns

**Status:** Accepted  
**Date:** 2026-06-15

## Context

Financial values (balances, rates, amounts, percentages) can be stored as `FLOAT`, `DOUBLE PRECISION`, or `NUMERIC` in Postgres. Floating-point types use IEEE 754 binary representation, which cannot exactly represent most decimal fractions. This causes rounding errors that compound across multi-year financial simulations.

## Decision

All financial columns use `NUMERIC` (exact decimal arithmetic):
```sql
gross_income NUMERIC NOT NULL,
growth_rate  NUMERIC NOT NULL,
initial_balance NUMERIC NOT NULL,
-- etc.
```

## Consequences

**Positive:**
- Exact decimal representation — no floating-point drift over 30–40 year simulation runs
- Results are deterministic regardless of operation order
- Matches user expectations: $1000.00 × 1.07 = $1070.00, not $1070.0000000000001

**Negative / Trade-offs:**
- `NUMERIC` operations are slower than `FLOAT` — acceptable for this use case (not a high-frequency trading system)
- PostgREST returns `NUMERIC` columns as strings in JSON to preserve precision. The TypeScript types and composables must handle this (parse to `number` or keep as string for display). The simulation engine receives numbers already parsed by the JS Supabase client.

**Note on precision:**
We do not specify precision/scale (e.g., `NUMERIC(15,4)`). Unconstrained `NUMERIC` stores the exact value as entered. This is intentional — growth rates might be `0.07` or `7.5` depending on user convention; we don't want scale constraints to silently truncate.
