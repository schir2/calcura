# Typography Audit

**Status:** analysis — no code changed yet
**Branch audited:** `feature/merging-simulations` @ `5779c08`
**Scope:** all 152 `.vue` files under `app/`; 88 of them carry at least one typography utility

Companion to [`design-system.md`](../design-system.md), which today covers **color, radius, and elevation only**.

---

## TL;DR

Typography is the one axis of the design system that was never built. Color is tokenized in `app/theme/palette.ts`, documented, and enforced by [ADR 008](../adr/008-design-tokens-tailwind-source-of-truth.md). Type has **no tokens, no documentation, and no loaded font** — so all **516 typography utilities** are hand-rolled at the call site, governed by nothing.

Three structural causes, four live bugs, and ~12 roles with more than one treatment. Details below.

---

## Root causes

### 1. No type scale exists

`tailwind.config.ts` extends twelve theme keys (`screens`, `borderRadius`, `textColor`, `boxShadow`, …) but has **no `fontSize`, `fontWeight`, or `fontFamily`**. `app/theme/palette.ts` contains zero font references — its own header comment scopes it to *"the color palette."*

The `skin` tokens are **color-only**. `text-skin-muted` is a color, not a size. There is no type equivalent of `bg-skin-*`, so there is nothing for a component to reach for even if it wanted to be consistent.

### 2. Preflight strips every heading

Preflight is enabled (`@tailwind base` in `app/assets/css/tailwind.css`, no `corePlugins` override) and resets:

```css
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
```

So a heading looks like a heading **only** if its utility classes say so — and most don't. Nothing in the codebase compensates. This is why `<h1 class="text-4xl">` renders at **weight 400**, not bold.

### 3. Two base font sizes

NaiveUI's un-overridden `common.fontSize` is **14px**. Tailwind's `text-base` is **16px**. `buildNaiveCommon()` in `palette.ts` sets colors and `borderRadius` only — it never touches `fontSize`, `fontFamily`, or `fontWeightStrong`.

Result: text inside an `n-card` and text in a sibling `<p>` are different sizes by default, and the two font stacks differ too (NaiveUI leads with `v-sans`, Tailwind Preflight with `ui-sans-serif`).

### 4. No font is loaded at all

No `@nuxt/fonts`, no Google Fonts link, no `@font-face`, no `fontFamily` override, no font files in `app/assets/`. The app renders in whatever the OS supplies, through two different stacks depending on whether the text sits inside a NaiveUI component.

---

## Live defects

These are bugs, not preferences. Fix independently of any scale work.

### D1 — Two of the three `Stat` label sizes emit no CSS — **FIXED**

**`app/components/base/Stat.vue:36,39`** — resolved: `text-s`→`text-sm`, `text-md`→`text-base`, `font-light` dropped from the value, `tabular-nums` added. Retained below as the record of what was wrong.

`text-s` and `text-md` **are not Tailwind classes.** The valid `fontSize` keys are `xs, sm, base, lg, xl, 2xl…9xl` — there is no `s` and no `md`, and no `fontSize` extension defines them. Tailwind never errors on an unknown class: it emits no rule, the class lands in the DOM, and it does nothing.

| `size` | label class | valid? | label renders at |
|---|---|---|---|
| `small` | `text-xs` | yes | 12px |
| `medium` *(default)* | `text-s` | **no** | inherited — 16px, or 14px inside `n-card` |
| `large` | `text-md` | **no** | inherited — identical to `medium` |

The value map (`text-xl` / `text-2xl` / `text-3xl`) is fine. Only the label half is broken — **and it's broken on the default**.

Effect: the label scale is inverted. A `medium` label (16px inherited) renders *larger* than a `small` one (12px explicit), and `large` is indistinguishable from `medium`. Intent was almost certainly `text-sm` and `text-base`.

Call sites that hit the broken default (no `size` prop):

