# PROTOTYPE — Overview chart composition (issue #94)

**Question:** What should the Overview view look like — the layout / cards / hierarchy that the
reusable Chart.js components must compose into? This becomes the "approved master prototype"
referenced by issue #94's last acceptance criterion.

**Throwaway.** Delete this whole folder + the two `// PROTOTYPE #94` lines in
`app/pages/plans/[id].vue` once a composition wins. The four chart components here are the
real deliverable of #94 — fold the winning ones into `app/components/plan/chart/` (rewritten to
production standard: no `any`, source colors through the design system, typed props/emits).

## How to view

`npm run dev` → open a plan → **Overview** tab. Switch variants with the floating bar at the
bottom (or `←` / `→`), or via `?variant=A|B|C`. Toggle app light/dark to check both.

- **A — master-aligned (recommended):** KPI row → full-width net-worth spine → **Income /
  Investments / Liabilities** sections, each with a colored section header (dot + rule + "Add" pill)
  and a chart-plus-entity-list 2-col grid, matching artifact cb56a0f0. The entity lists ("income
  sources", "accounts", cost-of-borrowing) and "＋ Add" pills are **static placeholders** here — the
  clickable Entity Workspace + income-linking are separate issues, not #94. #94 owns only the charts.
- **B — Uniform dashboard:** no hero; four equal-weight cards in a 2×2 grid, each with a caption stat.
- **C — Narrative report:** verdict banner (green/red) + single reading column, full-width charts
  with prose intros in journey order.

## Layout (locked to Variant A)

**Issues banner** (only when problems: shortfall / debt-never-paid / retirement-never-reached) →
KPI row → net-worth spine → **Income** (income-vs-expenses + sources list + projected-retirement-income
vs goal) → **Spending** (working-vs-retirement expense breakdown + expenses list) → **Investments**
(balances + accounts) → **Liabilities** (debt paydown + cost of borrowing). Section headers: colored
dot + rule + static "＋ Add" pill. Every section is a chart + its entity list.

`ExpenseBreakdown` shows two stacked bars — **while working** vs **in retirement** — split on both
axes (essential/discretionary × fixed/variable), today's dollars. Working = `is_retirement_only ? 0 :
base`; retirement = `base × retirement_spending_percentage` (picks up retirement-only expenses). Caption
shows the % change. This absorbed the earlier standalone working-vs-retirement bar.

## Charts (the #94 deliverable)

`charts/`: `NetWorthSpine.vue`, `IncomeVsExpenses.vue`, `RetirementIncome.vue`, `ExpenseBreakdown.vue`,
`DebtPaydown.vue`. Journey charts take `states: OrchestratorState[]`; `ExpenseBreakdown` takes
`expenses: Expense[]` (single-instant composition, the one non-journey chart). Colors read live from
palette.ts skin CSS vars + the local series palette via `usePrototypeSkin`, light/dark safe. Spine
bands grouped by asset **category** per CONTEXT.md.

**Cut:** contributions-vs-growth — the per-year "growth" metric conflated market return with
withdrawals (went negative in drawdown) and told no story. Revisit only as a *cumulative* crossover
area chart if wanted. **Deferred:** before/after-retirement expense split (needs sim semantics for
how expenses change at retirement — not cheap).

## Reference

Colors + composition follow the approved **master prototype** artifact `cb56a0f0`
("Calcura · Plan Detail — Master Prototype"). Series hues: tax-deferred=blue, taxable/brokerage=green,
roth/tax-exempt=violet, cash=amber, debt=red, net-worth line=ink. Band fills at ~0.82 opacity.

## Known prototype shortcuts (fix on fold-in)

- **Series colors live in `usePrototypeSkin.ts`, NOT palette.ts.** The master palette needs violet +
  teal, which `palette.ts` has no token for. On fold-in, #94 should add real chart-series tokens to
  `palette.ts` (light + dark) and delete the local `SERIES` map.
- **Canvas text/grid use literal light/dark values (`ink()`), not `getComputedStyle` on skin vars.**
  Reading CSS vars at compute time races the `html.dark` class flip and lagged the chart text one
  theme-toggle behind. `ink()` selects literals off `colorMode` — race-free. Fold-in should keep this
  property (canvas can't be reactive to CSS vars the way DOM elements are).
- Retirement marker is a hand-drawn canvas plugin. Production should use `chartjs-plugin-annotation`
  (not currently a dependency) or a documented equivalent.
- Chart callbacks/plugins use `any` — prototype only.
- Spine is accumulation-only here (sim currently stops at retirement). CONTEXT.md:156 wants the
  full-lifespan accumulation→drawdown spine; comes for free once drawdown states exist.

## Verdict

_TODO (maintainer): which variant won, and which bits to steal from the others?_
