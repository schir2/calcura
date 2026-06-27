# types/ — Conventions

This directory contains **UI/frontend-specific types only**. All other types live in `shared/types/`.

## What lives here

| File | Purpose |
|------|---------|
| `Auth.ts` | Auth credentials type (Nuxt/Supabase auth wiring — app-layer only) |
| `FormatType.ts` | Display formatting enum — used by UI formatters only |
| `Modal.ts` | `ModalAction`, `DeletePayload`, `ModalPayload<TAction, TModel>` — types for `useModalStore` |

## What lives in `shared/types/`

Everything else: domain API types (`Brokerage`, `Income`, `Plan`, etc.), simulation state types (`*State.ts`), DB-generated types (`database.types.ts`), and shared enums (`Frequency`, `ModelName`, etc.).

Use `#shared/types/<Name>` to import from there.

Regenerate DB types after any migration:
```bash
supabase gen types typescript --local > shared/types/database.types.ts
```

## Rules for adding new types

1. Match column names exactly as they appear in the SQL migration
2. Use `NUMERIC` columns as `number` in TypeScript (Supabase JS client parses them)
3. Use `TIMESTAMPTZ` columns as `string` (ISO 8601) — convert to `Date` only at the display layer
4. Export `*Insert` and `*Update` aliases derived from Supabase generated types — these are the canonical payload types for emits and service calls:
   ```typescript
   export type IncomeInsert = TablesInsert<'income'>
   export type IncomeUpdate = TablesUpdate<'income'>
   ```
5. Export a defaults object for form initialization
6. Do **not** export hand-crafted `*Partial` types (e.g. `Partial<Omit<Income, 'id'>>`). These are deprecated — use `*Insert` and `*Update` instead. Existing `*Partial` exports should be removed as components are updated.

## Deprecated patterns

**`*Partial` types** — `IncomePartial`, `DebtPartial`, `ExpensePartial`, etc. — are hand-crafted `Partial<Omit<T, 'id'>>` aliases that predate the Supabase migration. They are being replaced by the Supabase-derived `*Insert` / `*Update` types. Do not add new `*Partial` types; migrate away from existing ones when touching a file.

## State types (simulation engine)

`*State.ts` files describe the computed state for each simulated year. These are consumed by `models/` classes only. Field names in state types may be camelCase (they are not DB-mapped — they are computed values). Do not confuse state types with the DB-mapped interface types above.
