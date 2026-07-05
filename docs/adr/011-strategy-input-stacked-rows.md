# ADR 011: Strategy-input control — stacked rows with inline reveal, over side-by-side cards

**Status:** Accepted
**Date:** 2026-07-05

## Context

Several domain forms ask the user to pick a *strategy* (an enum) and then fill in only
the field(s) that strategy needs — e.g. an investment's contribution strategy
(`fixed` / `percentage_of_income` / `max`), and the richer tax-deferred case
(`none` / `until_company_match` / `percentage_of_income` / `fixed` / `max` **plus** a
conditional employer-match sub-section with its own strategy enum and parameters).

This pattern is currently implemented with `CommonRadioCard` — three or more cards laid
out **side by side**, each card nesting its own amount input. It appears in ~11 forms
(brokerage, hsa, tax_deferred, roth_ira, ira — each Create + Update — plus `plan/FormGoals`).

The [[Entity Workspace]] redesign (#95) renders these forms in a **two-pane drawer** whose
form column is ~360px wide. Side-by-side cards do not fit that width: they wrap, the nested
sliders overflow/overlap, and the complex tax-deferred case (5 strategies + employer match)
is unworkable. We prototyped four options at `/prototype/strategy-input` (segmented buttons,
dropdown, stacked rows with inline reveal, summary-first disclosure).

## Decision

**Strategy selection uses a vertical list of radio rows in a bordered container; the
selected row highlights and expands its field(s) inline** (prototype "Variant C"). The
revealed fields use `n-form-item` labels + the number+slider control
([[Workspace input controls — number + slider, number is authoritative]]). Nested
strategies (the tax-deferred employer match) reuse the *same* row pattern recursively.

This is the **canonical pattern for all ~11 forms** currently using `CommonRadioCard`;
`CommonRadioCard` is retired for strategy selection.

## Considered Options

- **Side-by-side cards (`CommonRadioCard`)** — the status quo. Rejected: breaks at ~360px,
  can't hold the tax-deferred nesting.
- **Segmented button-group + conditional field** — compact, but the labels truncate at
  narrow widths and it reads less scannable as strategy count grows to 5.
- **Select dropdown + conditional field** — most compact, but hides the options behind a
  click; poor for a first-time user comparing strategies.
- **Summary-first disclosure** — read-optimized, but adds a click to every edit.
- **Stacked rows with inline reveal (chosen)** — one column, scannable, each option shows a
  one-line hint, scales from 3 to 5+ strategies and nests cleanly.

## Consequences

Migrating the ~11 forms off `CommonRadioCard` is follow-up work beyond the #95 brokerage
proof; each domain's form moves to the shared control as its Workspace slice lands.
