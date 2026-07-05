# Plan Detail Redesign — Design Summary

**Status:** Design locked (implementation not started)
**Date:** 2026-07-04
**Source:** grill-with-docs session. Canonical vocabulary lives in
[CONTEXT.md](../../CONTEXT.md) → "Glossary — Plan Detail Visualization",
"Glossary — Contribution Strategies". Decision on HSA: [ADR 010](../adr/010-hsa-not-income-linked.md).

The plan detail page (`app/pages/plans/[id].vue`) is being redesigned to become **the heart of
the platform** — most other pages are being cut. It is a **retirement-journey visualizer** first,
an editing surface second.

## Prototypes (throwaway, claude.ai artifacts)
- Full assembled page + hero states — https://claude.ai/code/artifact/ac99cc54-f1fd-4a2b-ab84-f72a68faa0c6
- Entity Workspace v2 (two-pane, inputs-first) — https://claude.ai/code/artifact/fda395c7-3fcb-4022-b5c6-0d89469044d3
- Income Workspace (linked investments) — https://claude.ai/code/artifact/3ce9d3b5-885d-41f2-8246-d1757ea20b02
- Layout A/B + drawer/mobile — https://claude.ai/code/artifact/863b6edf-6ec0-46f4-abf1-d3150fa84032

The prototypes' **hand-rolled SVG charts are NOT the design** — charts stay on `vue-chartjs`.
What was approved is the **layout, cards, hierarchy, and composition**.

## Locked decisions

1. **Page job** — a trajectory (journey-over-time) visualizer, crowned by a retirement verdict.
2. **Spine** — a stacked-area **net-worth-over-time** chart (asset buckets + un-invested cash as
   bands, optional net-worth line). Debt is broken out separately, not stacked below zero.
   Designed for the **full lifespan**: accumulation now, **drawdown** later (zero-crossing = failure).
3. **Body layout** — single vertical scroll, three domain sections in order:
   **Income (green) → Investments (blue) → Liabilities (red)**. Chosen over tabs.
4. **Editing = Entity Workspace** — dashboard owns the page; editing opens a **two-pane drawer**
   (desktop) / **bottom sheet** (mobile). Left = form (inputs first, no scroll). Right = **live
   projection** (reacts to inputs, baseline-vs-edited, at-retirement delta) + **education panel**
   (who/when + article link). **Uniform across every domain** (income, investments, debt, expense);
   each supplies its own fields, projection type, and copy.
