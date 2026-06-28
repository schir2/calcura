# composables/ — Conventions

## Directory structure

```
composables/
├── useAuth.ts              # Supabase Auth methods
├── useApi.ts               # Supabase CRUD wrapper (used by domain stores via modelStoreFactory)
├── useEventBus.ts          # Mitt event bus
├── useLoading.ts           # Loading bar state
├── useTitle.ts             # Page title helper
├── useCrudForm.ts          # Form state management
├── useCrudFormWithValidation.ts
├── useRepo.ts
├── useCurrentTime.ts
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


## Rules

- **No direct `$fetch` calls** — the Django API is gone
- **No CSRF headers** — Supabase uses JWT; no CSRF needed
- **No `toSnakeCase`/`toCamelCase`** — PostgREST returns snake_case; use it directly
- **No Supabase calls in components** — call composables; keep components dumb
- **Import `Database` type** from `#shared/types/database.types` when calling `useSupabaseClient<Database>()` for full type safety

## Validator composables (`validators/`)

Each domain has a Vee-Validate schema composable. These define `yup` schemas for form validation. Field names in schemas must match the snake_case interface names from `types/`.
