# Design System

The single reference for color, radius, and elevation in this app. If you are styling anything, follow this. The rules here are enforced; deviations need a reason.

See [ADR 008](adr/008-design-tokens-tailwind-source-of-truth.md) for *why* the architecture is set up this way.

## TL;DR

- **One source of truth: `app/theme/palette.ts`.** The light + dark palette is defined there once. From it, the CSS vars *and* the NaiveUI theme are generated. Edit a value there, the whole site moves.
- **Tailwind `skin` tokens** (`bg-skin-*`, `text-skin-*`, `border-skin-*`) are the public token API. Use them, not raw colors.
- **NaiveUI gets literal values** generated from the same palette (it can't read CSS `var()` — see below). It's downstream, not the source — so it can be swapped out later without losing the system.
- **Components: always use NaiveUI components unless impossible.** Tailwind is for layout/spacing only.
- **No one-off colors** (`text-purple-500`) in app/dashboard components.

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

To extend NaiveUI coverage, add the key to `buildNaiveCommon()` pointing at a palette token.

## Rules

### Color
- **Use skin tokens for every color.** `bg-skin-*`, `text-skin-*`, `border-skin-*`, `ring-skin-*`, `fill-skin-*`.
- **Never use raw Tailwind color utilities** (`text-red-500`, `bg-gray-100`, `text-white`, `text-black`) in app/dashboard components. White/black included — use `text-skin-base` / `bg-skin-base`.
- **One-off colors** are allowed **only** inside clearly-namespaced landing-page components, and even there prefer brand tokens. They are never allowed in dashboard/app components.
- To change the palette, edit `app/theme/palette.ts` — never patch colors at the component level, in `tailwind.css`, or in `themeConfig`.

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