5. **Multiplicity** — charts group by **category**; clicking a band opens a **picker** of the user's
   actual entities (skips straight in when there's only one). An income-linked investment is
   **one record, two views** (contribution view in income, balance view in investments).
6. **Income model** — income is a **flow** (`name`, `gross_income`, `frequency`, `growth_rate`);
   no balance. Tax-advantaged accounts are funded as `percentage_of_income` via `income_id`
   ([ADR 006](../adr/006-income-id-on-junction-tables.md)). The Income Workspace attaches
   "**Investments linked to this income**" inline (401k / IRA / Roth). **HSA excluded**
   ([ADR 010](../adr/010-hsa-not-income-linked.md)).
7. **Contribution strategies** — Roth/IRA/HSA: `fixed | percentage_of_income | max`. 401(k):
   `none | until_company_match | percentage_of_income | fixed | max` + employer-match sub-strategy
   (`percentage_of_contribution` with rate + limit, `percentage_of_compensation`, `fixed`).
   See CONTEXT "Glossary — Contribution Strategies" for field mapping.
8. **Verdict hero** — strategy-aware headline (adapts to age / percent-rule / target-savings /
   debt-free); honest **red failure state** naming the dollar gap + nearest lever ("work 3 more
   years or cut expenses 8%"). Must not assert drawdown claims ("runs out at 84") until the
   engine supports it.

## Staged rollout
- **Stage 1** — accumulation spine, verdict scoped to "can you *reach* retirement," honest
  "projection ends at retirement" marker. Ships against today's engine.
- **Stage 2** — drawdown years + "will it last / runs out at age X". **Gated on issues #65/#66**
  (retirement as an ongoing simulated state).

## Dependencies & follow-ups
- **#65/#66** — retirement-as-ongoing-state; prerequisite for Stage 2 drawdown.
- **Bug** — `percentage_of_income` is offered on HSA but HSA has no `income_id` (percent of a
  nonexistent income). Restrict HSA strategies to `fixed | max`. Own issue.
- **Deferred** — when an investment is **detached** from its income (e.g. job change), what happens
  to a `percentage_of_income` contribution (stop / convert to fixed / error)?
- **Deferred** — a **health-insurance / HDHP category** (distinct tax treatment); HSA would attach
  there, never to income (ADR 010).

## Not yet grilled (open branches)
- A "final report" export/summary view (mentioned early).
- The "forces" educational layer (inflation / taxes drill-down as a secondary layer).
- Taxes are computed but **not stored** as a per-year field — needed for a taxes-over-time chart.
- Contributions-vs-growth chart data source (`contribution_lifetime` exists per category).

## Second surface — Report page (not yet designed)
A separate **report page**: the full year-by-year **data table** of the simulation, for
investigating the numbers behind the charts. The detail page is the *visual* view; the report
page is the *tabular* view of the same `OrchestratorState[]`. Largely already exists as
`app/components/plan/Table.vue` (`LazyPlanTable`, currently shown in the "Show Me the Data"
modal) — the redesign promotes it from a modal to its own page. **Deliberately not grilled yet.**

- **Input controls** — Workspace rate/amount fields use paired `n-input-number` + `n-slider`; number is authoritative and may exceed the slider cap (e.g. 30%+ interest). Sliders are a comfort range, not a bound.

## Architecture — a plan has three views
Supersedes the single-page framing. A plan (`/plans/[id]`) is experienced through three sibling
views (tabs/sub-routes), all reading the same `OrchestratorState[]`. Names (confirmed 2026-07-04):

1. **Overview** (view 1, "the pretty view") — the visual retirement-journey page designed this
   session: verdict hero + net-worth spine + Income/Investments/Liabilities sections. Config
   editing via the shared **Entity Workspace** drawer.
2. **Simulation** (view 2) — the existing command-sequence editor (`command/Tabber.vue` +
   `command/Sequence.vue` + the in-progress `*ListItem` redesign): activate/reorder commands,
   compare sequences. Per-sequence `is_active` + `order` only.
3. **Report** (view 3) — the year-by-year data table (`plan/Table.vue` promoted from its modal).

Do **not** name view 1 "dashboard" — the platform's `/dashboard` is the Tools hub.

**Shared Entity Workspace (Q14=A):** one drawer component, summoned from any view (chart band in
Overview, "edit" on a ListItem in Simulation). Built once, reused everywhere. ListItems stay lean
(toggle + drag + "edit" → opens the shared Workspace); no second inline config form. This
dissolves the Overview↔Simulation interaction question — they open the same drawer.

**In-flight collision:** user is actively rebuilding `plan/Card.vue` (plans-listing card),
`plan/List.vue`, and the `*ListItem` components (Simulation). Reuse that work; do not fork it.

## Proposed issue slices (vertical, grabbable) — DRAFT, pending go-ahead
- **Reusable chart components** around Chart.js: stacked-area (spine), income-vs-expenses,
  contributions-vs-growth, debt paydown — props from sim output, palette.ts colors.
- **Overview shell** — verdict hero (strategy-aware + failure state), spine, three section frames.
- **Entity Workspace shell** — two-pane drawer (form left, live projection + education right),
  inputs-first, desktop/mobile, number+slider inputs. One entity type end-to-end first.
- **Workspace per domain** — fill in fields/projection/education for each entity type
  (investment, income, debt, expense) reusing the shell.
- **Contribution-strategy + employer-match forms** — the 401(k)/Roth/HSA strategy UI.
- **Income-linking** — "investments linked to this income" inline + one-entity-two-views wiring.
- **Category→entity picker** — multiplicity disambiguation from chart bands.
- **Report view** — promote `plan/Table.vue` out of its modal to its own view.
- **HSA strategy fix** (bug) — remove `percentage_of_income` from HSA.
- Later/blocked: **drawdown** (needs #65/#66), **detachment** behavior, **taxes-over-time**
  (needs taxes stored per year), **health/HDHP category**.
