# ADR 008: CSS variables (Tailwind) as the single source of truth for design tokens

**Status:** Accepted  
**Date:** 2026-06-28

## Context

The app accumulated three disconnected color systems:

1. **`skin` tokens** — `bg-skin-*` / `text-skin-*` Tailwind utilities driven by RGB-triplet CSS vars in `app/assets/css/tailwind.css`. Used by ~33 components; the de-facto real system.
2. **shadcn/Inspira tokens** — `bg-primary`, `bg-card`, `--radius`, etc. from `@inspira-ui/plugins`, whose backing HSL vars were never defined and which no component used. Dead.
3. **NaiveUI's own theme** — `themeConfig: {}`, i.e. pure NaiveUI defaults.

Nothing linked them. The skin vars happened to mirror NaiveUI's default palette by hand-copied value, but a change in one would not propagate to the others.

Worse, the skin system was effectively dead in the live app: its vars were scoped under `[data-theme="light"]` / `[data-theme="dark"]` selectors, but the theme toggle (`NaiveConfig.vue`) applies a **`dark` class**, not a `data-theme` attribute. The selectors never matched, so `rgb(var(--bg-base))` resolved to an undefined var and was ignored — custom Tailwind markup fell back to browser defaults. This was a primary cause of visual inconsistency.

We need one palette, defined once, that drives both Tailwind and NaiveUI, with light/dark actually working.

## Decision

**CSS variables are the single source of truth.** The palette is defined once as CSS custom properties in `tailwind.css`. Both consumers read from them:

- **Tailwind** `skin` tokens reference the vars via `withOpacity()` (`rgb(var(--…))` / `rgba(var(--…), <opacity>)`).
- **NaiveUI** is pointed *at* the same vars through `naiveui.themeConfig` overrides (`common.primaryColor = 'rgb(var(--text-primary))'`, etc.).

The flow is **CSS vars → NaiveUI**, deliberately *not* NaiveUI → CSS vars.

Supporting decisions:

- **Seed from NaiveUI defaults.** The initial var values are taken from `lightTheme.common` / `darkTheme.common` so the migration renders identical, then the palette evolves from there.
- **Keep the existing `skin` token names** as the public API to minimize churn across the ~33 consuming components.
- **Remove System B** (shadcn `colors`/`borderRadius` blocks + `@inspira-ui/plugins`) — one color system only.
- **Fix the theme mechanism:** place the `dark` class on `<html>` (bound to `useNaiveColorMode()`), define light vars at `:root` and dark under `html.dark`.

## Alternatives considered

**NaiveUI as the source of truth** (read NaiveUI's computed theme via `useThemeVars()` at runtime and write it into the CSS vars Tailwind consumes). Rejected because:

- It populates the vars only *after* hydration → custom Tailwind markup flashes undefined colors on first paint (no SSR value).
- It binds the entire design system to NaiveUI; ripping NaiveUI out later would take the token system with it.

The CSS-vars-first approach keeps values SSR-rendered, version-controlled in one file, and NaiveUI-independent.

## Consequences

**Positive:**
- One edit to `tailwind.css` moves Tailwind *and* NaiveUI together.
- SSR-safe, no color flash.
- NaiveUI is swappable — the token system survives a UI-library change.
- Light/dark actually works.

**Negative / Trade-offs:**
- NaiveUI auto-derives hover/pressed/suppl shades via JS color math, which **cannot operate on an unresolved `var()`**. Every variant field must be mapped explicitly to its own CSS var, rather than relying on NaiveUI's derivation. This is bounded enumeration work and the reason `--…-hover` / `--…-active` vars exist.
- Contributors must know that colors live in `tailwind.css`, not in component styles or `themeConfig` literals.

## Guidance

- Add or change colors only in `app/assets/css/tailwind.css`.
- Never hardcode a color in a component or in a NaiveUI override literal — always reference a skin var.
- See [docs/design-system.md](../design-system.md) for the token catalog, the var ↔ NaiveUI mapping, and the component/layout rules.