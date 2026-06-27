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
| `modalStore.ts` | Single active modal slot — `open(action, model, payload)`, `close()`, `payloadFor(action, model)` |

Domain data stores (income, expense, debt, etc.) live here too, each created via `modelStoreFactory`.

## Modal store

`useModalStore` manages one active CRUD modal at a time. Pages render modals conditionally based on `modal.action` and `modal.model`; components deep in the tree trigger them via `modal.open(...)` with no event bubbling.

```typescript
// Trigger from any component
modal.open('create', 'income', { plan_id: 42 })
modal.open('edit',   'income', { id: 7 })
modal.open('delete', 'income', { model: 'income', id: 7, label: 'Salary' })

// Render in page
<IncomeCreateForm
  v-if="modal.action === 'create' && modal.model === 'income'"
  :plan_id="modal.payloadFor('create', 'income')!.plan_id"
  @close="modal.close()"
/>
```

`payloadFor(action, model)` returns the correctly typed payload or `null` — use it instead of casting `modal.payload` directly.

**Out of scope for modal store:** template picker modals (use popovers), plan create (local `showModal` ref — no `plan_id` parent), and one-off UI modals like the profile prompt.

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