- `plan/chart/ExpensesOverTime.vue:9,11,12`
- `plan/chart/ExpensesOverTimeInverted.vue:9,10,11`
- `income/CreateForm.vue:109` · `income/UpdateForm.vue:123`
- `expense/CreateForm.vue:107` · `expense/UpdateForm.vue:121` · `expense/List.vue:8`

Only `plan/chart/GrossSavings.vue` passes `size="small"` (6 stats) — those work. `size="large"` is never used anywhere, so that branch has never rendered.

**Same file, second issue:** line 73 hardcodes `font-light` (300) on *every* stat value — the only `font-light` in the app outside the landing hero. Money figures render thinner than surrounding text and carry no `tabular-nums`.

### D2 — Every page title renders at weight 400

`<h1 class="text-4xl">` with **no weight class**, so Preflight's `font-weight: inherit` wins:

- `pages/dashboard.vue:13`
- `pages/plans/index.vue:39`
- `pages/plans/[id].vue:265`
- `layouts/auth.vue:10`
- `pages/prototype/workspace-sim.vue:172`

Meanwhile `pages/[...catchall].vue:13` is `font-bold` (700) and `landing/LandingHero.vue:9` is `font-semibold` (600). **Same tag, three weights.**

### D3 — The IRA forms are titled "Roth IRA"

`ira/CreateForm.vue:29` and `ira/UpdateForm.vue:43` both render `Roth IRA : {{ model.name }}`. Copy-paste bug carried by the shared `text-2xl` heading. Not typography, but it surfaced during the sweep.

### D4 — The footer is a bare, unstyled `<h1>`

`layout/TheFooter.vue:6` — `<h1>Footer</h1>`, no classes. Preflight strips it, so it renders as plain body text. It is also a **second `<h1>`** on every page that already has one, which is an accessibility problem independent of appearance.

---

## Inventory — every role and its variants

Grouped by the job the text does on screen. Wherever a role has more than one row, it is drifting.

