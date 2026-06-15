# stores/ — Conventions

## Pattern: Pinia composition API

All stores use the `defineStore` composition API (not options API):

```typescript
export const useXxxStore = defineStore('xxx', () => {
  // state as refs
  const items = ref<Item[]>([])
  
  // computed
  const count = computed(() => items.value.length)
  
  // actions
  async function load() { ... }
  
  return { items, count, load }
})
```

## Stores in this directory

| File | Purpose |
|------|---------|
| `authStore.ts` | Supabase session + user; exposes login/logout/register |
| `themeStore.ts` | UI theme preference |

## Auth store rules

`authStore.ts` holds `Session` and `User` from `@supabase/supabase-js`. Key rules:
- `session` is the Supabase `Session` object (contains JWT, expiry, etc.)
- `user` is the Supabase `User` object (id, email, metadata)
- `isAuthenticated` is `computed(() => session.value !== null)`
- `initialize()` must be called once on app startup (e.g., in a plugin or `app.vue`) to sync `onAuthStateChange`
- Never store CSRF tokens, Django session cookies, or custom headers here

## What stores must NOT do

- **No direct Supabase queries** — use composables in `composables/api/` for data fetching
- **No business logic** — that lives in `models/`
- **No `$fetch` calls** — the Django API is gone; all data goes through `useSupabaseClient()`
- **No `useApi`** (the old Django CRUD wrapper) — domain composables will migrate to Supabase client directly

## Adding a new store

Only add a store for global reactive state that multiple components need. Domain data (plans, incomes, etc.) should live in composables using `useState` or be fetched per-component — stores are for cross-cutting state like auth and theme.
