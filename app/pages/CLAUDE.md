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

workspace.openCreate('income', planId)   // create an entity
workspace.open('income', incomeId)       // edit an entity
workspace.openPlan(planId)               // edit the plan itself (ADR 015)
workspace.openPlan(planId, 'goal')       // ...opened straight to a tab
```

No emit bubbling to the page, and no per-domain form component in the page template. The drawer
resolves the domain's `WorkspaceForm.vue` and projection readout itself.

There is **no modal fallback**. A domain with no form registered in `common/EntityWorkspace.vue`
opens an empty drawer that says so — it does not quietly fall back to an old form. See
`docs/design/entity-workspace-implementation.md`.

**The plan is edited in the drawer too** ([ADR 015](../../docs/adr/015-plan-is-a-workspace-target.md)).
It is a Workspace *target* but **not an entity** — `ModelName` is the `command` table's Postgres
enum, so `'plan'` must never be added to it. The store discriminates on `kind` (`'entity' | 'plan'`)
instead. The plan's left pane is three tabs (Rates / Goal / Timeline); its right pane is the verdict
+ the net-worth spine, since a plan has no balance of its own.

Editing the plan **requires the projection pane**, which requires a loaded orchestrator and command
sequence — so it only works on the plan *detail* page. The plans *listing* page has no edit
affordance by design; "Open" leads to the detail page.

**Exception:** creating a plan is not a Workspace action — it is the `/plans/new` wizard. One-off UI
modals (e.g. the profile prompt) stay as local `showModal` refs.

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