| Role | Variant in use | Renders | Sites | Where |
|---|---|---|---|---|
| **Page title** | `h1.text-4xl` | 36px / **400** | 5 | dashboard · plans/index · plans/[id] · layouts/auth · workspace-sim |
| | `h1.text-4xl.font-bold` | 36px / 700 | 1 | pages/[...catchall] |
| | `h1.text-4xl md:text-6xl.font-semibold` | 36→60px / 600 | 1 | landing/LandingHero |
| **Page subtitle** | `p.text-lg.text-skin-muted` | 18px / 400 | 4 | dashboard · plans/index · plans/[id] · workspace-sim — **consistent** |
| **Section header** | `h2.text-lg.font-semibold.tracking-tight` | 18px / 600 | 1 | plan/overview/SectionHead — *the intended primitive* |
| | `h2.text-3xl` | 30px / **400** | 2 | plan/summary/index · plan/projection/index — legacy |
| **Card title** *(8 variants)* | `h3.text-2xl` *(no weight)* | 24px / **400** | 22 | 16× domain Create/UpdateForm · plan/CreateForm · plan/UpdateForm · summary/CashReserve · summary/Debt |
| | `span.text-2xl` | 24px / 400 | 3 | plan/DetailCard · summary/Income · summary/Expense |
| | `h3.text-xl` | 20px / 400 | 1 | dashboard/ToolCard |
| | `p.text-xl.text-center` | 20px / 400 | 5 | plan/chart/GrossSavings · Growth · TaxDeferredGrowth · TaxExemptGrowth · ExpensesOverTime |
| | `h3.text-lg.font-semibold` | 18px / 600 | 1 | plan/Card |
| | `h3.text-base.font-semibold` | 16px / 600 | 1 | plan/overview/Overview |
| | `n-card title="…"` | **NaiveUI default** | 14 | 7× domain List.vue · 7× plan/overview/Overview |
| | bare `span` / text in `#header` | no classes | 5 | Overview ×2 · DetailCard ×3 |
| **Explainer sub-header** | `h4.text-lg.font-semibold.text-skin-{success,error,warning}` | 18px / 600 | 18 | ira · rothIra · taxDeferred — "Pros / Cons / Things to Note" |
| | `h3.text-lg.font-semibold` *(± `mt-3`)* | 18px / 600 | 52 | ira · rothIra · taxDeferred — "What it means / How it's calculated" |
| **Form section header** | `div.text-sm.font-medium.mb-2` | 14px / 500 | 10 | 8× domain WorkspaceForm · hsa/CreateForm |
| | *vs the `text-lg`/600 rows above, same job* | 18px / 600 | — | ira · rothIra · taxDeferred modal forms — **two scales** |
| **Entity list-item title** | `span.font-medium.truncate` *(no size)* | 14px / 500 *(inherited)* | 9 | all 9 domain ListItem.vue — size from `CommonRichListItem`'s `text-sm` — **uniform** |
| **Metric / KPI value** *(6 variants)* | `text-3xl.font-semibold.tabular-nums.leading-tight` | 30px / 600 | 5 | common/EntityProjection · 4× domain WorkspaceProjection |
| | `text-2xl.font-bold.tabular-nums` | 24px / 700 | 1 | plan/overview/VerdictHero |
| | `text-lg.font-bold.tabular-nums` | 18px / 700 | 3 | plan/overview/Overview — Principal / Interest / Paid off |
| | `tabular-nums.font-semibold` *(no size)* | 14px / 600 *(inherited)* | 9 | all 9 domain ListItem.vue `#headline` — **uniform** |
| | `text-end.text-lg` / `text-end.text-2xl` | 18/24px · **400** · **no `tabular-nums`** | 4 | plan/summary/Income · plan/summary/Expense — *digits jitter* |
| | `span.font-light` + `text-xl/2xl/3xl` | 20–30px / **300** | 1 | base/Stat — see **D1** |
| **Eyebrow / overline** | `text-[10px].uppercase.tracking-wide.text-skin-muted` | 10px / 400 | 36 | all 9 domain ListItem.vue — "Projection" / "Configuration" |
| | `text-[11px].uppercase.tracking-wide.text-skin-muted` | 11px / 400 | 9 | common/EntityProjection · VerdictHero · 4× WorkspaceProjection |
| **Caption / helper** | `text-xs.text-skin-muted` | 12px / 400 | ~20 | de-facto standard — EntityProjection, StrategyRows, SectionHead, … |
| | `text-xs.text-skin-info` | 12px / 400 | 3 | popconfirm fine print — plan/Card · plan/DetailCard · command/Tabber |
| | `text-sm.text-skin-muted` | 14px / 400 | ~8 | EntityWorkspace · TheNavbar · plan/Card *(+`leading-relaxed`, used once)* |
| | *no size class* | 16px *(or 14px in NaiveUI)* | 4 | dashboard/ToolCard · plans/index empty state · LandingPage · popconfirm bodies |
| **Popconfirm title** | `h2.text-xl.my-3.text-skin-error.font-semibold` | 20px / 600 | 3 | ListItemButtons:24 · command/Tabber:158 · plan/Card:103 — *copy-pasted verbatim* |
| **Empty state** | `text-sm.text-skin-muted` | 14px | 8 | Overview ×3 · ExpenseBreakdown · DebtPaydown · 4× WorkspaceProjection |
| | *no size class* | 16px | 1 | plans/index:73 — outlier |
| **Entity-type picker** | `span.font-medium.text-sm` | 14px / 500 | 2 | plans/[id]:354 · workspace-sim:222 |
| **Brand wordmark** | `span.text-xl` | 20px / 400 | 1 | layout/TheNavbar:59 — "Calcura", no weight |

---

## What's actually in use

**Sizes** — 10 scale steps plus 2 off-scale:

