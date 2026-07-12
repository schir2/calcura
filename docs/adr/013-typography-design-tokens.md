# ADR 013: Typography design tokens in `palette.ts`

**Status:** Accepted
**Date:** 2026-07-11

Extends [ADR 008](008-design-tokens-tailwind-source-of-truth.md) beyond color.

## Context

Color, radius, and elevation are tokenized in `app/theme/palette.ts`, documented in `docs/design-system.md`, and enforced. **Typography is not.** An audit of all 152 `.vue` files (`docs/design/typography-audit.md`) found:

- `tailwind.config.ts` extends twelve theme keys — `screens`, `borderRadius`, `textColor`, and nine more — but has **no `fontSize`, `fontWeight`, or `fontFamily`**. `palette.ts` has zero font references.
- The `skin` tokens are **color-only**. `text-skin-muted` is a color, not a size. There is no type equivalent, so a component that *wants* to be consistent has nothing to reach for.
- Result: **~517 typography utilities hand-rolled at call sites**, governed by nothing. The card title alone has eight distinct treatments; money has six; the same overline label renders at `text-[10px]` in one file and `text-[11px]` in another.

Two structural bugs follow from the absence:

**1. Preflight silently strips every heading.** Tailwind's Preflight resets `h1`–`h6` to `font-weight: inherit`. Nothing compensates. So a heading carrying only a size class renders at **weight 400** — and every page title in the app (Dashboard, Plans, Plan Detail, Auth) does exactly that. They are not bold. Meanwhile the 404 heading is 700 and the landing hero is 600. Same tag, three weights, none deliberate.

**2. Two base font sizes.** NaiveUI's un-overridden `common.fontSize` is **14px**; Tailwind's `text-base` is **16px**. `buildNaiveCommon()` sets colors and radius only. So text inside an `n-card` and text in a sibling `<p>` are different sizes by default, and NaiveUI's font stack (leading with `v-sans`, which has no `@font-face` and never resolves) differs from Tailwind Preflight's (`ui-sans-serif`). Nothing reconciles either axis.

There is a precedent for exactly this failure mode. ADR 008 records that the `skin` color system was once *"effectively dead in the live app"* — its selectors never matched, so the vars resolved to nothing and were silently ignored, which ADR 008 calls *"a primary cause of visual inconsistency."* Typography is in that state now: `base/Stat.vue` ships `text-s` and `text-md`, **neither of which is a real Tailwind key**, and they have emitted no CSS in production the whole time with no error. Tailwind does not complain about class names it doesn't recognize.

## Decision

**Typography joins `palette.ts` as a token group, following the radius/elevation precedent exactly.**

Add `typeTokens` alongside `radiusTokens` and `elevationTokens`. Both existing consumers derive from it:

- **Tailwind / CSS:** `buildThemeCss()` emits the CSS custom properties; `tailwind.config.ts` binds them to `fontSize` / `fontWeight` utilities.
- **NaiveUI:** `buildNaiveCommon()` receives the **literal** values (`fontSize: typeTokens['fs-body']`), exactly as it already receives `borderRadius: radiusTokens['radius']`.

Like radius and elevation — and unlike color — **type needs no light/dark split.** It is not run through `seemly`'s color math, so a single scale emitted into `:root` suffices. (The `var()` prohibition in ADR 008 is a *color* constraint; `seemly` is a color library. Type could arguably use `var()` in NaiveUI, but we pass literals anyway for consistency with the radius precedent and to avoid relying on untested behavior.)

### The scale — seven semantic roles

Named for **meaning, not size**, matching the existing "semantic role" convention.

| Role | Size | Weight | Tracking | Used for |
|---|---|---|---|---|
| `display` | 36px | 700 | −0.02em | Page titles, verdict hero |
| `title` | 24px | 600 | −0.01em | Dialog and card titles |
| `heading` | 18px | 600 | — | Section headers |
| `body` | **16px** | 400 | — | Default copy |
| `metric` | 30px | 600 | −0.01em, tabular | Projection headline values |
| `caption` | 12px | 400 | — | Helper text, empty states |
| `eyebrow` | 11px | 600 | 0.08em, uppercase | Overlines |

