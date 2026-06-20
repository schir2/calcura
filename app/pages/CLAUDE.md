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

Use `useFetch` or `useAsyncData` with the domain service composables:
```typescript
const { data: plans, pending } = useAsyncData('plans', () => {
  const { list } = usePlanService()
  return list()
})
```

Do not call `useSupabaseClient()` directly in pages — always go through composables.

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
