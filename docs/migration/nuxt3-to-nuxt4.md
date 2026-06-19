# Nuxt 3 → Nuxt 4 Migration Guide

## Overview

Nuxt 4's biggest structural change is that `srcDir` moves from the project root (`.`) to `app/`. This pulls all Nuxt-convention directories inside `app/` and changes how path aliases resolve.

**Recommended order:** enable compat mode → fix all errors → move directories → upgrade package.
Never debug a directory move and a package upgrade at the same time.

---

## Step 1 — Opt into Nuxt 4 compat mode (stay on Nuxt 3)

Add `future.compatibilityVersion` to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },
  // ... rest of config
})
```

Run `npm run dev` and fix any errors before moving on. This lets you catch breakage without touching the package version.

---

## Step 2 — Move Nuxt convention directories into `app/`

Create the `app/` directory, then move:

| From (root) | To |
|---|---|
| `assets/` | `app/assets/` |
| `components/` | `app/components/` |
| `composables/` | `app/composables/` |
| `layouts/` | `app/layouts/` |
| `middleware/` | `app/middleware/` |
| `pages/` | `app/pages/` |
| `plugins/` | `app/plugins/` |
| `utils/` | `app/utils/` |

These directories **stay at the root** — they are not under `srcDir`:

| Directory | Reason |
|---|---|
| `server/` | Nuxt server dir, always at root |
| `public/` | Static assets, always at root |
| `types/` | Referenced via `~~/` (rootDir alias) |
| `models/` | Custom business logic, not a Nuxt convention dir |
| `supabase/` | CLI tooling, not a Nuxt convention dir |
| `tests/` | Vitest, not a Nuxt convention dir |
| `nuxt.config.ts` | Always at root |

**Recommendation:** also move `constants/` and `stores/` into `app/` since they are tightly coupled to the Vue app. They are not Nuxt convention dirs but it keeps app-layer code together.

---

## Step 3 — Update `nuxt.config.ts` paths

After the move, `~/` resolves to `app/` and `~~/` still resolves to the project root.

### `imports.dirs`

```ts
// Before
imports: {
  dirs: ['constants', 'composables/**']
}

// After (if constants moved to app/constants/)
imports: {
  dirs: ['constants', 'composables/**']
}

// After (if constants stayed at root)
imports: {
  dirs: ['../constants', 'composables/**']
}
```

### `supabase.types`

No change needed — already uses `~~/types/database.types.ts` (rootDir alias).

---

## Step 4 — Remove `asyncContext` from experimental

`asyncContext` is stable in Nuxt 4 and no longer needs to be opted into:

```ts
// Remove this block entirely:
experimental: {
  asyncContext: true,
},
```

---

## Step 5 — Audit `useAsyncData` / `useFetch` dedupe behaviour

Nuxt 4 changes the default `dedupe` option from `'force'` to `'cancel'`. Any call relying on the old default will silently behave differently.

Search for usages:

```bash
grep -r "useAsyncData\|useFetch" app/composables/ app/pages/
```

If any call needs the old `'force'` behaviour, add it explicitly:

```ts
const { data } = await useAsyncData('key', fetcher, { dedupe: 'force' })
```

---

## Step 6 — Audit `~/` vs `~~/` path aliases

With `srcDir: 'app'`, bare `~/` imports pointing to root-level dirs will break.

Search for mismatched aliases:

```bash
grep -r "~/types\|~/models\|~/stores\|~/constants\|~/supabase" app/
```

Any hit that points to a directory that stayed at the root needs to change from `~/` to `~~/`:

```ts
// Wrong after migration (if types/ is at root)
import type { Foo } from '~/types/Foo'

// Correct
import type { Foo } from '~~/types/Foo'
```

---

## Step 7 — Upgrade the Nuxt package

Once the compat-mode build is clean with no errors:

```bash
npm install nuxt@^4.0.0
```

### Module compatibility checklist

| Module | Status |
|---|---|
| `@nuxtjs/supabase` | Check changelog for Nuxt 4 support before upgrading |
| `@pinia/nuxt` | v0.7+ supports Nuxt 4 ✓ |
| `@vee-validate/nuxt` | Verify Nuxt 4 compat before upgrading |
| `@nuxt/icon` | Maintained by Nuxt team, should be fine |
| `@vueuse/nuxt` | Maintained by VueUse team, check changelog |
| `nuxtjs-naive-ui` | Community-maintained — verify or switch to manual Naive UI setup |

---

## Step 8 — Regenerate types and verify

```bash
npx nuxt prepare    # regenerate auto-imports and type declarations
npm run dev         # verify the app boots cleanly
npm test            # run the full test suite
supabase gen types typescript --local > types/database.types.ts  # if schema touched
```

---

## Path alias reference (post-migration)

| Alias | Resolves to |
|---|---|
| `~/` | `app/` |
| `~~/` | project root |
| `@/` | `app/` (same as `~/`) |