Seven roles cover every use found in the audit. `eyebrow` replaces **both** off-scale sizes (`text-[10px]`, `text-[11px]`) — same role, so one token.

`metric` carries `tabular-nums` **in the token**, not at the call site. Money is the most important text in a retirement planner; figures must not jitter as values change. Today the plan-summary totals lack it while everything else has it — precisely the kind of miss a token prevents.

### Base size: 16px, overriding NaiveUI up

**`body` = 16px**, and `buildNaiveCommon()` is extended to emit `fontSize: '16px'`, moving NaiveUI up from its 14px default.

This is the **highest-risk change in the effort** — it resizes every `n-*` component: the Report data table, all nine Workspace forms, every button, input, select, tag, and modal. It ships as its own PR and reverts as its own PR. The tightest constraint is the Workspace drawer's ~360px form column — ADR 011 exists *because* that width already broke the old side-by-side strategy cards.

The alternative (move Tailwind down to 14px, leaving NaiveUI untouched) was lower-risk but was rejected: 16px is the more readable target, and the reconciliation has to happen once either way.

### Font family: declared, not loaded

`buildNaiveCommon()` also emits `fontFamily` — **the system stack, named explicitly.** No webfont, no `@nuxt/fonts`, no dependency, no payload, no FOUT. This does not *change* what the app renders in; it *declares* it, so NaiveUI and Tailwind finally resolve to the same stack instead of two.

Loading a real typeface remains open. Doing it later is now a one-line change to a token, not a re-architecture — which is the point of putting type in the palette.

## Alternatives considered

- **A `fontSize` extension in `tailwind.config.ts`, leaving NaiveUI alone.** Simpler and more conventional. **Rejected:** it re-creates the exact split ADR 008 was written to kill — two type systems with nothing linking them, free to drift. The app would still have two base sizes.
- **Name them `skin` tokens** (`text-skin-title`). **Rejected:** `skin` is defined in `CONTEXT.md` as the *color* API, and `text-skin-*` is already taken as a color utility. `text-skin-title` would be ambiguous at best and a collision at worst.
- **Keep 14px** and move Tailwind down to NaiveUI. Lower-risk, and it matches the density most of the UI already renders at. Rejected in favor of readability; recorded here because it is the obvious fallback if 16px proves untenable at the drawer width.

## Consequences

**Positive:**
- One edit to `palette.ts` moves Tailwind *and* NaiveUI together — the same guarantee color already has.
- NaiveUI and Tailwind agree on a base size and a font stack for the first time.
- The seven roles give components something to reach for, so "what size should this be" stops being a per-call-site judgment.
- Loading a real typeface later is a token change, not a migration.

**Negative / Trade-offs:**
- **The 16px override is a visible, app-wide resize.** The app will look different. Layouts that were tuned against 14px NaiveUI text may need adjusting — especially in the ~360px Workspace drawer column.
- Type lives in a TS module, not a `.css` file — the same trade-off ADR 008 accepted for color.
- The NaiveUI override list stays a hand-maintained enumeration. Adding `fontSize`/`fontFamily` extends it by two more keys.

## Guidance

- Add or change type only in `app/theme/palette.ts`. Never hand-roll a `text-*` size or `font-*` weight utility in an app component — use the role token.
- **Every heading needs an explicit weight.** Preflight strips the default; a size class alone renders at 400.
- **Verify a new type utility actually emits CSS.** Tailwind silently emits nothing for an unknown key — that is how `text-s` and `text-md` survived in `base/Stat.vue` unnoticed. Do not assume it works because the build passed.
- See [docs/design-system.md](../design-system.md) for the token catalog and the full rule set.
