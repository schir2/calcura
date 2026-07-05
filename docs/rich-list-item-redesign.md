# Rich List Item Redesign — Implementation Plan

> Status: **design validated via prototype**; issues **#82–#92** published (schir2/calcura), not started.
> Source of truth for decisions: `CONTEXT.md` → "Rich List Item", "Manager State History",
> "Headline Value", "Facet", "Sparkline vs graph", "managerStates provide", "Education affordance",
> "Rich List Item chosen design (Compact)". (Grill + prototype sessions 2026-07-03/04.)
> Throwaway prototype lives at `app/pages/prototype/rich-list-item.vue` +
> `app/components/prototype/richListItem/` — **delete once folded in**.

## What we're building

Replace the terse command-sequence list item (`command/ListItem.vue`: title + tags + summary)
with the **Rich List Item** — an expand/collapse card showing, per financial entity:

- **Collapsed** (default): icon · name · strategy chip · SVG sparkline · headline value + label ·
  expand chevron · actions. Inactive (`is_active=false`) items dim/desaturate.
- **Expanded**: shared panel = Chart.js graph (2/3) + side column (1/3) with a Projection block
  (Today → headline value), the full humanized facet list, and a content-less education affordance.

Chosen design = **"Compact"** ledger row (prototype variant A). Mobile: value+label stack, strategy
chip hides `< sm`, expanded grid collapses to one column (config above a shorter chart).

## Key decisions (see CONTEXT.md for rationale)

- **Data = real, not projected.** Subgraph/headline come from per-entity **Manager State History**
  (`manager.getStates()`), surfaced via a new reactive `provide('managerStates', …)` in
  `plans/[id].vue` alongside the existing `planStates`. Engine math unchanged; `getManagerById()`
  already exists + is tested. Subgraph is independently droppable if plumbing balloons.
- **Rendering split by density.** Collapsed sparkline = lightweight inline SVG `<polyline>`.
  Expanded graph = Chart.js (reuse existing infra).
- **Headline value = the punchline**, domain-defined: investments → projected balance at retirement;
  cash reserve → target reserve; income → annual gross; expense → annual amount; debt → remaining
  principal + payoff year.
- **Facets = domain-declared + humanized** (extend today's `tags[]`). Shared card stays dumb;
  domain wrappers interpret `contribution_strategy` etc. into chips like "10% of income" / "Maxing out".
- **Ownership boundary.** `command/Sequence.vue` wrapper keeps drag handle + active switch
  (per-CSC); the Rich List Item owns everything else.
- **Collapse/expand.** Per-item + global (expand/collapse-all on the sequence header), default
  collapsed. Transient drag override collapses everything while dragging, restores on drop.
  Precedence: drag override → per-item state ← seeded by global toggle. Not persisted server-side.
- **Education affordance** ships with no content; degrades gracefully, lights up when the
  Learn/Articles library exists. Out of scope to author content here.

## Tracer-bullet slices

Prove the whole vertical on ONE domain, then fan out. Each domain slice is independently grabbable.

### Slice 0 — Plumbing (blocks everything) — issue #82
- In `plans/[id].vue` simulate `watchEffect`, after `orchestrator.simulate(seq)`, snapshot
  per-entity states into reactive `Record<modelName, Record<modelId, TState[]>>` and
  `provide('managerStates', …)`.
- **Verify the reactivity risk:** editing an entity must retrigger the watchEffect → re-simulate →
  sparkline moves. (Chain exists today for aggregate charts.)

### Slice 1 — Shared card + one domain end-to-end (e.g. brokerage) — issue #83
- Refactor `command/ListItem.vue` into the Rich List Item shell (collapsed row + expanded panel).
- Add reusable leaves: `Sparkline.vue` (SVG), an expanded Chart.js graph, the expanded side panel.
- Wire per-item + global + transient-drag collapse into `command/Sequence.vue`.
- Give `brokerage/ListItem.vue` its humanized facets + headline value (projected balance at
  retirement from `managerStates`).
- Fold in inactive-dim, mobile reflow, education-affordance placeholder.

### Slices 2–9 — Remaining domains (parallelizable) — issues #84–#91
One HITL issue each: `income` #84, `expense` #85, `debt` #86, `cash_reserve` #87, `tax_deferred` #88,
`roth_ira` #89, `ira` #90, `hsa` #91. Each **begins with an interactive design step** with the user
(collapsed zones, expanded zones + which zone, facet/tag styling, headline value/label/sign), then
implements against the Slice 1 authoring guide. No shared-card changes expected after Slice 1.

### Slice 10 — Cleanup — issue #92
Delete `app/pages/prototype/rich-list-item.vue` and `app/components/prototype/richListItem/`.

## Open edge cases (resolve during Slice 1)
- Investment headline when the plan never reaches retirement / sim doesn't converge.
- Which year is "current" for income/expense headline (assume year 0).
- Chart.js theme colors: prototype used literal hexes (can't read CSS vars); decide whether to read
  `--color-*` at runtime or keep a small per-model hex map. Design-system note: raw colors are
  disallowed in app components, so this needs a real answer before folding in.