| | | | | | | | | | | | |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `text-lg` | `text-xl` | `text-sm` | `text-2xl` | `text-xs` | **`text-[10px]`** | `text-4xl` | `text-3xl` | **`text-[11px]`** | `text-6xl` | `text-base` | `text-5xl` |
| 86 | 47 | 44 | 43 | 35 | **36** | 10 | 10 | **9** | 4 | 3 | 3 |

`text-base` is used **3 times**. The app's own body size is essentially never stated — it's whatever the container happens to inherit.

**Weights** — 6 in play, no rule:

| `font-semibold` 600 | `font-medium` 500 | `font-bold` 700 | `font-light` 300 | `font-normal` 400 | `font-black` 900 |
|---|---|---|---|---|---|
| 108 | 50 | 7 | 2 | 1 | 1 |

Plus an **implicit 400** on every heading Preflight reset — the largest bucket of all, and the one nobody chose.

**Heading tags** — hierarchy is inverted:

| `<h3>` | `<h4>` | `<h2>` | `<h1>` |
|---|---|---|---|
| 80 | 19 | 10 | 8 |

`h3` has become the generic "title" tag: it is used for both the 24px dialog title and the 18px explainer sub-header. In the IRA/Roth/TaxDeferred forms, `h4` sits **above** `h3` in the visual hierarchy while both render at the same size.

---

## Proposed scale — strawman, not a decision

Seven roles cover every use in the inventory.

| Token | Size | Weight | Tracking | Used for |
|---|---|---|---|---|
| `display` | 36px | 700 | −0.02em | Page titles, hero verdict |
| `title` | 24px | 600 | −0.01em | Dialog + card titles |
| `heading` | 18px | 600 | — | Section headers, explainer sub-heads |
| `body` | 14px | 400 | — | Default copy — **matches NaiveUI's 14px** |
| `metric` | 30px | 600 | −0.01em, `tabular-nums` | Projection hero values |
| `caption` | 12px | 400 | — | Helper text, empty states |
| `eyebrow` | 11px | 600 | 0.08em, uppercase | Overlines — replaces both `text-[10px]` and `text-[11px]` |

Setting `body` to **14px** aligns the two systems by moving Tailwind to NaiveUI rather than the reverse; the alternative is overriding `common.fontSize` to 16px. That choice should be made explicitly — it affects every screen.

### Open questions

1. **Font family.** Load a real typeface (`@nuxt/fonts`), or commit to the system stack and state it explicitly? A finance product leaning on large numeric stats has a real stake here.
2. **Body size:** 14px (follow NaiveUI) or 16px (override NaiveUI)?
3. **Where do tokens live?** `tailwind.config.ts` `fontSize` extension, mirroring how `palette.ts` owns color — or extend `palette.ts` itself to own type too, keeping one source of truth?

---

## Remediation order

Sequenced so each step is independently shippable and independently reviewable.

| # | Step | Touches | Risk |
|---|---|---|---|
| ~~1~~ | ~~Fix **D1** `Stat.vue`~~ — **done** | 1 file | low |
| 2 | Fix **D3** IRA titles, **D4** footer `h1` | 3 files | low |
| 3 | Decide the three open questions above | — | — |
| 4 | Add `fontSize`/`fontWeight` tokens + a Typography section to `design-system.md` | 2 files | low |
| 5 | Set NaiveUI `common.fontSize` / `fontWeightStrong` in `buildNaiveCommon()` | 1 file | **high** — global |
| 6 | Collapse the eyebrow role: 45 × `text-[10px]`/`text-[11px]` → one token | 15 files | low |
| 7 | Collapse the card-title role: 8 variants → one primitive | ~30 files | medium |
| 8 | Fix **D2** page titles; add weight to all headings | 7 files | low |
| 9 | Add `tabular-nums` to `plan/summary/` money figures | 2 files | low |
| 10 | Extract the triplicated popconfirm title into a shared component | 3 files | low |

Steps 1, 2, 6, 9, 10 are mechanical and can proceed before the scale is settled. Steps 5 and 7 are the ones that will visibly move the whole app.
