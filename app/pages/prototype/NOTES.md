# Prototype: fold Simulation into the Entity Workspace (issue #102)

**Throwaway.** Delete `app/pages/prototype/` once decided. Do not typecheck.
Runs over a **real plan** — no mock data.

## Question
After dropping the Simulation tab (final tabs = Overview + Report), how is command-sequence
management hosted, and how do you add entities — on **mobile** especially?

## Where it landed
Route: `/prototype/workspace-sim?planId=<real plan id>` — a thin clone of `pages/plans/[id].vue`.

- **Reuses the real components with real data**: `Overview.vue` (mobile-aware — per-section
  add pills + account dropdown), `EntityWorkspace.vue` (the mobile bottom-sheet drawer),
  `CommandTabber` + `Sequence` (the real sequence editor with rich rows / expand-collapse /
  reorder / is_active), `LazyPlanTable` (Report). Same data + simulation wiring as `[id].vue`.
- **Manage simulation** = top-right button → drawer hosting the real `CommandTabber`
  (sequence CRUD + activation/ordering only; entity config stays in `EntityWorkspace`).
- **Add entity (mobile-first)** = a floating **＋ FAB** (bottom-right) → responsive sheet
  listing the 9 entity **types** as full-width tappable rows → `workspace.openCreate()` →
  real create drawer. Replaces the `ChildCreateButtonList` button group that overflowed.
- **Mobile**: both new drawers use `useNavMode().isMobile` → `placement bottom` / 85–70%
  height, matching `EntityWorkspace`.

## Verify (user runs dev server)
`/prototype/workspace-sim?planId=<id>` while logged in. Desktop: Overview real data, Manage
opens CommandTabber (right), FAB opens type picker (right) → create form. Mobile (devtools
responsive): FAB + both drawers are bottom sheets, nothing overflows, per-section adds work.

## Open / deferred
- **Button label** "Manage simulation" is a placeholder — grill deferred (workbench vs
  compare vs build; "simulation" may be dead vocabulary per CONTEXT.md glossary).
- Empty/zero-sequence state not built.
- Bottom summary "Simulation" card deferred (user may add later).

## Follow-ups (real build)
- Rewrite `CONTEXT.md:172-186` "Three views" + `:179` (command editor no longer its own view).
- Delete dead stub `app/components/plan/Simulation.vue` (own cleanup issue).
- Re-scope GitHub #102 to this redesign.