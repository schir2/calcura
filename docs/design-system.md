# Design System

The single reference for color, radius, and elevation in this app. If you are styling anything, follow this. The rules here are enforced; deviations need a reason.

See [ADR 008](adr/008-design-tokens-tailwind-source-of-truth.md) for *why* the architecture is set up this way.

## TL;DR

- **One source of truth: CSS variables.** The palette lives as CSS custom properties in `app/assets/css/tailwind.css`. Everything — Tailwind utilities *and* NaiveUI — reads from those vars. Edit the var, the whole site moves.
- **Tailwind `skin` tokens** (`bg-skin-*`, `text-skin-*`, `border-skin-*`) are the public token API. Use them, not raw colors.
- **NaiveUI points at the same vars** via `themeConfig` overrides. NaiveUI is downstream, not the source — so it can be swapped out later without losing the system.
- **Components: always use NaiveUI components unless impossible.** Tailwind is for layout/spacing only.
- **No one-off colors** (`text-purple-500`) in app/dashboard components.

## Architecture: how a color flows

```
app/assets/css/tailwind.css
  --text-primary: 24, 160, 88;        <-- THE source of truth (R,G,B triplet)
        |
        +--> Tailwind skin token        text-skin-primary -> rgb(var(--text-primary))
        |        (via withOpacity() in tailwind.config.ts)
        |
        +--> NaiveUI theme override      common.primaryColor = 'rgb(var(--text-primary))'
                 (via naiveui.themeConfig in nuxt.config.ts)
```

One concrete value, referenced two ways. Change `--text-primary` and both a `text-skin-primary` element and an `n-button` primary update together.

### Light / dark

- Light vars are defined at `:root` (the default).
- Dark vars override under `html.dark`.
- The `dark` class is placed on `<html>` by a binding in `app/app.vue` driven by `useNaiveColorMode()`. (Do **not** use `[data-theme=...]` selectors — that was the old, broken mechanism that never matched the runtime class.)

### Value format

All color vars are stored as **`R, G, B` triplets** (e.g. `24, 160, 88`), not hex. This is required so the `withOpacity()` helper in `tailwind.config.ts` can produce `rgba(var(--x), <opacity>)` for Tailwind opacity modifiers (`bg-skin-primary/80`). NaiveUI overrides wrap them as `rgb(var(--x))`.

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
A native radius scale (seeded from NaiveUI's `borderRadius`). Use Tailwind's `rounded-*` utilities bound to the scale; do not hardcode `rounded-[7px]`.

### Elevation
Shadow/elevation tokens for raised surfaces. Use the elevation utilities; do not write one-off `shadow-[...]`.

> Spacing is **not** tokenized here — use Tailwind's built-in spacing scale (`gap-*`, `p-*`, `m-*`) for layout.

## CSS-var ↔ NaiveUI mapping

NaiveUI overrides (`nuxt.config.ts` → `naiveui.themeConfig.{light,dark}.common`) point at the same CSS vars. NaiveUI **auto-derives** hover/pressed/suppl shades via JS color math, which **cannot operate on an unresolved `var()`** — so every variant field must be mapped explicitly to its own var.

| NaiveUI key | CSS var |
| --- | --- |
| `primaryColor` | `rgb(var(--text-primary))` |
| `primaryColorHover` | `rgb(var(--text-primary-hover))` |
| `primaryColorPressed` | `rgb(var(--text-primary-active))` |
| `primaryColorSuppl` | `rgb(var(--text-primary-hover))` |
| `infoColor` / `Hover` / `Pressed` | `--text-info` / `--text-info-hover` / `--text-info-active` |
| `successColor` / `Hover` / `Pressed` | `--text-success` / `--text-success-hover` / `--text-success-active` |
| `warningColor` / `Hover` / `Pressed` | `--text-warning` / `--text-warning-hover` / `--text-warning-active` |
| `errorColor` / `Hover` / `Pressed` | `--text-error` / `--text-error-hover` / `--text-error-active` |
| `textColorBase` | `rgb(var(--text-base))` |
| `bodyColor` | `rgb(var(--bg-base))` |
| `cardColor` | `rgb(var(--bg-surface))` |
| `popoverColor` / `modalColor` | `rgb(var(--bg-overlay))` |
| `borderColor` / `dividerColor` | `rgba(var(--border-base))` |
| `borderRadius` | the radius token |

(Exact var ↔ key pairs are finalized during implementation; the rule is: every NaiveUI color field resolves to a skin var, variants included.)

## Rules

### Color
- **Use skin tokens for every color.** `bg-skin-*`, `text-skin-*`, `border-skin-*`, `ring-skin-*`, `fill-skin-*`.
- **Never use raw Tailwind color utilities** (`text-red-500`, `bg-gray-100`, `text-white`, `text-black`) in app/dashboard components. White/black included — use `text-skin-base` / `bg-skin-base`.
- **One-off colors** are allowed **only** inside clearly-namespaced landing-page components, and even there prefer brand tokens. They are never allowed in dashboard/app components.
- To change the palette, edit the CSS vars in `tailwind.css` — never patch colors at the component level.

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