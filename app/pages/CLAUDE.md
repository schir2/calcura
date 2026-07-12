# pages/ — Conventions

## Styling

All color/radius/elevation follows [`docs/design-system.md`](../../docs/design-system.md). Color = `skin` tokens (`bg-skin-*`, `text-skin-*`); never raw Tailwind colors. Tailwind for layout/spacing only; use NaiveUI components when they exist.

## Routing

Nuxt 3 file-based routing. File paths map directly to URL paths.

## Layouts

Every page must declare its layout in `definePageMeta`:
```typescript
definePageMeta({
  layout: 'default',  // authenticated app shell
  // layout: 'auth',  // login/register pages
  // layout: 'landing',  // public landing page
})
```

## Auth protection

Protected pages (anything requiring login) must declare the auth middleware:
```typescript
definePageMeta({
  layout: 'default',
  middleware: 'auth',  // redirects to /auth/login if not authenticated
})
```

`middleware/auth.ts` uses `useSupabaseUser()` to check authentication. Do NOT use the old `authStore.isAuthenticated` check in pages — use the middleware.

## Data fetching

Use domain Pinia stores for all data access — call `store.fetchAll()` on mount and bind to `store.list` in the template:

```typescript
const incomeStore = useIncomeStore()
onMounted(() => incomeStore.fetchAll())
// template: v-for="income in incomeStore.list"
```

Do not call `useSupabaseClient()` directly in pages, and do not use the legacy `useXxxService()` composables — those are being removed in favour of stores.

## Entity create / edit — the Workspace drawer

**Domain entities are never edited in a modal.** Creating or editing any plan entity (income,
expense, debt, brokerage, IRA, Roth, 401k, HSA, cash reserve) opens the shared **Entity Workspace**
drawer. See [ADR 012](../../docs/adr/012-retire-legacy-modal-form-stack.md).

Pages render the drawer once; any component can summon it through `useWorkspaceStore()`:

```ts
const workspace = useWorkspaceStore()

workspace.openCreate('income', planId)   // create
workspace.open('income', incomeId)       // edit
```

No emit bubbling to the page, and no per-domain form component in the page template. The drawer
resolves the domain's `WorkspaceForm.vue` and projection readout itself.

There is **no modal fallback**. A domain missing from `WORKSPACE_ENABLED_MODELS` simply cannot be
created — it does not quietly open an old form. See
`docs/design/entity-workspace-implementation.md`.

**Exception:** plan create/edit and one-off UI modals (e.g. the profile prompt) stay as local
`showModal` refs. A plan is not a Workspace domain.

## Page structure pattern

```vue
<template>
  <div>
    <n-spin :show="pending">
      <!-- content -->
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ layout: 'default', middleware: 'auth' })

// Data via composable
const { data, pending } = useAsyncData(...)
</script>
```
