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

- **No business logic** — that lives in `models/`
- **No `$fetch` calls** — the Django API is gone
- **No `useApi`** — the old Django CRUD wrapper is deleted; all DB access uses `useSupabaseClient()` directly inside stores via `modelStoreFactory`

## Adding a new store

Domain data stores are created via `modelStoreFactory`. Only reach for a manual `defineStore` for cross-cutting state that doesn't map to a DB table (e.g., `authStore`, `themeStore`, `useModalStore`).
