# ADR 007: Disable @nuxtjs/supabase redirect middleware

**Status:** Accepted  
**Date:** 2026-06-15

## Context

The `@nuxtjs/supabase` module includes a built-in redirect middleware that redirects unauthenticated users to a login page (configurable via `supabase.redirectOptions`). The app already has a custom `middleware/auth.ts` that handles this.

Running two redirect middlewares would cause double-redirect behavior and make the routing logic harder to follow.

## Decision

Disable the module's built-in redirect by setting `supabase.redirect: false` in `nuxt.config.ts`:

```typescript
supabase: {
  redirect: false,
  types: '~/types/database.types.ts',
}
```

The custom `middleware/auth.ts` is the single source of truth for route protection. It uses `useSupabaseUser()` to check authentication state.

## Consequences

**Positive:**
- Single, clearly-located auth redirect logic in `middleware/auth.ts`
- Custom middleware can implement nuanced redirect logic (e.g., redirect to intended destination after login, different handling for API routes)
- No hidden behavior from the Nuxt module

**Negative / Trade-offs:**
- Must remember to keep `middleware/auth.ts` in sync with route protection needs
- New agents must know that `middleware/auth.ts` is the auth gate — the module's redirect is intentionally off
- Any new protected route must use `definePageMeta({ middleware: 'auth' })` or be in a directory covered by the middleware

## Guidance

Do NOT enable `supabase.redirect` without understanding the existing middleware. If route-level auth protection needs changing, update `middleware/auth.ts`.
