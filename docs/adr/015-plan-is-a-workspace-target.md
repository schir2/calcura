# ADR 015: The Plan is a Workspace target; creating a plan is a separate surface

**Status:** Accepted
**Date:** 2026-07-13
**Supersedes:** [ADR 012](012-retire-legacy-modal-form-stack.md)'s closing carve-out
**Completes:** [ADR 011](011-strategy-input-stacked-rows.md)'s outstanding `FormGoals` follow-up

## Context

[ADR 012](012-retire-legacy-modal-form-stack.md) retired the legacy modal-form stack and
established the [[Entity Workspace]] as the only surface for creating or editing a plan entity.
It closed with an explicit exception:

> *"The plan entity's own `CreateForm.vue` / `UpdateForm.vue` are **not** part of this stack.
> A plan is not a Workspace domain; those stay."*

That exception is now the last of the legacy stack still standing, and it is the source of the
problems it was meant to sidestep. The plan is still edited through a three-step `n-modal`
(`plan/CreateForm.vue`, `plan/UpdateForm.vue`, sharing `FormProfile` / `FormSettings` /
`FormGoals` + `FormSteps`), reached from three different places. It is dismissed by clicking
away, it jumps as steps of different heights swap in, and its Previous/Next chrome is heavy for
what it collects.

The exception also holds two other decisions hostage. `common/RadioCard.vue` survives **only**
because `plan/FormGoals.vue` still uses it for the retirement-strategy picker — ADR 011 retired
that control everywhere else in favour of `StrategyRows`, and named migrating `FormGoals` as its
outstanding follow-up.

Two questions were tangled together and needed separating:

1. **Where do you *edit* a plan?** The instinct to give the plan its own bespoke surface fights
   the one-surface principle. If a user must hunt for a different place to change the inflation
   rate than to change an income, the app is chaotic.
2. **Where do you *create* a plan?** Editing and creating a plan are genuinely different acts:
   editing is a lever you pull while watching a projection react; creating is a once-per-plan
   act performed before any projection exists.

## Decision

### 1. The Workspace is the single editing surface — for the plan too

The plan becomes a **Workspace target**, alongside the nine entities. One interaction the user
learns once: *click a thing → drawer → edit → save.*

The plan is nonetheless **not an entity**. `ModelName` is the Postgres `model_name` enum on the
**`command` table** — it is the command system's *target* type, and a command targeting "the
plan" is meaningless. **The plan must never be added to `model_name`.** The workspace store's
target therefore widens from a bare `ModelName` to a discriminated union — roughly
`{kind: 'entity', model: ModelName, id}` versus `{kind: 'plan', id}`. No migration required.

**Left pane — three tabs, no scrolling in any of them:**

| tab | fields |
|---|---|
| **Rates** *(default)* | `inflation_rate`, `tax_rate`, `growth_rate` |
| **Goal** | `retirement_strategy` + its dependent fields, via `StrategyRows` |
| **Timeline** | `year`, `age`, `life_expectancy`, `growth_application_strategy` |

Rates is the default tab because rates are what actually get adjusted — inflation because users
want to model different regimes, tax rate because it is a manual stand-in for a value that would
eventually be derived. Goal is second: `StrategyRows` collapses it to only the selected
strategy's fields. Timeline is the cold tab.

