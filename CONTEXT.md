# Context

## Glossary

### Form Defaults (`*defaults`)
Typed objects (e.g. `taxDeferredDefaults: TaxDeferredInsert`) that pre-fill a create form when no template is selected. Typed against Supabase `*Insert` types so the compiler catches schema drift. Live in `constants/` — not in `types/`.

### Templates
User-selectable starting points stored in Supabase (`*_template` tables). When a template is selected, `processTemplate()` merges its values over the form defaults — template wins, defaults fill gaps. Templates are above defaults in the hierarchy: Template → Default → nothing.

### Create Form
A form component typed against the domain's Supabase `*Insert` type. Emits `create: [insert: *Insert]`. Has no `id`. Corresponds to `CreateForm.vue` per domain.

### Edit Form
A form component that receives a full entity (with `id`) as a prop. Emits `update: [id: number, update: *Update]`. The `id` comes from `props.entity.id`, never from form model state. Corresponds to `EditForm.vue` per domain.

### `useCrudForm`
Composable that manages form state and validation only. Returns `{ formRef, modelRef, rules, validate }`. Does not own emit logic — that lives in the form component. Generic over whatever Supabase type the caller passes (`*Insert` for create, full entity for edit).

## Glossary — Design System

### Design token
A named, reusable styling value (a color, radius, or elevation) defined once and referenced everywhere. In this app, tokens are CSS custom properties in `app/assets/css/tailwind.css` — the single source of truth. See [ADR 008](docs/adr/008-design-tokens-tailwind-source-of-truth.md) and [docs/design-system.md](docs/design-system.md).

### Skin token
The public Tailwind API over the color tokens: `bg-skin-*`, `text-skin-*`, `border-skin-*`, `ring-skin-*`, `fill-skin-*`. Each resolves to a CSS var via the `withOpacity()` helper. Components use skin tokens, never raw Tailwind colors (`text-red-500`, `text-white`).

### Semantic color role
A token named for its *meaning*, not its hue: `primary`, `secondary`, `error`, `success`, `warning`, `info`, `base`, `muted`, `surface`. Styling references the role so recoloring the brand is one var edit.

### Brand palette
The concrete color values currently assigned to the semantic roles. Lives entirely in `tailwind.css`. Initially seeded from NaiveUI's default theme, then evolved independently. NaiveUI is pointed *at* the palette (downstream), not the source of it.

## Naming Conventions

### Runtime variable names must be fully descriptive
Callback parameters, locals, and all runtime identifiers use complete, meaningful names — never 1-2 letter abbreviations. `taxDeferred`, `brokerage`, `manager`, `command` — not `td`, `b`, `m`, `c`. This applies everywhere: `map`, `reduce`, `forEach`, and plain variable declarations.

Generic type parameters (`T`, `TState`, `TConfig`, `TRow`) are exempt — they follow standard TypeScript convention and operate only in the type system.

## Glossary — Simulation

### Command
A pointer to a domain entity that can participate in the simulation: `model_name` (e.g. `'tax_deferred'`) + `model_id`. A command is plan-scoped and shared across all sequences on that plan.

### Command Sequence
A named, ordered list of commands associated with a plan. A plan always has at least one sequence (auto-created by trigger on plan INSERT). Multiple sequences let the user compare different activation/ordering strategies.

### Command Sequence Command (CSC)
The junction record linking a Command to a Sequence. Carries `order` (integer, 1-based) and `is_active` (boolean). These are per-sequence — the same command can be active in one sequence and inactive in another.

### Active Command
A CSC where `is_active = true`. The simulation processes **only** active commands. Inactive commands are skipped entirely — the corresponding manager does not run at all that year. There is no "passive processing" mode.

### `ordering_type`
A **live sort directive** on a Command Sequence that determines how active commands are ordered for execution — `predefined` or `custom`.

- `predefined` — commands are sorted on the fly by the canonical model-priority algorithm (income → debt → expense → cash_reserve → tax_deferred → roth_ira → ira → brokerage → hsa). `csc.order` is **ignored** in this mode; switching to predefined does not rewrite it.
- `custom` — commands are sorted by the user's drag order stored in `csc.order`.

The simulation branches on `ordering_type`: under `predefined` it applies the priority algorithm; under `custom` it sorts by `csc.order`. So `csc.order` is authoritative only when `ordering_type = 'custom'`.

