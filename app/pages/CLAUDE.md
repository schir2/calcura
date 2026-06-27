# pages/ — Conventions

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

## Modal management

Pages own modal rendering. Use `useModalStore` to conditionally show domain CRUD modals:

```vue
<script lang="ts" setup>
const modal = useModalStore()
</script>

<template>
  <IncomeCreateForm
    v-if="modal.action === 'create' && modal.model === 'income'"
    :plan_id="modal.payloadFor('create', 'income')!.plan_id"
    @close="modal.close()"
  />
</template>
```

Components trigger modals via `modal.open(action, model, payload)` — no emit bubbling up to the page required. See `app/stores/CLAUDE.md` for the full modal store API.

**Exception:** plan create and one-off UI modals (e.g. profile prompt) stay as local `showModal` refs — the modal store is for domain CRUD only.

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