**Right pane — the [[Plan Workspace projection]]:** the [[Verdict hero]] plus the net-worth
[[Trajectory (spine)]], rendered in [[Baseline-vs-edited delta (#107)]] form. An entity's
projection is its own balance curve; the plan has no balance of its own, so its projection is the
verdict and the whole trajectory. This is what makes plan editing *interactive* — dragging
`retirement_age` flips the verdict live, against a frozen dashed baseline that editing-in-place
could never show.

**`plan.tax_strategy` is excluded** as a non-lever: the `income_tax_strategy` enum has exactly one
value (`'simple'`), so there is nothing to choose.

**`plan.growth_rate` was excluded here as dead** — persisted but never read, since every
`config.growth_rate` a manager reads is that *entity's* own rate. It has since been repurposed
(#146) as the **default investment return seeded into newly created investment accounts**
(brokerage / IRA / Roth / HSA / 401k), and now lives on the **Rates** tab. It is a *seed, not a
source*: changing it never rewrites an existing account. It is deliberately **not** applied to
income or expense, whose `growth_rate` means a raise rate and a cost-inflation rate respectively.

**`plan/UpdateForm.vue` is deleted**, and with it the last consumer of `common/RadioCard.vue`,
which is also deleted — completing ADR 011.

### 2. Creating a plan is a separate surface: a page, not a modal

`plan/CreateForm.vue` is deleted. Creating a plan moves to a real page at **`/plans/new`**.

This is not a third editing surface. The wizard **creates the container**; the Workspace **edits
what is inside it**. The distinction is legible to a user in a way that "sometimes the modal
means create and sometimes it means edit" never was.

Crucially, **the wizard's job is not to collect plan fields.** Every plan field already has a
sensible default (`planDefaults`), and ADR 014 seeds `age` / `life_expectancy` from the user
profile — so the app can produce a complete, valid plan while asking *zero* questions. A wizard
that walks the user through fields they didn't need to answer is ceremony. What actually makes a
new plan useless is **having no entities**: no income means no contributions, a flat-zero spine,
and a verdict with nothing to judge.

So the wizard is **two steps**:

1. **Your goal** — `name` + retirement strategy (`StrategyRows`). Rates and Timeline sit behind
   a single collapsed **"Advanced"** disclosure, pre-seeded. Most users answer one real question.
2. **Your income** — embeds the **existing `income/WorkspaceForm.vue`**. Skippable.

Step 2 is **reuse, not a second surface**: `income/WorkspaceForm.vue` is a *component*, and
`EntityWorkspace` is merely one container for it. ADR 012 forbids a second form *implementation*;
rendering the same component in a wizard step honours that. Income is the right thing to ask for
because every tax-advantaged contribution is a percentage of one (ADR 006).

#### Amendment (2026-07-13): the plan row is created when step 1 completes, not on final submit

This ADR originally specified that the plan row be created **on final submit only**, and rejected
early creation as "a convenience nobody asked for". **That was wrong, and the two halves of this
section contradicted each other.** Building #144 surfaced it.

`income/WorkspaceForm.vue` is structurally coupled to a persisted plan. It calls `ensureSaved()` to
**write the income immediately**, by design — so that the "investments linked to this income" flow
(＋401(k) / ＋IRA / ＋Roth, the reason the Income Workspace exists; see ADR 006) has a real
`income_id` for the sub-forms to point at. Its live projection likewise calls
`simulateEntityPreview()`, which returns `null` without a loaded `planWithRelations`.

So "reuse the income Workspace form" and "persist nothing until final submit" are **mutually
exclusive**. Early creation is not a convenience — it is a **precondition** of the reuse this same
decision mandates.

**Therefore: completing step 1 creates the plan.** Step 2 then runs the income form fully
unmodified — live projection and linked accounts included, which is the best possible thing to
have during onboarding ("401(k) at 6% of this salary" entered alongside the salary). Skip and Save
both land on `/plans/[id]`.

The orphan risk this originally feared is largely illusory: bailing at step 2 leaves a plan with no
entities, which is **byte-for-byte what completing the wizard and skipping step 2 produces anyway**.
It is a legitimate, visible, deletable plan — not corrupt data. Abandoning during step 1 still
creates nothing. No draft state and no resumability machinery are introduced.

### 3. Plan #2 is a Duplicate, not a wizard run

The plans index promises *"Compare your retirement scenarios side by side"*, but `PlanCard` emits
only `update` and `delete`. Authoring a second scenario today means re-entering everything —
every income, account, and debt — to change one number.

**A plan is a scenario, and scenarios are made by cloning and tweaking.** `Duplicate` deep-copies
the plan and all nine entity sets. This is the real "create plan #2" path, and it is what makes
the wizard the once-ever onboarding flow it should be, rather than a toll gate on every variation.

## Alternatives considered

- **Plan editing inline on the Overview** (levers next to the verdict they move). Rejected: it
  creates a second place to edit things, and users would have to learn *which* settings live in
  the drawer and which live on the page. The consistency of one surface beats the proximity of
  the lever — especially since plan fields are edited *less* often than entity fields, so they do
  not earn prime real estate.
- **Adding `'plan'` to the `model_name` enum** so the plan is just a tenth Workspace domain.
  Rejected: `model_name` is the `command` table's target type. Commands act on entities; the
  pollution would be permanent and the migration irreversible in practice.
- **A three-step wizard collecting Timeline / Goal / Rates.** Rejected: it is the current modal
  with nicer chrome. Every one of those fields has a default; asking for them is ceremony that
  would earn the same complaint again.
- **A wizard that also collects accounts, debts, and expenses.** Rejected: entity creation would
  then live in two places, which is precisely the chaos this ADR exists to prevent. One income is
  the minimum that makes a plan non-trivial; the Overview's empty states handle the rest.
- ~~**Creating the plan row on step 1 so the wizard is resumable.** Rejected: it trades a bail-out
  problem (orphaned rows needing garbage collection) for a convenience nobody asked for in a
  two-step flow.~~ — **Reversed by the amendment above.** Early creation turned out to be a
  precondition of reusing the income Workspace form, not a convenience. The rejection did not
  survive contact with the component.
- **A "deferred" mode on the income Workspace form** that emits values instead of persisting them,
  preserving create-on-final-submit. Rejected: it would require switching *off* the linked-accounts
  flow and the live projection — reusing the component with half of it disabled — while adding
  persistence branching to a form shared by every other surface.

## Consequences

**Positive:**
- One editing surface, with **no exceptions left** — ADR 012's rule finally holds literally.
- `common/RadioCard.vue` and the last four legacy plan components leave the repo; ADR 011 completes.
- Plan editing becomes genuinely interactive: drag a lever, watch the verdict flip.
- The create flow stops being a modal, killing the click-away-dismiss and layout-jump complaints
  structurally rather than by patching them.

**Negative / Trade-offs:**
- **Duplicate is a bigger job than it sounds** — nine entity tables plus command sequences and
  their commands, all needing fresh IDs and re-pointed `income_id` foreign keys (ADR 006). It is
  tracked as its own issue and is not a prerequisite for the wizard.
- The workspace store's target type widens, touching every existing `workspace.open(...)` call
  site. Mechanical, but it is a breaking change to a shared store.
- ~~`plan.growth_rate` is left in the schema as a known-dead column pending its own cleanup
  decision (drop it, or repurpose it as the default growth rate for newly added accounts).~~ —
  **Resolved by #146:** repurposed as the default investment return seeded into new investment
  accounts, and surfaced on the Rates tab. Not dropped.

## Related

- [ADR 011](011-strategy-input-stacked-rows.md) — `StrategyRows`; this ADR completes its follow-up.
- [ADR 012](012-retire-legacy-modal-form-stack.md) — one editing surface; this ADR removes its
  final exception.
- [ADR 014](014-plan-seeds-from-profile.md) — the profile seeds a new plan, which is why the
  wizard has so little to ask.
- CONTEXT.md → "Workspace target — the Plan is one, but it is not an Entity".
