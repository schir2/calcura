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

### `WORKSPACE_ENABLED_MODELS` goes too

The constant existed to answer one question — *"does this domain use the drawer, or fall back to the modal?"* Once there is no modal, the question has no meaning: the check was total, so it always answered "yes".

Its only two consumers were the create paths being deleted here, so it is removed with them. `EntityWorkspace` already degrades gracefully on its own when a domain has no registered form (*"This entity type has no workspace yet."*), which is the real guard — the constant was redundant with it.

**Consequence for a future tenth domain:** it must be registered in `EntityWorkspace`'s `formComponent` / `projectionComponent` switches. If it isn't, the drawer opens and says it has no workspace. It does not silently fall back to anything, because there is nothing to fall back to. **Adding a domain means building its Workspace form.**

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
- The `useCrudForm` composable, and the `useCrudFormWithValidation` → `useCrudForm` decision (#20). The legacy forms were its only consumers; every surviving form uses `useNaiveForm` from the NaiveUI module.

**`common/RadioCard.vue` survives.** ADR 011 retired it *for strategy selection*, and the legacy forms were most of its consumers — but **not all**: `plan/FormGoals.vue` still uses it for the retirement-strategy picker, and the plan forms are live (a plan is not a Workspace domain). Migrating `FormGoals` to `StrategyRows` is ADR 011's outstanding follow-up, not this ADR's job.

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
- A new domain is not "done" until it has a `WorkspaceForm.vue` and a projection readout, **both registered in `EntityWorkspace`'s `formComponent` / `projectionComponent` switches**. That registration is the only switch — `WORKSPACE_ENABLED_MODELS` is gone. Miss it and the drawer opens empty ("This entity type has no workspace yet"); it does not fall back to anything.
- `plan/Table.vue` is **live** — it is the Report tab. It is not part of this stack and is not deleted.
- ~~The plan entity's own `CreateForm.vue` / `UpdateForm.vue` are **not** part of this stack. A plan is not a Workspace domain; those stay.~~ — **Superseded by [ADR 015](015-plan-is-a-workspace-target.md) (2026-07-13).** The plan *is* a Workspace target (though still not an *entity* — it must never enter the `model_name` enum). `plan/UpdateForm.vue` is replaced by the plan's Workspace tabs; `plan/CreateForm.vue` is replaced by the `/plans/new` wizard. Both are deleted, along with `common/RadioCard.vue` — whose survival this ADR justified solely by `plan/FormGoals.vue`'s use of it. **This ADR's one-editing-surface rule now holds with no exceptions.**
