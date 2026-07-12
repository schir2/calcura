# ADR 012: Retire the legacy modal-form stack

**Status:** Accepted
**Date:** 2026-07-11

## Context

Before the [[Entity Workspace]], every domain edited its entities through a pair of modal forms: `<domain>/CreateForm.vue` and `<domain>/UpdateForm.vue`, reached from `<domain>/List.vue`, with `<domain>/TemplatePicker.vue` offering a [[Templates|Template]] as a starting point. That stack is what the Workspace redesign replaced.

The migration is **complete**. All nine domains have a `WorkspaceForm.vue`, all nine are registered in `EntityWorkspace`'s `formComponent` switch, and all nine are listed in `WORKSPACE_ENABLED_MODELS`. Create and edit both route through the drawer.

But the old stack was never deleted, and the documentation still describes it as a live fallback. `entity-workspace-implementation.md` says *"Un-migrated domains keep working through the legacy modal until their turn"* — true when written, false now that no domain is un-migrated. So ~62 component files sit in the repo looking load-bearing while being unreachable.

This became visible while auditing typography (`docs/design/typography-audit.md`): roughly **40% of the app's styling debt lives in components nothing renders**, which would have made any styling pass half wasted.

## The proof that the stack is dead

Not "appears unused" — provably unreachable:

1. `WORKSPACE_ENABLED_MODELS` (`app/stores/workspaceStore.ts`) lists nine models.
2. The `model_name` Postgres enum has **exactly** those nine values. `ModelName = Enums<'model_name'>`, so the set is **total** — `WORKSPACE_ENABLED_MODELS.includes(model)` is `true` for every value the type can hold.
3. `Overview.vue`'s `openCreate()` early-returns into `workspace.openCreate(...)` whenever that check passes **and** a plan is present. The fallthrough that opens the legacy modal is only reached when `props.plan` is falsy.
4. `Overview` is only ever mounted **inside a `v-if` on the very object it passes as `:plan`** (both on the plan detail page and the workspace-sim prototype). The plan cannot be absent while the component is mounted.

Therefore the modal state is never set, the `n-modal` never opens, and the nine `CreateForm` components it renders are never instantiated. They are *statically imported* — so they sit in the bundle and any naive unused-file tool reports them as "used" — but **dynamically unrenderable**.

The `UpdateForm`s were already orphaned when #102 pointed each Rich List Item's edit affordance at the drawer. The `List.vue` files are referenced by nothing (the simulation drawer renders `*ListItem`, not `*List`). The `TemplatePicker`s were only ever reachable through `debt/List.vue`, itself unreferenced.

**This proof depends on the enum staying total.** If a tenth `model_name` is ever added and *not* added to `WORKSPACE_ENABLED_MODELS`, the guard stops being total — but by then the legacy modal it would have fallen back to no longer exists. **Adding a new domain therefore means building its Workspace form, not resurrecting a modal.** That is the intended constraint, and it is why `WORKSPACE_ENABLED_MODELS` should not be quietly deleted as "always true".

## Decision

**Delete the legacy modal-form stack.** Per domain: `CreateForm.vue`, `UpdateForm.vue`, `List.vue`, `TemplatePicker.vue`. Plus the unreachable create path that referenced them (`Overview.vue`'s create-form registry and modal, `plan/ChildCreateButtonList.vue`), and the orphaned `ProjectionCard.vue` / `ProjectionChart.vue` pairs in `brokerage` and `debt` — both of which import a `Form.vue` that **does not exist in the repo**, and so could not compile if anything rendered them.

The **[[Entity Workspace]] is the only surface for creating or editing a plan entity.** There is no modal fallback.

### Templates are kept; only their UI goes

[[Templates]] — the `*_template` tables and `processTemplate()`'s *template-over-defaults* merge — are a first-class product concept. Their only UI was `TemplatePicker.vue`, which is being deleted.

**Nothing is lost today**, because the pickers were already unreachable: the capability has not worked for some time. But the concept must not be silently dropped. So:

- **Keep** the `*_template` tables and `processTemplate()`.
- **Delete** the picker components.
- Rebuilding template selection *inside* the Workspace is tracked as a follow-up. It needs the workspace store's create action to accept seed values — which does not exist yet, and is precisely why `entity-workspace-implementation.md` said "Leave them" at the time.

### What this supersedes

- The **Create Form** and **Edit Form** glossary entries in `CONTEXT.md` — these named `CreateForm.vue` / `EditForm.vue` per domain as the canonical form components. The canonical form component is now `<domain>/WorkspaceForm.vue`.
- The decision **"Create and Edit forms are separate components"** (issues #20/#21). It is not *wrong* — the Workspace form still branches on create vs edit mode — but the split is no longer expressed as two component files.
- `entity-workspace-implementation.md`'s framing of the legacy modal as a live fallback, and its "Leave them" instruction about the TemplatePickers.
- ADR 011 retired `CommonRadioCard` *for strategy selection*; its last remaining consumers were these legacy forms, so the component itself now goes with them.

## Alternatives considered

- **Leave the stack in place.** Rejected: it is dead weight that reads as live code, it misleads both humans and agents (the two `CLAUDE.md` files still cite `DebtList.vue` and `<IncomeCreateForm>` as live patterns), and it carries ~40% of the app's styling debt into every future audit.
- **Keep the TemplatePickers only.** Rejected: they are unreachable too, so keeping them preserves no capability — only the *appearance* of one. Recording the follow-up preserves the intent honestly; leaving dead files does not.
- **Drop Templates entirely.** Rejected: the merge semantics and the `*_template` tables are sound and cheap to keep. The gap is a UI seam (`openCreate(seed)`), not a design flaw.

## Consequences

**Positive:**
- One editing surface, not two. The Workspace is the answer to "how do I add or change an entity", with no exceptions to learn.
- ~62 files and ~40% of the typography debt leave the repo, making the type-scale work (ADR 013) tractable.
- The docs stop describing a fallback that cannot execute.

**Negative / Trade-offs:**
- **Templates has no UI until the follow-up lands.** This is a *recorded* gap, not a regression — the pickers were already unreachable — but the concept is dormant in the meantime.
- Adding a tenth domain now *requires* building its Workspace form. There is no modal to fall back on. This is intended (see the proof above), but it makes the Workspace a hard dependency for any new domain.
- Deleting `common/RadioCard.vue` removes the last side-by-side strategy control. ADR 011's `StrategyRows` is the only strategy input.

## Guidance

- Create and edit an entity through the [[Entity Workspace]] drawer. Never add a modal form.
- A new domain is not "done" until it has a `WorkspaceForm.vue`, a projection readout, both registered in `EntityWorkspace`, and its name in `WORKSPACE_ENABLED_MODELS`.
- `plan/Table.vue` is **live** — it is the Report tab. It is not part of this stack and is not deleted.
- The plan entity's own `CreateForm.vue` / `UpdateForm.vue` are **not** part of this stack. A plan is not a Workspace domain; those stay.