### Manager State History
The per-entity year-by-year `TState[]` held privately on each `BaseManager` (`this.states`, exposed via `manager.getStates()`). Distinct from [[Command Sequence]]'s aggregate output: `OrchestratorState` collapses the same figures by *category* (`assets.taxable`, `assets.cash_reserve`, …) and discards per-entity granularity. The real per-item series a subgraph needs already exists here — it is simply not surfaced to the frontend today. (Grill session 2026-07-03.)

## Glossary — Retirement Expenses

Expenses behave differently before and after the retirement boundary. Two fields on the
`expense` row model this (both defaulted so existing plans and the #65 timeline extension are
unchanged). (Grill session 2026-07-03.)

### Retirement Spending Percentage (`retirement_spending_percentage`)
The portion of an expense's `amount` that applies once the plan is retired. A percent, default
`100`. `0` = the expense stops at retirement (commuting, work clothes); `100` = continues
unchanged (groceries, utilities); between = partial reduction (dining out); **above `100` is
allowed** = the expense grows in retirement (healthcare, travel). Applied uniformly to the
(already inflation-grown) `amount` for every retired year — **no special-casing**: it multiplies
every expense the same way, including `is_retirement_only` ones. During working years it does
not apply (the amount is used as-is). Validated with a domain-specific
`MAX_RETIREMENT_SPENDING_PERCENTAGE` (proposed `500`), not the shared `MAX_PERCENTAGE=100`.
Entered via an `n-input-number` (not a slider — a slider can't cleanly exceed 100%). `100` is
the "unaffected" value, so no separate disable toggle is needed.

### Retirement-Only Expense (`is_retirement_only`)
A boolean, default `false`. When `true`, the expense contributes **nothing during working
years** and only begins at the retirement boundary (long-term care, Medigap). Needed because a
percentage-of-working-amount alone can't express it — the working amount is `0`, so any
percentage of it is `0`. This is the one scenario the slider can't cover; the bool covers it.
It does not interact specially with the percentage: once retired, a retirement-only expense is
scaled by `retirement_spending_percentage` like any other.

### Retirement boundary
The year at which the plan becomes retired. Today `retired` exists on `OrchestratorState` but
is never flipped and retirement is only a loop-stop; issues #65/#66 make retirement an ongoing
simulated state, at which point retirement-expense logic keys off that same signal.

## Glossary — Plan Detail Visualization

### Trajectory (spine)
The plan detail page is organized around the user's financial journey **over time**, not around single-year snapshots. The primary/focal element is a master time-series chart of the whole journey; every other chart is a breakdown of a component of that trajectory. A retirement verdict ("can you retire, and when") is the headline crowning the trajectory. Framing chosen over an account-snapshot layout and a forces-teardown layout — the forces (tax, inflation, interest) become a secondary drill-down layer, not the page's top-level organizing principle. (Grill session 2026-07-01.)

The spine chart is a **stacked-area "net worth over time"**: the four asset buckets + un-invested cash as colored bands climbing over the years, optional net-worth line overlaid. Matches the industry convention (ProjectionLab, Boldin, Empower all lead with this). Debt is **not** stacked below the axis in the spine — it gets its own dedicated paydown chart in the liabilities section. Pie/donut charts are reserved for true single-instant composition snapshots (e.g. current asset allocation), never for journey data — this is why the old expense/gross-savings pies felt wrong. (Grill session 2026-07-04.)

Below the hero, the page is a **single vertical scroll of three domain sections — Income, Investments, Liabilities** (in that order), each a labeled section header + its own charts/stats. Chosen over a tabbed variant (everything-visible beats one-domain-at-a-time for the "see the whole picture" goal). Confirmed against a clickable prototype 2026-07-04. Section accent colors: Income = green, Investments = blue, Liabilities = red. (Grill session 2026-07-04.)

## Glossary — Dashboard / Tools

### Tool
The umbrella concept for a self-contained feature surfaced as a **card on the dashboard**. The dashboard (`/dashboard`) is a hub — a grid of Tool cards — not a data page. A Tool is either **available** (links to a real route) or **coming-soon** (renders as a non-interactive placeholder card). Only the Planner is available today. (Grill session 2026-07-01.)

### Planner
The Tool for building and simulating retirement plans. Its card links to the plan listing page (`/plans`), which opens a plan detail page (`/plans/[id]`) where all domain entities (income, expense, debt, brokerage, IRA, etc.) are created and edited. The Planner is the first — currently only — available Tool.

### Visualizer
A category of Tool: an interactive, educational feature that *visualizes* how a financial concept works (e.g. **Debt Visualizer**, **Investment Visualizer**, **Compound Interest**). Visualizers are distinct from a plan's own entities — the *Debt Visualizer* is an educational Tool and has nothing to do with the deleted `/debts` CRUD page. All Visualizers are coming-soon placeholders for now. Do **not** name a Visualizer after a bare domain (`debt`, `investment`) alone — the "Visualizer" qualifier is what keeps it separate from plan entities.

### Learn / Articles
A reference library of educational articles (e.g. how 401(k)s work, platform explainers). Surfaced as a Tool card. Tools cross-reference relevant Articles. Coming-soon for now.

## Glossary — Plan Detail Visualization (cont.)

### Rich List Item (proposed)
The redesigned command-sequence list item: an expanded, more informative rendering of a single [[Command]] (one financial entity) inside a Command Sequence, replacing today's terse title + tags + summary in `command/ListItem.vue`. Aims to surface the entity's active configuration (strategy, key params), its real value, and a per-item subgraph sourced from [[Manager State History]]. It is a *learn-and-play* surface. (Grill session 2026-07-03.)

### Rich List Item density model (collapse / expand)
Two persistent resting states — **collapsed** (compact row: essentials + mini-sparkline) and **expanded** (full subgraph + config + education affordance) — defaulting to **collapsed** so the sequence opens tidy and scannable. Controlled at two scopes: a **per-item** chevron (study one entity) and a **global** expand-all / collapse-all on the sequence header (bulk). A third, **transient** layer overrides both: the moment a drag starts, every card collapses regardless of state (rich cards are un-draggable); on drop, each card restores its prior per-item state. Drag only occurs in `custom` [[`ordering_type`]] mode (it is disabled under `predefined`), so the drag-collapse only fires where reordering is possible. Precedence, one chain not three fighting booleans: **drag override → per-item state ← seeded by global toggle**. Nothing about expand state is persisted server-side. (Grill session 2026-07-04.)

### Headline Value
The single most decision-relevant number shown on a collapsed [[Rich List Item]], sourced from [[Manager State History]] (real sim), not a static config field. It is the **punchline**, not the annual flow — domain-defined:
- Investments (brokerage / IRA / Roth / tax-deferred / HSA) → **projected balance at retirement**; annual contribution demoted to a secondary chip.
- Cash Reserve → **target reserve** it builds toward (+ whether funded).
- Income → **annual gross**, current year.
- Expense → **annual amount**, current year.
- Debt → **remaining principal** + payoff year.

The collapsed sparkline shows the trajectory that lands on the Headline Value. Open edge cases (defer to prototype): what the investment headline shows when the plan never reaches retirement / the sim doesn't converge, and which year counts as "current" for income/expense (assume year 0). (Grill session 2026-07-04.)

### Rich List Item ownership boundary
The `command/Sequence.vue` **wrapper** keeps owning the **drag handle** and the **active `n-switch`** — correct because `is_active` and `order` are per-CSC (per-sequence), while the entity's config and [[Manager State History]] are shared across all sequences. The [[Rich List Item]] owns everything else (icon, name, chips, [[Headline Value]], sparkline, expand chevron, edit/delete actions) and composes visually into one seamless card. Collapsed contents: **icon · name · strategy chip · headline value · sparkline · chevron · actions**. When `is_active = false` the whole card dims/desaturates and the sparkline greys/flattens, making "off / not contributing" instantly legible. (Grill session 2026-07-04.)

### Facet (Rich List Item)
A humanized, strategy-aware display chip declared by the **domain** `ListItem.vue` and passed down to the shared card — a richer extension of today's `tags[]` prop. The domain wrapper interprets raw config into meaning (`contribution_strategy='percentage_of_income', pct=10` → "10% of income"; `='max'` → "Maxing out"); the shared card renders facets dumbly and knows nothing domain-specific. Rejected alternative: a central per-domain descriptor schema — it would pull domain knowledge into a central registry and break the dumb-card / smart-wrapper split the codebase already uses. Collapsed shows the primary strategy facet only; the full facet set is expand-only. (Grill session 2026-07-04.)

### `managerStates` provide (per-entity plumbing)
How [[Manager State History]] reaches the [[Rich List Item]]. In `[id].vue`'s existing simulate `watchEffect`, immediately after `orchestrator.simulate(seq)`, snapshot per-entity states into a reactive `Record<modelName, Record<modelId, TState[]>>` and `provide('managerStates', …)` — a second, more granular provide alongside the existing `provide('planStates', …)`. Items inject and look up `managerStates[modelName]?.[modelId]`. Chosen over providing the live `orchestrator` object + version counter, which would leak a non-reactive engine object into components and violate the engine's pure/non-reactive mandate. The `PlanManager.getManagerById(modelName, modelId).getStates()` accessor this relies on already exists and is tested (`PlanManager.test.ts`). Known risk (prototype must verify, not a blocker): sparklines only refresh if editing an entity retriggers that `watchEffect` → re-simulate; the chain exists today for the aggregate charts. (Grill session 2026-07-04.)

### Education affordance (content-less for now)
The [[Rich List Item]] reserves a *place* for educational hints (tooltips / an info affordance answering "what is this, what's it for") but ships **no content** — the [[Learn / Articles]] library that would supply it does not exist yet. The design must degrade gracefully when the blurb/article is absent (the affordance hides or no-ops), and light up automatically once content exists — no rework. Authoring the content is explicitly a **future, separate effort**, out of scope for the list-item redesign. (Grill session 2026-07-04.)

## Decisions

### Rich List Item subgraphs show real attributed simulation output, not standalone projections
The [[Rich List Item]] subgraph is sourced from [[Manager State History]] (the entity's real per-year states inside the full simulation) — **not** a decoupled per-item projection like `brokerage/ProjectionChart.vue`. Rationale: a standalone projection ignores contribution limits, command ordering, and the retirement cutoff, so it would show a *different* number than the plan actually produces — two conflicting curves for one account. The engine math needs no change; the work is plumbing per-manager state out through the store to the item. The subgraph is independently droppable if that plumbing balloons — first thing to cut, not a blocker for the rest of the redesign. (Grill session 2026-07-03.)

### Shared validation bounds live in `constants/shared.ts`
Cross-domain bounds (`MIN_NAME_LENGTH=3`, `MAX_NAME_LENGTH=32`, `MIN_GROWTH_RATE=0`, `MAX_GROWTH_RATE=200`, `DEFAULT_GROWTH_RATE=6`, `MIN_PERCENTAGE=0`, `MAX_PERCENTAGE=100`) are extracted from `planConstants.ts` into a new `constants/shared.ts`. The differing name lengths across domains (2, 3, 50) were drift, not intent — standardised to min=3, max=32.

### Domain-specific constants stay in their own files
IRS contribution limits, domain-specific ranges (e.g. `MAX_INTEREST_RATE`, `MAX_RESERVE_MONTHS`) remain in `constants/TaxDeferredConstants.ts`, `constants/DebtConstants.ts`, etc. Only genuinely cross-domain values move to `shared.ts`.

### `*defaults` objects belong in `constants/`, not `types/`
`types/` files contain only types (`Tables<>`, `*Insert`, `*Update`, union aliases). Form defaults (`*defaults`) move to the domain constants file so all configuration for a domain is co-located and `types/` stays clean. The typed `*Insert` annotation on each defaults object is preserved — constants files import the type from `types/`.

### Create and Edit forms are separate components
The single `Form.vue` with `mode: 'create' | 'edit' | 'view'` prop is replaced by `CreateForm.vue` and `EditForm.vue` per domain. Tracked in issues #20 (composable refactor) and #21 (form split).

### `useCrudFormWithValidation` is replaced by `useCrudForm`
The composable no longer owns emit logic or distinguishes create vs update. Tracked in issue #20.

### Project settings / DB-backed defaults deferred
Storing form defaults in a Supabase `settings` table was considered and deferred — no concrete actor needs to change defaults without a deploy, and the template system already covers the user-configurable case.
