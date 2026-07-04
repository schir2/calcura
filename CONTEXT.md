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

### Entity Workspace
The surface for adding or editing any plan entity, opened from the dashboard (toolbar "＋ Add", per-section add buttons, empty-state CTAs, or clicking an entity in a chart/legend/stat). **Two-pane on desktop, stacked on mobile** (form first). Left pane = the settings form (inputs first — cursor lands in the first field, no scrolling). Right pane = a **live projection** that reacts to the inputs in real time (baseline "saved plan" line vs the edited line, with an at-retirement delta) plus an **education panel** ("who it's for", when-to-use bullets, article link). Replaces the old plain-form modal. Confirmed against prototype 2026-07-04 — the two-pane drawer (settings + live graph) is the locked interaction model. (Grill session 2026-07-04.)


### Uniform Workspace across all domains
Every domain — income, investments (tax_deferred/ira/roth/brokerage/hsa/cash), debt, expense — uses the **same two-pane Entity Workspace** (form left, live projection + education right). One interaction model the user learns once. Each domain supplies three ingredients: its **fields**, its **projection type** (investment = balance growth / contrib-vs-growth; debt = paydown-to-zero + cumulative interest; expense = cost over time with inflation), and its **education copy**. No per-domain bespoke editing UX. (Grill session 2026-07-04.)

### Workspace input controls — number + slider, number is authoritative
Rate/percentage/amount fields in the Entity Workspace pair an **`n-input-number` with an `n-slider`**: the slider gives fast tactile adjustment over the *common* range, but the number input is authoritative and lets the user type values **beyond the slider's soft cap** (e.g. 30%+ debt interest, a large fixed contribution). Sliders must never hard-limit a value that can legitimately exceed their range — same rationale already applied to `retirement_spending_percentage` (see [[Retirement Spending Percentage]]). Slider max is a *comfortable default range*, not a validation bound; real min/max come from the domain validators. (Grill session 2026-07-04.)
### Category vs. Entity (chart click disambiguation)
The stacked spine/section charts group entities by **category** (tax-deferred, brokerage, roth, cash_reserve) for readability — never one band per account. Clicking a category band opens a **picker** listing the user's actual entities in that category (+ "add another"); with exactly one entity it skips straight into the Workspace. Keeps the legend from exploding when a plan has many accounts. (Grill session 2026-07-04.)

### Income-linked contributions (Income Workspace)
Income is a **flow, not an account** — its fields are `name` (the employer/source), `gross_income`, `frequency`, `growth_rate`, `income_type`. It has no balance and no contribution of its own. Instead, tax-advantaged accounts (`tax_deferred`, `ira`, `roth_ira`, HSA) are **funded as a percentage of a specific income** (`elective_contribution_percentage` + `income_id`; see [ADR 006](docs/adr/006-income-id-on-junction-tables.md)). The Income Workspace therefore lets the user **attach the accounts funded through that income inline** (e.g. "401(k) at 6% of this salary + employer match") rather than adding them loose and back-linking later. Loose-add + manual link stays supported; inline is the guided path. (Grill session 2026-07-04.)

## Glossary — Contribution Strategies

How much flows into an investment account each simulated year. Every investment account has a **contribution strategy** (an enum) plus strategy-specific amount fields. Confirmed against schema enums 2026-07-04. (Grill session 2026-07-04.)

