# Prototype: fold Simulation into the Entity Workspace (issue #102)

**Throwaway.** Delete `app/pages/prototype/` + `app/components/prototype/` once decided.
Do not typecheck. Mock data only.

## Question
After dropping the Simulation tab (locked: final tabs = Overview + Report), how should
Command-Sequence management (sequence tabs + draggable command rows + is_active/ordering
+ compare charts) be hosted, and how is it opened?

## Where it landed — CONSOLIDATED single view
Route: `/prototype/workspace-sim` (variant switching removed).

- **The editor lives INSIDE a wide drawer** (~1100px). Full management — sequence tabs,
  ordering toggle, **Expand all / Collapse all**, drag-reorder, and the rich rows — is in the
  drawer. Drawer body starts with the real typed create buttons (`PlanChildCreateButtonList`)
  so **Add entity lets you pick the type**; footer = **Done**.
- **Entry point = top-right "Manage simulation" button** (label under review — see grill).
  Bottom summary card deferred (user may add later; `summary` mode kept in `ManageBody`).
- **Rows reuse the REAL rich line-items** — `Income/Expense/Debt ListItem` (which wrap
  `common/RichListItem.vue`). Not re-created. Per-row expand/collapse mirrors `Sequence.vue`.
- **Entity edit** goes through the real `workspaceStore.open()` deep-link (rich item → drawer).

## Known gaps / next round
- Only income/expense/debt rows are mocked (those 3 rich items verified). Real build wires all 9.
- Compare charts are CSS placeholders, not real Chart.js.
- The Simulation card can still feel dense — consider collapsing compare-charts by default,
  or a header-level collapse so the card opens compact and expands to manage.
- **Empty/initial state** (zero sequences or zero commands) still not mocked.
- Rich-item edit currently opens a mock drawer; real build reuses the actual `EntityWorkspace`.

## Follow-ups (from handoff — for the real build)
- Rewrite `CONTEXT.md:172-186` "Three views" (command editor no longer its own view) + `:179`.
- Delete dead stub `app/components/plan/Simulation.vue` (file its own cleanup issue).
- Re-scope GitHub #102 to this redesign.
