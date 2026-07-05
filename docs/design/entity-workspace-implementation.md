# Entity Workspace — implementation guide (per-domain build-out)

**Status:** the shell + the brokerage proof are built (#95). This guide tells the next agent
how to convert the remaining domain forms into Workspace drawers: investments
(#116 tax_deferred, #117 IRA, #118 Roth IRA, #119 HSA, #120 cash_reserve), income (#101),
debt (#114), expense (#115), and the ListItem wiring (#102).

Read alongside: `CONTEXT.md` ("Entity Workspace", "Uniform Workspace across all domains",
"Projection readout is per-domain", "Strategy-input control — Variant C", "Workspace input
controls"), `docs/design/plan-detail-redesign.md`, and ADR 011.

---

## 1. What's uniform vs. per-domain

**Uniform (already built — reuse, do not fork):**
- The drawer shell + two-pane/bottom-sheet layout — `common/EntityWorkspace.vue`
- The open/close API — `stores/workspaceStore.ts`
- The strategy-input control — `common/StrategyRows.vue` (ADR 011)
- The number+slider control — `base/NumberSlider.vue` (`<base-number-slider>`)
- The live what-if preview mechanism — `orchestratorStore.simulateEntityPreview()`
- The submit-persists-then-whole-plan-resimulates behavior

**Per-domain (each domain supplies these three):**
1. **Fields** — its own `WorkspaceForm.vue` (left pane).
2. **Projection readout** — its own right-pane readout/chart. Investment reads out
   "grows to / contributed-vs-growth / lasts-or-runs-out"; debt = payoff year + cumulative
   interest; expense = cost-over-time with inflation; cash = buffer / months covered.
   **There is no one-size readout** — design each per domain (prototype-and-pick).
3. **Education copy** — placeholder for now (real content deferred to #106).

---

## 2. File map (reference implementation = brokerage)

| File | Role |
| --- | --- |
| `app/stores/workspaceStore.ts` | Drawer state: `isOpen`, `modelName`, `id`, `planId`, `mode`; `open(model, id)`, `openCreate(model, planId)`, `close()` |
| `app/components/common/EntityWorkspace.vue` | The drawer. Dispatches the form + projection by `modelName`; owns `previewStates` + `planAge`; renders the education placeholder. **Mounted once** in `app/pages/plans/[id].vue`. |
| `app/components/common/StrategyRows.vue` | Canonical strategy selector (ADR 011). `v-model` + `:options`, one value-named slot per strategy for its revealed field(s). |
| `app/components/base/NumberSlider.vue` | Paired `n-input-number` + `n-slider`; number authoritative, may exceed the slider soft cap. |
| `app/components/common/EntityProjection.vue` | The **investment** readout. Per-domain readouts are new sibling components. |
| `app/components/brokerage/WorkspaceForm.vue` | Reference form: full fields + `StrategyRows` + submit + live preview. Copy its shape. |
| `app/stores/orchestratorStore.ts` | `simulateEntityPreview(modelName, entity, commandSequence)` — the what-if engine. |

---

## 3. Data flow (how the live preview works)

```
user edits a field in <XxxWorkspaceForm>            (local reactive `model`, NOT persisted)
   → watch(model) debounced 300ms
   → orchestrator.simulateEntityPreview(modelName, {...model, id}, commandSequence)
        clones planWithRelations, substitutes THIS entity's config with the form values,
        runs the real PlanManager.simulate(), returns this entity's state[] (BaseState[])
   → emit('preview', states)
   → EntityWorkspace holds previewStates → passes to the projection component
   → projection re-renders live

user clicks Save
   → store.patch(id, update)  (edit)  OR  store.create(insert) + commandSequenceStore.fetchByPlan (create)
   → the plan page's existing watchEffect re-runs the FULL simulation → all charts/table update
   → emit('saved') → workspace.close()
```

Key point: **the form is submit-based** (nothing persists until Save). The live preview is a
*throwaway what-if simulation* over the working form values — it never writes. This matches
"edits update the specific projection; submit updates the whole plan."

`simulateEntityPreview` substitutes into `planWithRelations` by a `modelName → relations key`
map (`RELATION_KEY` in `orchestratorStore.ts`). All nine domains are already in that map;
no change needed there.

---

## 4. How to add a domain Workspace (step-by-step)

1. **Create `app/components/<domain>/WorkspaceForm.vue`** — copy `brokerage/WorkspaceForm.vue`
   and adapt. It must:
   - `defineProps<{ id: number | null; planId: number | null; commandSequence: CommandSequenceWithRelations | null }>`
   - `defineEmits<{ preview: [states: <DomainState>[]]; saved: []; cancel: [] }>` (typed emits — CONTEXT/ADR conventions)
   - Fetch by `id` on mount (edit) or start from defaults (create); autofocus the first field.
   - Render the domain's fields; use `<base-number-slider>` for rate/amount/percentage fields
     and `<common-strategy-rows>` for any strategy enum (see §5).
   - Recompute the preview (debounced) on `watch(model, …, {deep:true})` via
     `orchestrator.simulateEntityPreview('<domain>', {...model, id}, commandSequence)` and
     `emit('preview', states)`. Emit `[]` in create mode (no id → placeholder).
   - On submit: `patch` (edit) or `create` + `commandSequenceStore.fetchByPlan(planId)` (create),
     then `emit('saved')`.
2. **Create `app/components/<domain>/Projection.vue`** (or reuse `EntityProjection` only if the
   domain is a growth investment). Design the domain's readout (§6).
3. **Register both in `common/EntityWorkspace.vue`** — add a `case '<domain>':` to the
   `formComponent` switch, and add a parallel `projectionComponent` switch (see §7 — this
   dispatch must be added; today the projection is hard-coded to investment).
4. **Wire the ListItem** — in `<domain>/ListItem.vue`, change the "edit" affordance to
   `workspace.open('<domain>', entity.id)` and delete the old local `n-modal` + `UpdateForm`
   usage (that's issue #102's job, but do it for your domain as you convert it).
5. Leave the education panel as the shared placeholder (do not write real copy — #106).

---

## 5. StrategyRows (ADR 011) — the canonical strategy input

Replaces `CommonRadioCard` for every "pick a strategy, then show only its fields" input.

```vue
<common-strategy-rows v-model="model.contribution_strategy" :options="STRATEGY_OPTIONS">
  <template #fixed>
    <n-form-item label="Amount / yr" :show-feedback="false">
      <base-number-slider v-model="model.contribution_fixed_amount" :min="0" :max="23000" :step="500"/>
    </n-form-item>
  </template>
  <template #percentage_of_income>
    <n-form-item label="Percentage" :show-feedback="false">
      <base-number-slider v-model="model.contribution_percentage" :min="0" :max="50" :step="1"/>
    </n-form-item>
  </template>
  <!-- 'max' has no field → no slot -->
</common-strategy-rows>
```

- `:options` = `{value, label, hint?}[]`. The slot **name must equal the option `value`**; it
  renders inline under the selected row. Options with no field just omit the slot.
- **Nesting (tax_deferred employer match):** put a `<n-switch v-model="model.employer_contributes">`
  after the elective `StrategyRows`, then a *second* `StrategyRows` (its own options) shown when
  the switch is on. Same pattern recursively — see the #95 prototype history / CONTEXT "Variant C".

---

## 6. Projection readouts — per domain

The readout is **not shared**. Plain, non-expert language throughout (say "growth" not "yield",
"what you put in" not "principal"). All readouts are **lifespan-aware** — the engine simulates
accumulation *and* retirement drawdown (`PlanManager.simulate()` runs to `life_expectancy`,
flips `retired`, draws down, tracks shortfall — the old "#65/#66 gated" note is retired).

- **Investment** (built — `common/EntityProjection.vue`, reference): headline "Grows to $X",
  "N× what you put in", a contributed-vs-growth split bar, and the honest outcome —
  green "Still funding you at the end — $Y left" or red "Runs out at age A (year)". No warning
  icons; color carries the signal. Computes from `InvestmentState` fields
  (`contribution_lifetime`, `growth_lifetime`, `balance_end_of_year`); run-out age from `plan.age`.
- **Debt** (#114): payoff year + total/cumulative interest paid; paydown-to-zero curve.
- **Expense** (#115): cost over time with inflation; how retirement changes it
  (`is_retirement_only`, `retirement_spending_percentage`).
- **cash_reserve** (#120): buffer level / months-of-expenses covered over time (not growth).

For each new domain, prototype a few readout treatments and pick (the method that worked for
investment — see the prototype history). Keep it lean and truthful.

---

## 7. The projection dispatch (extension point to build)

Today `EntityWorkspace.vue` hard-codes `<EntityProjection>` (investment) for all domains and
passes `:states`, `:model-name`, `:plan-age`. When adding non-investment domains, generalize it
the same way as the form dispatch:

```ts
const projectionComponent = computed(() => {
  switch (workspace.modelName) {
    case 'brokerage': case 'tax_deferred': case 'ira': case 'roth_ira': case 'hsa':
      return EntityProjection            // investment readout
    case 'debt':   return DebtProjection
    case 'expense':return ExpenseProjection
    case 'cash_reserve': return CashProjection
    default: return null
  }
})
```

All projections take the same props (`states`, `modelName`, `planAge`) so the shell stays
generic. `previewStates` is `BaseState[]`; each projection casts to its own state type.

---

## 8. Income-linking (tax_deferred #116, IRA #117, Roth #118 only)

`percentage_of_income` strategies fund from **one specific income** via `income_id`
(ADR 006). The form must include an income picker — reuse `income/Selector.vue`
(`<IncomeSelector :incomes="incomeStore.list" v-model="model.income_id"/>`), shown when the
income-based strategy is selected. **Note the current IRA/Roth forms have no income picker —
add it.** tax_deferred's current form already has one; carry it over.

- **Not income-linked:** `brokerage` (uses total household income — deliberate, no picker),
  `hsa` (ADR 010), `cash_reserve`, `expense`, `debt`. Do **not** add income pickers to these.
- The income *side* of linking ("Investments linked to this income" inline) is #101 — separate.

---

## 9. Conventions & gotchas

- **Typed emits + snake_case data + skin tokens + NaiveUI** — follow `app/components/CLAUDE.md`.
  Use a NaiveUI component whenever one exists; Tailwind for layout only. No raw hex/`text-red-500`.
- **Component auto-import naming is directory-prefixed** — `common/EntityProjection.vue` →
  `<CommonEntityProjection>`, `common/StrategyRows.vue` → `<common-strategy-rows>`,
  `base/NumberSlider.vue` → `<base-number-slider>`. When in doubt, import explicitly (as
  `EntityWorkspace.vue` does).
- **`BaseNumberSlider` must be full-width** inside `n-form-item` (already fixed with `w-full`);
  if you build a variant, keep it or the slider collapses to just the handle.
- **`retirement_spending_percentage` and debt interest can exceed the slider's soft cap** — the
  number input is authoritative; never hard-limit via the slider (CONTEXT "Workspace input controls").
- **The Workspace is mounted once** in `plans/[id].vue`; ListItems only call `workspace.open(...)`.
  Never render a second inline config form in a ListItem (Q14=A).
- **Do not touch the simulation engine** in `models/` for form work.
- **Verify by running the app** (ask the user — do not start the dev server yourself): open a
  plan → Simulation → edit an entity → the projection updates live as you type; Save persists
  and the whole-plan charts move.

---

## 10. Related issues & decisions

- **#95** — the shell + brokerage proof (done). Reference implementation.
- **#101** — income Workspace + income-linking (one entity, two views).
- **#102** — wire Simulation ListItems to open the Workspace.
- **#114** debt, **#115** expense, **#116** tax_deferred, **#117** IRA, **#118** Roth IRA,
  **#119** HSA, **#120** cash_reserve — the per-domain build-outs.
- **#106** — education panel content (placeholder until then). **#107** — baseline-vs-edited delta.
- **ADR 006** income_id linkage · **ADR 010** HSA not linked · **ADR 011** strategy-input control.