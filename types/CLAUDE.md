# types/ — Conventions

## Source of truth

`types/database.types.ts` is **auto-generated** from the Supabase schema. Never edit it by hand. Regenerate it after any migration:
```bash
supabase gen types typescript --local > types/database.types.ts
```

Reference this file when writing hand-crafted types to ensure field names match exactly.

## Naming convention: snake_case

**All interface field names use snake_case** to match Supabase/PostgREST column names exactly (see ADR 005). There is no camelCase-to-snake_case conversion layer.

```typescript
// CORRECT
interface Income {
  id: number;
  name: string;
  gross_income: number;
  growth_rate: number;
  income_type: 'ordinary';
  frequency: Frequency;
}

// WRONG — do not use camelCase for DB-mapped fields
interface Income {
  grossIncome: number; // ❌
  growthRate: number;  // ❌
}
```

## What lives here

| File | Purpose |
|------|---------|
| `database.types.ts` | Auto-generated Supabase DB types — do not edit |
| `Plan.ts` | Plan interface + all plan-related enums (RetirementStrategy, etc.) |
| `Income.ts` | Income interface + defaults |
| `Expense.ts` | Expense interface + defaults |
| `Debt.ts` | Debt interface + defaults |
| `Brokerage.ts` | Brokerage interface + defaults |
| `Ira.ts` | IRA interface + defaults |
| `RothIra.ts` | Roth IRA interface + defaults |
| `TaxDeferred.ts` | Tax-deferred interface + defaults |
| `CashReserve.ts` | Cash reserve interface + defaults |
| `*State.ts` | Year-by-year simulation state types — used by `models/` only |
| `CommandSequence.ts` | Command sequence type |
| `Command.ts` | Command type |
| `Auth.ts` | Auth credentials type |
| `UserProfile.ts` | Profiles table type (snake_case) |
| `Frequency.ts` | Frequency enum (matches DB enum) |

## Rules for adding new types

1. Match column names exactly as they appear in the SQL migration
2. Use `NUMERIC` columns as `number` in TypeScript (Supabase JS client parses them)
3. Use `TIMESTAMPTZ` columns as `string` (ISO 8601) — convert to `Date` only at the display layer
4. Export a `Partial<Omit<T, 'id' | 'created_at' | 'edited_at' | 'creator_id' | 'editor_id'>>` type for form/create payloads
5. Export a defaults object for form initialization

## State types (simulation engine)

`*State.ts` files describe the computed state for each simulated year. These are consumed by `models/` classes only. Field names in state types may be camelCase (they are not DB-mapped — they are computed values). Do not confuse state types with the DB-mapped interface types above.
