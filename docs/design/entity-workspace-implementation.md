# Entity Workspace — implementation guide (per-domain build-out)

**Status: the migration is COMPLETE (2026-07-11).** All nine domains have a `WorkspaceForm.vue`
and are registered in `EntityWorkspace`'s `formComponent` / `projectionComponent` switches.
Create **and** edit route through the drawer for every domain, and the live preview works in
create mode too (§3).

**There is no legacy modal fallback any more.** [ADR 012](../adr/012-retire-legacy-modal-form-stack.md)
deleted the whole legacy stack — every `CreateForm.vue`, `UpdateForm.vue`, `List.vue`, and
`TemplatePicker.vue`, plus `ChildCreateButtonList.vue` and the `WORKSPACE_ENABLED_MODELS` list
that used to select between drawer and modal. Passages below that describe the modal as a live
path, mention that constant, or tell you to "leave" the TemplatePickers, are **historical** and
no longer apply.

This guide is now a reference for **adding a new domain**, not for converting existing ones.
A new domain is not "done" until it has a `WorkspaceForm.vue` and a projection readout, **both
registered in `EntityWorkspace`** — that registration is the only switch, and there is nothing
to fall back on if you skip it.

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
| `app/stores/orchestratorStore.ts` | `simulateEntityPreview(modelName, entity, commandSequence)` — the what-if engine (handles edit **and** create). Exports `PREVIEW_TEMP_ID` — the sentinel id create-mode forms pass for the not-yet-persisted entity. |

---

## 3. Data flow (how the live preview works)

```
user edits a field in <XxxWorkspaceForm>            (local reactive `model`, NOT persisted)
   → watch(model) debounced 300ms
   → orchestrator.simulateEntityPreview(modelName, {...model, id: id ?? PREVIEW_TEMP_ID}, commandSequence)
        clones planWithRelations; EDIT mode substitutes THIS entity's config with the form values;
        CREATE mode appends the not-yet-persisted entity (keyed by PREVIEW_TEMP_ID) AND injects a
        synthetic active 'process' command so it actually simulates (see below);
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

**Create-mode preview (why the synthetic command matters).** The simulation loop only processes
entities that are referenced by an *active command* in the sequence (`getManagerById(model_name,
model_id)`). On real insert a DB trigger creates that `'process'` command; during a create-mode
*preview* nothing is persisted, so `simulateEntityPreview` appends the working entity to the
relations **and** synthesizes a matching active `'process'` command in a cloned sequence.
Without both, a brand-new entity simulates to a flat line (never contributes/grows). This is
already handled in `orchestratorStore.ts` — the only per-domain requirement is that the form
passes `id ?? PREVIEW_TEMP_ID` (not `[]`) in create mode.

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
     `orchestrator.simulateEntityPreview('<domain>', {...model, id: id ?? PREVIEW_TEMP_ID}, commandSequence)`
     and `emit('preview', states)`. Works in **both** create and edit mode — import
     `PREVIEW_TEMP_ID` from `~/stores/orchestratorStore` and pass it when `id` is null so the
     not-yet-persisted entity is simulated (§3). Only emit `[]` when there is no `commandSequence`.
     Do **not** early-return on `id === null` (the old brokerage copy did — it's been fixed).
   - On submit: `patch` (edit) or `create` + `commandSequenceStore.fetchByPlan(planId)` (create),
     then `emit('saved')`.
2. **Create `app/components/<domain>/Projection.vue`** (or reuse `EntityProjection` only if the
   domain is a growth investment). Design the domain's readout (§6).
3. **Register both in `common/EntityWorkspace.vue`** — add a `case '<domain>':` to the
   `formComponent` switch, and add a parallel `projectionComponent` switch (see §7 — this
   dispatch must be added; today the projection is hard-coded to investment).
4. **Wire the entry points.** Create calls `workspace.openCreate('<domain>', planId)`; the Rich
   List Item's edit affordance calls `workspace.open('<domain>', id)`. Nothing else is needed —
   step 3's registration is the only switch.

   > **There is no fallback.** Before [ADR 012](../adr/012-retire-legacy-modal-form-stack.md), a
   > `WORKSPACE_ENABLED_MODELS` list selected between the drawer and a legacy `n-modal` +
   > `CreateForm`. Both the list and the modal are gone. If you skip step 3, the drawer opens and
   > says the entity type has no workspace — it does not quietly open an old form.
5. Leave the education panel as the shared placeholder (do not write real copy — #106).

**Order note:** a domain isn't "done" until **both** its `formComponent` and `projectionComponent`
cases exist — with one missing, the drawer opens half-empty. Do them together.

**Templates:** the legacy `<domain>/TemplatePicker.vue` is gone (ADR 012); the `*_template` tables
and `processTemplate()` are **kept**. Template selection is now restored *inside* the Workspace
(#136), not as a standalone picker. The plumbing is shared and already done:
`workspace.openCreate(model, planId, seed?)` carries optional seed values, and the drawer threads
them into the form as `:initial-values`. To add template selection to a domain:

1. Give its `WorkspaceForm` an `initialValues?: Partial<T> | null` prop and merge it over the create
   defaults **in create mode only** — `{...defaults, ...(id === null ? initialValues : undefined)}`.
   (The ira / roth_ira / tax_deferred forms already accept `initialValues` from income-linking.)
2. In create mode (`id === null`), fetch templates from `use<Domain>TemplateStore` and render a
   "Start from a template" `n-select`; on select, set `model.value = processTemplate(defaults, template)`.
3. Seed real `*_template` rows via a migration so the picker isn't empty.

`app/components/debt/WorkspaceForm.vue` is the reference implementation. See the [[Templates]]
glossary entry.

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

**All build-out issues are complete.** The per-domain migration is finished; these are kept for
provenance.

- **#95** — the shell + brokerage proof. Reference implementation.
- **#119** — HSA conversion. Second reference — the `fixed | max`, not-income-linked case, and the
  first to prove create-mode preview end to end.
- **#101** income · **#102** ListItem wiring · **#114** debt · **#115** expense ·
  **#116** tax_deferred · **#117** IRA · **#118** Roth IRA · **#120** cash_reserve — the
  per-domain build-outs. **Done.**
- **#126** — command-sequence management folded into a drawer; the Simulation tab dropped.

**Still open:**
- **#106** — education panel content (shared placeholder until then). **#107** — baseline-vs-edited delta.
- Template selection inside the Workspace (`openCreate` seed values) — see [ADR 012](../adr/012-retire-legacy-modal-form-stack.md).

**Decisions:** **ADR 006** income_id linkage · **ADR 010** HSA not linked · **ADR 011** strategy-input
control · **ADR 012** legacy stack retired, Workspace is the only editing surface.