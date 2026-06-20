# composables/ — Conventions

## Directory structure

```
composables/
├── useAuth.ts              # Supabase Auth methods
├── useApi.ts               # Legacy Django CRUD wrapper (being phased out in #8+)
├── useEventBus.ts          # Mitt event bus
├── useLoading.ts           # Loading bar state
├── useTitle.ts             # Page title helper
├── useCrudForm.ts          # Form state management
├── useCrudFormWithValidation.ts
├── useRepo.ts
├── useCurrentTime.ts
├── api/                    # Domain service composables (one per domain)
│   ├── usePlanService.ts
│   ├── useIncomeService.ts
│   └── ...
└── validators/             # Vee-Validate schema composables
    ├── usePlanValidator.ts
    └── ...
```

## Auth composable (`useAuth.ts`)

Wraps `supabase.auth.*` methods. Do not call Supabase auth methods directly in components or stores — always go through `useAuth`. Methods:
- `signInWithPassword(email, password)` — email/password login
- `signInWithGoogle()` — OAuth redirect (requires Google provider enabled in Supabase dashboard)
- `signUp(email, password)` — registration (triggers profile auto-creation via DB trigger)
- `signOut()` — clears session

## Domain service composables (`api/`)

Each domain (plan, income, expense, debt, brokerage, ira, roth_ira, hsa, tax_deferred) has a service composable. These are being rewritten from the Django `useApi` wrapper to direct Supabase client calls (issue #8 and beyond).

**Current state (pre-#8):** `api/` composables still call `useApi` which hits the (removed) Django endpoints. They will not work until replaced with Supabase queries.

**Target pattern after #8:**
```typescript
export const useIncomeService = () => {
  const client = useSupabaseClient<Database>()
  
  return {
    list: () => client.from('income').select('*').order('created_at'),
    get: (id: number) => client.from('income').select('*').eq('id', id).single(),
    create: (data: IncomeInsert) => client.from('income').insert(data).select().single(),
    update: (id: number, data: IncomeUpdate) => client.from('income').update(data).eq('id', id).select().single(),
    remove: (id: number) => client.from('income').delete().eq('id', id),
  }
}
```

Always destructure `{ data, error }` from Supabase queries and throw or handle `error` before using `data`.

## Rules

- **No direct `$fetch` calls** — the Django API is gone
- **No CSRF headers** — Supabase uses JWT; no CSRF needed
- **No `toSnakeCase`/`toCamelCase`** — PostgREST returns snake_case; use it directly
- **No Supabase calls in components** — call composables; keep components dumb
- **Import `Database` type** from `#shared/types/database.types` when calling `useSupabaseClient<Database>()` for full type safety

## Validator composables (`validators/`)

Each domain has a Vee-Validate schema composable. These define `yup` schemas for form validation. Field names in schemas must match the snake_case interface names from `types/`.