### Simple accounts — Roth IRA, IRA, HSA
Fields: `name`, `initial_balance` (what's already in it — you may start with a balance), `growth_rate` (default **6**), `contribution_strategy` ∈ **`fixed` | `percentage_of_income` | `max`**, plus `contribution_fixed_amount` / `contribution_percentage`.
- `fixed` — a set dollar amount per year (e.g. $1,000).
- `percentage_of_income` — a % of the **linked income** (requires an `income_id`).
- `max` — contribute up to the IRS limit ("pay as much as allowed").

### Tax-deferred (401k) — the complex one
Same base fields (`name`, `initial_balance`, `growth_rate`, `income_id`) but a richer `tax_deferred_contribution_strategy` ∈ **`none` | `until_company_match` | `percentage_of_income` | `fixed` | `max`**:
- `until_company_match` ("employer match max") — contribute exactly up to the % the employer will match (capture the match, no more).
- `percentage_of_income`, `fixed`, `max` — as above.
Uses `elective_contribution_percentage` / `elective_contribution_fixed_amount`.

**Employer match sub-strategy** (only when `employer_contributes`): `employer_contribution_strategy` ∈ **`none` | `percentage_of_contribution` | `percentage_of_compensation` | `fixed`**:
- `percentage_of_contribution` — employer matches a fraction of what *you* put in. Two params: `employer_match_percentage` (the rate — e.g. matches 50% or 100% of your contribution) and `employer_match_percentage_limit` (capped at X% of income, e.g. up to 3%).
- `percentage_of_compensation` — a % of your total pay, via `employer_compensation_match_percentage`.
- `fixed` — a flat employer dollar amount.

### Income linkage — which accounts can link
Only **`tax_deferred`, `ira`, `roth_ira`** carry `income_id` (fundable as a % of a specific income). **`hsa` has NO `income_id`** in the schema — it is not income-linkable today — this is intentional, see [ADR 009](docs/adr/009-hsa-not-income-linked.md). HSA gates on HDHP health coverage, not income; its `percentage_of_income` strategy is a latent bug (fix separately). (Grill session 2026-07-04.)

### One entity, two views
An income-linked investment is **one record rendered in two places**: as a linked-investment row inside the Income Workspace (emphasis: the contribution), and as its own account card/band in the Investments section + net-worth spine (emphasis: the balance). Editing either edits the same row. Adding inline through income is a convenience that sets `income_id`. An investment can later be **detached** from its income (change jobs → delete the income, keep the account). **Deferred question:** when an account is detached, its `percentage_of_income` contribution has nothing to reference — does contribution stop, convert to fixed, or error? Resolve later. (Grill session 2026-07-04.)

### income_type is `ordinary` only
The `income_type` enum currently has a single value, `ordinary` — there is no salary/self-employed/pension distinction and no per-type tax treatment yet. The Income Workspace must not present a type dropdown implying otherwise until such property exists. (Grill session 2026-07-04.)

### Verdict hero
The headline crowning the page. **Strategy-aware and honest.** (Grill session 2026-07-04, confirmed against prototype.)
- **Strategy-adaptive headline (11b):** the primary sentence speaks the language of the plan's active retirement trigger — age-based → "Retire at 55."; percent-rule → "Your income covers your goal at 55."; target-savings → "You hit $2M at 57."; debt-free → "Debt-free at 47, retire at 55." The four supporting KPIs also adapt to the strategy; net-worth + debt-free age tend to stay constant underneath.
- **Failure state (11a):** when the simulation reaches life expectancy without meeting the criteria, the hero goes **`error` red**, names the gap in dollars ("You fall $340k short"), states when money runs out, and shows the **nearest actionable lever** ("work 3 more years — or cut expenses 8% — closes the gap"). A retirement tool must tell you when you're off track; the verdict is the product's spine of honesty. Chosen over a soft/neutral numbers-only hero.

### Full-lifespan spine (accumulation + drawdown)
The spine and verdict are designed for the **whole lifespan** — balances rise during accumulation, then **draw down through retirement**, with the line hitting zero *before* life expectancy as the failure signal (the signature retirement-planner image; ProjectionLab/Boldin). This is the destination, not accumulation-only. (Grill session 2026-07-04.)

**Sequencing / dependency:** the drawdown is **gated on issues #65/#66** (retirement as an ongoing simulated state — today `retired` never flips and the loop just stops at retirement). Ship in two stages:
- **Stage 1** — render accumulation up to retirement with an honest "projection ends at retirement" marker; verdict scoped to "can you *reach* retirement."
- **Stage 2** — once #65/#66 land, light up the drawdown years and enable the "will it last / money runs out at age X" claims.

The verdict hero **must not assert** "lasts until 92" / "runs out at 84" until the engine actually simulates the spend-down. See [[Retirement boundary]]. (Grill session 2026-07-04.)
### Chart rendering — keep Chart.js
Charts render via the existing **`vue-chartjs` / Chart.js** stack. The prototypes' hand-rolled SVG was NOT the appeal — it was the **weakest** part. What was approved is the **layout, cards, hierarchy, section composition, and stat/verdict tiles**, not any bespoke chart renderer. Do not swap the chart library to reproduce the prototype's exact look; reproduce the *composition* around Chart.js instead. (Grill session 2026-07-04.)
### Three views of a plan
A plan is experienced through **three sibling views** (not one page). This supersedes the earlier open question (Q5) of whether the command-sequence editor lives in the dashboard drawer — it does **not**; it is its own view. (Grill session 2026-07-04.)

1. **Detail view ("the pretty view")** — the visual retirement-journey page designed in this session: verdict hero + net-worth spine + Income/Investments/Liabilities sections, with the two-pane **Entity Workspace** for adding/editing entity *config*. Read-optimized; "it just looks good."
2. **Simulation view ("shuffle the commands")** — the existing **command-sequence editor**: `command/Tabber.vue` (sequence tabs, create/rename/delete sequences) + `command/Sequence.vue` (draggable `*ListItem` rows, per-sequence `is_active` + `order`). Where the user activates/reorders [[Command]]s and compares [[Command Sequence]]s to see how outcomes change. The in-progress **ListItem redesign** is this view's building blocks.
3. **Report view** — the year-by-year data table (`plan/Table.vue`, promoted out of its modal). Tabular investigation of the same `OrchestratorState[]`.

**Division of labor (entity config vs. command state):** editing an entity's *configuration* (balance, growth, contribution strategy, income link) is the **Entity Workspace's** job (view 1). Toggling a command's `is_active` and dragging its `order` is the **Simulation's** job (view 2) — those are per-sequence [[Command Sequence Command (CSC)]] properties, not entity config. A ListItem in view 2 may deep-link into the Workspace for full edits, but does not duplicate the config form. All three views read the same simulation output.

**Collision note (2026-07-04):** the user is actively rebuilding `plan/Card.vue` (plans-listing card), `plan/List.vue`, and the `*ListItem` components (view 2). The plan detail redesign must not fork these — reuse the ListItem work for view 2 and keep the Workspace (view 1) config-only.

### Shared Workspace + view naming
The [[Entity Workspace]] is a **single shared component** summoned from every view — a chart band in the Detail view, an "edit" affordance on a ListItem in the Simulation, potentially the Report. Built once, reused everywhere; ListItems stay lean (activate toggle + drag handle + "edit" → opens the shared Workspace), never a second inline config form (Q14 = A). This also dissolves the "how do Detail and Simulation interact?" worry — they don't diverge, they open the same drawer.

**Naming:** do NOT call view 1 "the dashboard" — the platform already has `/dashboard` (the Tools hub; see "Glossary — Dashboard / Tools"). The plan-level views need their own names (candidates: Detail / Overview / Journey for view 1; Simulation for view 2; Report for view 3). Confirmed (2026-07-04): view 1 = **Overview**, view 2 = **Simulation**, view 3 = **Report**. (Grill session 2026-07-04.)

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

### Sparkline vs graph (rendering split by density)
The collapsed [[Rich List Item]] sparkline is a **lightweight inline SVG `<polyline>`** over the entity's [[Manager State History]] series — no canvas, axes, legend, or animation — so a dozen render cheaply and theme via `skin` tokens. The **expanded** view uses **Chart.js** (reusing existing chart infra) where axes/tooltip/hover earn their weight. Rejected: Chart.js for both — N live canvas+animation instances at collapsed density is the real "too heavy" risk the user worried about (the data was never the problem). (Grill session 2026-07-04.)

### Rich List Item chosen design ("Compact") + mobile treatment
Prototyped three variants (`?variant=A|B|C`); **A — "Compact" dense ledger row won** (over B accent stat card, C graph-as-hero). Collapsed = single row (icon · name · strategy chip · sparkline · headline value+label · chevron · ⋯). Expanded = one shared panel: Chart.js graph (2/3) + a side column (1/3) with a Projection block (Today → [[Headline Value]]) plus the full [[Facet]] list and education affordance. B's left accent bar was rejected — with the wrapper's drag-handle+switch to the card's left, a card-left accent never sits at the container edge, so it reads as a broken seam. **Mobile:** value+label stack (no fixed widths — the prior `w-28`/`w-20` overflowed); strategy chip hides below `sm`; the expanded grid collapses to one column with config **above** a shorter chart. Prototype route runs `layout: false` (no navbar/sidebar) so mobile width is honest. (Grill session 2026-07-04.)

### Education affordance (content-less for now)
The [[Rich List Item]] reserves a *place* for educational hints (tooltips / an info affordance answering "what is this, what's it for") but ships **no content** — the [[Learn / Articles]] library that would supply it does not exist yet. The design must degrade gracefully when the blurb/article is absent (the affordance hides or no-ops), and light up automatically once content exists — no rework. Authoring the content is explicitly a **future, separate effort**, out of scope for the list-item redesign. (Grill session 2026-07-04.)

## Glossary — Retirement Drawdown Tax

How withdrawals from savings are taxed during retirement decumulation. Introduced for tax-aware
withdrawal sequencing (#68), which follows the tax-naive drawdown of #67. (Grill session 2026-07-04.)

### Per-bucket effective rate
Retirement-withdrawal tax is modeled as a single **effective rate per account bucket** applied to
the **whole withdrawal** — deliberately *not* cost-basis tracking (only-the-gain-is-taxed) or tax
brackets. This matches the engine's existing flat-tax world (`income_type` is `ordinary`-only, one
`tax_rate`). It slightly over-taxes taxable-bucket withdrawals (real life taxes only the gain), an
intentionally conservative direction for a planning tool. Basis/LTCG realism is a deferred future
issue, not #68.

### Tax source (`taxFor` seam)
All tax computation routes through **one function** keyed by the money's source, generalizing
today's flat `calculateTaxes(agi)` (`PlanManager.ts:502`) — which becomes the `ordinary` case:
- `ordinary` → `tax_rate` — income during accumulation, **and** tax-deferred (401k/IRA/HSA)
  withdrawals (they are ordinary income).
- `capital_gains` → new `capital_gains_rate` plan field (default `15`) — brokerage (taxable-bucket)
  withdrawals.
- `tax_exempt` → 0 — Roth withdrawals.
- `cash` → 0 — cash-reserve withdrawals.
Rationale: one seam to change when brackets/basis land later, instead of every call site.

### Withdraw Command (`command.action = 'withdraw'`)
Decumulation is driven by [[Command]]s, not a hardcoded drain array. `command.action` (today `TEXT`,
always `'process'`, engine-ignored) becomes a real **enum**: `process` | `invest` | `withdraw`.
Each investment-category entity (brokerage, tax_deferred, ira, roth_ira, hsa) emits **two** commands
on insert — its accumulation command **plus** a paired `withdraw` command; non-investment entities
(income, expense, debt, cash_reserve) keep a single `process` command. The simulation **filters by
action per phase**: accumulation years run the contribute side; retirement years still `process`
income/expense/debt **and** run `withdraw` commands to cover the expense shortfall. This lays
groundwork for **per-entity** drain ordering — the one thing [[Per-bucket effective rate]] tax can't
express (e.g. two tax-deferred accounts at different growth rates: drain the slower-growing one first
to preserve compounding). (Grill session 2026-07-04.)

### `withdrawal_ordering_type`
Withdrawal ordering is a **separate directive** from invest [[`ordering_type`]] (which stays
`predefined | custom`) — independently settable (invest `predefined` while withdraw `custom`) and one
tier richer: `predefined | bucket | custom`.
- `predefined` — canonical drain order **cash → taxable → tax-deferred → tax-exempt** (spend the
  cheapest-taxed first, preserve tax-free Roth last). The **#68 default and only shipped mode**.
- `bucket` — user reorders the four buckets. Fast-follow (needs bucket-order storage + UI).
- `custom` — user drag-orders individual [[Withdraw Command]]s, reads `csc.order`. Fast-follow
  (needs drag UI; withdraw commands already exist so it is additive, not rework).

## Decisions

### Tax-aware withdrawal sequencing (#68) ships the spine; richer ordering modes are fast-follows
The first deployable slice of tax-aware drawdown is deliberately scoped to: [[Per-bucket effective
rate]] tax via the [[Tax source (`taxFor` seam)]], `capital_gains_rate` field, gross-up, the full
[[Withdraw Command]] groundwork (action enum + paired-command triggers + phase filtering), and
[[`withdrawal_ordering_type`]] = `predefined` only. The `bucket` and `custom` ordering modes are split
into fast-follow issues — the two-command architecture is laid down in this slice, so they become
additive PRs. This feature spans enough surface (engine + schema + triggers + UI) that it warrants its
own PRD/issue breakdown rather than a single issue. (Grill session 2026-07-04.)

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
