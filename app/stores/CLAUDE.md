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
| File | Purpose |
|------|---------|
| `authStore.ts` | Supabase session + user; exposes login/logout/register |
| `themeStore.ts` | UI theme preference |
| `workspaceStore.ts` | The open Entity Workspace — `openCreate(model, planId)`, `open(model, id)`, `close()` |

Domain data stores (income, expense, debt, etc.) live here too, each created via `modelStoreFactory`.

## Workspace store

`useWorkspaceStore` owns the **Entity Workspace** drawer — the single surface for creating or editing any plan entity. Components anywhere in the tree summon it directly; no event bubbling to the page, and no per-domain form in the page template.

```typescript
const workspace = useWorkspaceStore()

workspace.openCreate('income', planId)   // create — no id yet
workspace.open('income', incomeId)       // edit — mode derives from the id
workspace.close()
```

The drawer resolves the domain's `WorkspaceForm.vue` and projection readout itself. `mode` is computed from whether an `id` is present, so callers never set it.

**Which domains the drawer supports is decided by `common/EntityWorkspace.vue`** — its `formComponent` / `projectionComponent` switches. There is no separate enabled-models list, and no modal fallback: a domain with no registered form opens an empty drawer saying so. See [ADR 012](../../docs/adr/012-retire-legacy-modal-form-stack.md).

**Out of scope:** plan create/edit (local `showModal` ref — a plan is not a Workspace domain) and one-off UI modals like the profile prompt.

> `modalStore.ts` — the old single-CRUD-modal slot — is superseded by the Workspace and is being removed with the rest of the legacy stack (ADR 012).

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

Domain data stores are created via `modelStoreFactory`. Only reach for a manual `defineStore` for cross-cutting state that doesn't map to a DB table (e.g., `authStore`, `themeStore`, `useWorkspaceStore`).
