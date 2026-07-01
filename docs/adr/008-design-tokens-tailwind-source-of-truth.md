# ADR 008: A shared palette module as the single source of truth for design tokens

**Status:** Accepted
**Date:** 2026-06-29

## Context

The app accumulated three disconnected color systems:

1. **`skin` tokens** — `bg-skin-*` / `text-skin-*` Tailwind utilities driven by RGB-triplet CSS vars. Used by ~33 components; the de-facto real system.
2. **shadcn/Inspira tokens** — `bg-primary`, `bg-card`, `--radius`, etc. from `@inspira-ui/plugins`, whose backing HSL vars were never defined and which no component used. Dead (removed in #60).
3. **NaiveUI's own theme** — `themeConfig: {}`, i.e. pure NaiveUI defaults.

Nothing linked them. The skin vars happened to mirror NaiveUI's default palette by hand-copied value, but a change in one would not propagate to the others.

Worse, the skin system was effectively dead in the live app: its vars were scoped under `[data-theme="light"]` / `[data-theme="dark"]` selectors, but the theme toggle (`NaiveConfig.vue`) applies a **`dark` class**, not a `data-theme` attribute. The selectors never matched, so `rgb(var(--bg-base))` resolved to an undefined var and was ignored — custom Tailwind markup fell back to browser defaults. A primary cause of visual inconsistency.

We need one palette, defined once, that drives both Tailwind and NaiveUI, with light/dark actually working.

## The constraint that shaped this

We initially tried to make the raw CSS vars the literal source and point NaiveUI at them with `var()` (`primaryColor: 'rgb(var(--text-primary))'`). **This is impossible:** NaiveUI runs theme colors through the `seemly` color-math library at runtime (rgba blends, derived hover/pressed shades, shadows) and throws `[seemly/rgba]: Invalid color value rgb(var(--bg-base))` on any `var()`. NaiveUI requires **literal** color values.

So a single value cannot be *both* a CSS `var()` (Tailwind) and a literal (NaiveUI). The source of truth therefore cannot be the CSS file itself — it must be something that can emit *both* forms.

## Decision

**A shared palette module — `app/theme/palette.ts` — is the single source of truth.** It defines the light and dark token values once (as `R, G, B[, A]` strings). Two consumers derive from it:

- **Tailwind / CSS:** `buildThemeCss()` emits the CSS custom properties for both modes (`:root` for light, `html.dark` for dark). They are injected SSR-side via `useHead` in `app.vue`, so they resolve on first paint with no flash. Tailwind `skin` tokens read them through `withOpacity()`.
- **NaiveUI:** `buildNaiveCommon()` emits a `themeConfig.light/dark.common` override with **literal** `rgb()/rgba()` colors (seemly-safe), wired in `nuxt.config.ts`. Light and dark are separate objects because the literals differ per mode.

Editing a value in `palette.ts` moves Tailwind and NaiveUI together.

Supporting decisions:

- **Seed from NaiveUI defaults.** Initial values taken from `lightTheme.common` / `darkTheme.common` so the migration renders identical, then the palette evolves.
- **Keep the existing `skin` token names** as the public Tailwind API to minimize churn across the ~33 consuming components.
- **Remove System B** (shadcn `colors`/`borderRadius` blocks + `@inspira-ui/plugins`) — one color system only.
- **Fix the theme mechanism:** the `dark` class goes on `<html>` (bound to `useNaiveColorMode()` in `app.vue`); CSS vars are `:root` (light) / `html.dark` (dark).

## Alternatives considered

- **Raw CSS file as the literal source, NaiveUI via `var()`.** Impossible — seemly rejects `var()` (see above).
- **NaiveUI as the source** (read `useThemeVars()` at runtime → write CSS vars). Rejected: vars populate only after hydration → flash of undefined colors; and it binds the whole system to NaiveUI, defeating swappability.
- **Mirror the palette in two places** (static CSS vars + separate NaiveUI literals). Rejected: drift — recoloring would require editing two files in sync.

The palette-module approach keeps a single edit point, SSR-rendered values, and NaiveUI independence.

## Consequences

**Positive:**
- One edit to `palette.ts` moves Tailwind *and* NaiveUI together.
- SSR-safe, no color flash.
- NaiveUI is swappable — the token system survives a UI-library change.
- Light/dark actually works.

**Negative / Trade-offs:**
- Colors live in a TS module, not a `.css` file — slightly less obvious to someone expecting plain CSS. Mitigated by docs and the comment left in `tailwind.css`.
- The NaiveUI override list is explicit, hand-maintained enumeration of the `common` keys we care about (including variants), since NaiveUI can't derive them from `var()`.
- NaiveUI component-internal peer theming (some shadows/opacities) still derives from its light base theme; only the `common` palette is overridden. Acceptable for the visible palette.

## Guidance

- Add or change colors only in `app/theme/palette.ts`.
- Never hardcode a color in a component, in `tailwind.css`, or in a `themeConfig` literal — change the palette.
- See [docs/design-system.md](../design-system.md) for the token catalog, the palette → consumer mapping, and the component/layout rules.
