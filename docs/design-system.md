# Design System

The single reference for color, typography, radius, and elevation in this app. If you are styling anything, follow this. The rules here are enforced; deviations need a reason.

See [ADR 008](adr/008-design-tokens-tailwind-source-of-truth.md) for *why* the architecture is set up this way, and [ADR 013](adr/013-typography-design-tokens.md) for how typography joins it.

## TL;DR

- **One source of truth: `app/theme/palette.ts`.** The light + dark palette, the radius/elevation scales, and the type scale are defined there once. From them, the CSS vars *and* the NaiveUI theme are generated. Edit a value there, the whole site moves.
- **Tailwind `skin` tokens** (`bg-skin-*`, `text-skin-*`, `border-skin-*`) are the public token API **for color**. Use them, not raw colors.
- **Type has its own role tokens** (`text-title`, `text-body`, `text-metric`, …) — `skin` is colour-only, so `text-skin-muted` is a *color*, never a size.
- **NaiveUI gets literal values** generated from the same palette (it can't read CSS `var()` — see below). It's downstream, not the source — so it can be swapped out later without losing the system.
- **Components: always use NaiveUI components unless impossible.** Tailwind is for layout/spacing only.
- **No one-off colors** (`text-purple-500`) and **no hand-rolled type** (`text-2xl`, `font-semibold`) in app/dashboard components.

## Architecture: how a color flows

```
app/theme/palette.ts
  lightColorTokens['text-primary'] = '24, 160, 88'   <-- THE source of truth
  darkColorTokens['text-primary']  = '99, 226, 183'
        |
        +-- buildThemeCss()  -> SSR <style> injected in app.vue
        |       :root{--text-primary:24,160,88} html.dark{--text-primary:99,226,183}
        |       -> Tailwind skin token  text-skin-primary -> rgb(var(--text-primary))
        |                                (via withOpacity() in tailwind.config.ts)
        |
        +-- buildNaiveCommon() -> naiveui.themeConfig.{light,dark}.common in nuxt.config.ts
                common.primaryColor = 'rgb(24, 160, 88)'   (LITERAL, per mode)
```

One palette, two generated forms. Change `text-primary` in `palette.ts` and both a `text-skin-primary` element and an `n-button` primary update together.

### Why NaiveUI gets literals, not `var()`

NaiveUI runs theme colors through the `seemly` color-math library at runtime (rgba blends, derived hover/pressed shades). It **cannot parse `var()`** — passing `rgb(var(--x))` throws `[seemly/rgba]: Invalid color value`. So NaiveUI must receive resolved literal colors. That's why the source can't be the raw CSS file, and why light/dark are separate literal objects for NaiveUI. See [ADR 008](adr/008-design-tokens-tailwind-source-of-truth.md).

### Light / dark

- `buildThemeCss()` emits light vars at `:root` (default) and dark vars under `html.dark`.
- The `dark` class is placed on `<html>` by a binding in `app/app.vue` driven by `useNaiveColorMode()`. (Do **not** use `[data-theme=...]` selectors — that was the old, broken mechanism that never matched the runtime class.)
- The NaiveUI module picks `themeConfig.light` vs `themeConfig.dark` from the same color mode.

### Value format

Palette values are stored as **`R, G, B` (or `R, G, B, A`) strings** (e.g. `24, 160, 88`), not hex. The CSS-var form feeds the `withOpacity()` helper so Tailwind opacity modifiers work (`bg-skin-primary/80`). The NaiveUI form wraps the same value as a literal `rgb(...)` / `rgba(...)`.

## Token catalog

Semantic role names. Use the role, not a raw color — `bg-skin-error`, never `bg-red-500`.

### Surfaces (`bg-skin-*`)
`base` · `surface` · `surface-hover` · `muted` · `overlay` · `primary` · `secondary` · `tertiary` · `accent` · `error` · `success` · `warning` · `info`

### Text (`text-skin-*`)
`base` · `muted` · `primary` · `secondary` · `tertiary` · `accent` · `error` · `success` · `warning` · `info` · `link` · `link-hover` · `link-active`

### Borders / rings (`border-skin-*`, `ring-skin-*`)
`base` · `muted` · `primary` · `secondary` · `tertiary` · `accent` · `error` · `success` · `warning` · `info`

### Icons (`fill-skin-*`)
`base` · `muted` · `primary` · `secondary` · `tertiary` · `accent` · `error` · `success` · `warning` · `info`

### Radius
A native radius scale defined in `app/theme/palette.ts` (`radiusTokens`, seeded from NaiveUI's `borderRadius` `3px` / `borderRadiusSmall` `2px`), emitted as CSS vars (`--radius-sm` · `--radius` · `--radius-lg` · `--radius-xl` · `--radius-2xl` · `--radius-3xl`) and bound to Tailwind's `rounded-*` utilities. Use `rounded` · `rounded-sm` · `rounded-md` · `rounded-lg` · `rounded-xl` · `rounded-2xl` · `rounded-3xl` (`rounded-none` / `rounded-full` unchanged); do not hardcode `rounded-[7px]`. NaiveUI's own rounding is set from the same scale via `common.borderRadius` for parity.

### Elevation
Shadow/elevation tokens for raised surfaces, defined in `app/theme/palette.ts` (`elevationTokens`, seeded from NaiveUI's `boxShadow1/2/3`) and emitted as CSS vars (`--elevation-1` · `--elevation-2` · `--elevation-3`). Use `shadow-elevation-1` · `shadow-elevation-2` · `shadow-elevation-3` (or the semantic aliases `shadow` · `shadow-md` · `shadow-lg`); do not write one-off `shadow-[...]`.

### Typography

A scale of **seven semantic roles**, defined in `app/theme/palette.ts` (`typeTokens`), emitted as CSS vars and bound to Tailwind utilities. Named for *meaning*, not size — same convention as the color roles. See [ADR 013](adr/013-typography-design-tokens.md).

| Role | Size | Weight | Tracking | Used for |
|---|---|---|---|---|
| `display` | 36px | 700 | −0.02em | Page titles, verdict hero |
| `title` | 24px | 600 | −0.01em | Dialog and card titles |
| `heading` | 18px | 600 | — | Section headers |
| `body` | 16px | 400 | — | Default copy |
| `metric` | 30px | 600 | −0.01em, tabular | Projection headline values |
| `caption` | 12px | 400 | — | Helper text, empty states |
| `eyebrow` | 11px | 600 | 0.08em, uppercase | Overlines |

`metric` carries `tabular-nums` **in the token** — money must not jitter as values change, so this is never a per-call-site decision.

**Base size is 16px**, and NaiveUI is moved up to match via `common.fontSize` (its default is 14px). The font family is the **system stack, declared explicitly** in `buildNaiveCommon()` — no webfont is loaded; the stack is merely *named* so NaiveUI and Tailwind stop resolving to different ones.

> Spacing is **not** tokenized here — use Tailwind's built-in spacing scale (`gap-*`, `p-*`, `m-*`) for layout.

## Palette token → NaiveUI key mapping

`buildNaiveCommon()` in `app/theme/palette.ts` maps palette tokens to NaiveUI `common` keys as **literal** colors. Variant fields (hover/pressed/suppl) are set explicitly — NaiveUI can't derive them from a `var()`, and we don't rely on its color math.

| NaiveUI key | palette token |
| --- | --- |
| `primaryColor` | `text-primary` |
| `primaryColorHover` / `primaryColorSuppl` | `text-primary-hover` |
| `primaryColorPressed` | `text-primary-active` |
| `infoColor` / `Hover` / `Pressed` | `text-info` / `text-info-hover` / `text-info-active` |
| `successColor` / `Hover` / `Pressed` | `text-success` / `text-success-hover` / `text-success-active` |
| `warningColor` / `Hover` / `Pressed` | `text-warning` / `text-warning-hover` / `text-warning-active` |
| `errorColor` / `Hover` / `Pressed` | `text-error` / `text-error-hover` / `text-error-active` |
| `textColorBase` / `textColor1` | `text-base` |
| `textColor2` / `textColor3` | `text-secondary` / `text-muted` |
| `bodyColor` | `bg-base` |
| `cardColor` / `modalColor` / `popoverColor` / `tableColor` | `bg-surface` |
| `borderColor` / `dividerColor` | `border-base` / `border-muted` |
| `borderRadius` / `borderRadiusSmall` | `radius` / `radius-sm` (from `radiusTokens`) |
| `fontSize` | `body` size (from `typeTokens`) — moves NaiveUI off its 14px default |
| `fontFamily` | the declared system stack (from `typeTokens`) |

To extend NaiveUI coverage, add the key to `buildNaiveCommon()` pointing at a palette token.

## Rules

### Color
- **Use skin tokens for every color.** `bg-skin-*`, `text-skin-*`, `border-skin-*`, `ring-skin-*`, `fill-skin-*`.
- **Never use raw Tailwind color utilities** (`text-red-500`, `bg-gray-100`, `text-white`, `text-black`) in app/dashboard components. White/black included — use `text-skin-base` / `bg-skin-base`.
- **One-off colors** are allowed **only** inside clearly-namespaced landing-page components, and even there prefer brand tokens. They are never allowed in dashboard/app components.
- To change the palette, edit `app/theme/palette.ts` — never patch colors at the component level, in `tailwind.css`, or in `themeConfig`.

### Typography
- **Use a role token for every piece of text.** Never hand-roll a size or weight utility (`text-2xl`, `text-lg`, `font-semibold`, `font-bold`) in app/dashboard components — pick the role that matches the job.
- **Never use an arbitrary size** (`text-[11px]`). If no role fits, the scale is wrong — fix the scale, not the call site.
- **Every heading needs an explicit weight.** Tailwind's Preflight resets `h1`–`h6` to `font-weight: inherit`, so a heading with only a size class renders at **400**. A size class alone is not a heading.
- **Heading levels are semantic, not visual.** Pick `h1`–`h6` for document structure and the role token for appearance. Do not reach for `<h3>` because it "looks right".
- **All figures use `tabular-nums`** — carried by the `metric` role. Money that shifts as it updates is a bug.
- To change the scale, edit `app/theme/palette.ts`.

> **Watch out:** Tailwind emits **nothing** for a class it doesn't recognize, and reports no error. `text-s` and `text-md` are not real Tailwind keys — they shipped dead in `base/Stat.vue` for a long time, silently. When you add a type utility, confirm it actually emits CSS.

### Components
- **Always use a NaiveUI component when one exists** — `n-button`, `n-card`, `n-input`, `n-select`, `n-table`, `n-tabs`, `n-tag`, `n-modal`, etc. They inherit the theme automatically. Do not hand-roll a `<button>`/`<div>` that duplicates a NaiveUI component.
- Dialogs, messages, notifications, loading bars → NaiveUI composables (`useDialog`, `useMessage`, …).
- `common/*` wrapper components must wrap NaiveUI internally (not raw HTML) and expose a stable prop API.

### Layout
- **Tailwind does layout/positioning only:** `flex`, `grid`, `gap-*`, `p-*`, `m-*`, sizing.
- Tailwind flex/grid is the **default** for arranging components. Reach for NaiveUI layout components (`n-grid`, `n-list`, `n-space`) only when you specifically need their features (e.g. `n-grid`'s responsive `cols`); otherwise prefer Tailwind.
- The page shell (`<body>`, `<main>`, top-level sections) uses skin surface tokens via Tailwind.

## Do / Don't

```vue
<!-- DON'T: raw color, hand-rolled control -->
<button class="bg-blue-600 text-white rounded-full px-4 py-2">Save</button>
<div class="bg-white text-black border border-gray-200 p-4">...</div>

<!-- DO: NaiveUI control (themed), skin tokens for the surface -->
<n-button type="primary">Save</n-button>
<n-card class="p-4">...</n-card>

<!-- DO: Tailwind for layout, skin tokens for a bespoke surface -->
<section class="flex flex-col gap-4 bg-skin-surface text-skin-base p-6 rounded-lg">
  ...
</section>
```

```vue
<!-- DON'T: hand-rolled type. Which of the eight card-title variants is this? -->
<h3 class="text-2xl">Edit Plan</h3>              <!-- no weight -> renders at 400, not bold -->
<div class="text-[11px] uppercase tracking-wide">Projection</div>  <!-- off-scale -->
<div class="text-2xl font-bold">{{ money(total) }}</div>           <!-- no tabular-nums -->

<!-- DO: role tokens. Semantic tag, semantic size, weight and figures come with it. -->
<h2 class="text-title">Edit Plan</h2>
<div class="text-eyebrow text-skin-muted">Projection</div>
<div class="text-metric">{{ money(total) }}</div>
```