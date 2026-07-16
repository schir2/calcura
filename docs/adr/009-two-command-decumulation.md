# ADR 009: Retirement decumulation is command-driven, per-bucket taxed

**Status:** Accepted
**Date:** 2026-07-04

## Context

Issue #67 shipped a tax-naive retirement drawdown with a **hardcoded** tier array in
`PlanManager.withdrawFromSavings` (`taxable → tax_deferred → tax_exempt`, cash reserve never drawn)
and no tax on withdrawals. Issue #68 makes drawdown tax-aware and the withdrawal order
strategy-driven. Two design forks had to be resolved (grill session 2026-07-04):

1. **How is retirement-year tax computed?** The engine is entirely flat-rate today
   (`calculateTaxes(agi) = agi * tax_rate/100`), `income_type` is `ordinary`-only, and there is no
   bracket or cost-basis machinery anywhere.
2. **How is withdrawal order expressed?** The codebase already has a first-class ordering primitive —
   [[Command Sequence]] with `ordering_type` — but it governs *accumulation* order, not decumulation.

## Decision

**Per-bucket effective-rate tax through a single seam.** Withdrawal tax is a single effective rate
per account bucket applied to the whole withdrawal — no cost-basis tracking (gain-only taxation) and
no brackets. All tax routes through one `taxFor(amount, source)` function that generalizes today's
`calculateTaxes` (which becomes the `ordinary` case):

- `ordinary` → existing `tax_rate` — accumulation income **and** tax-deferred (401k/IRA/HSA) withdrawals
- `capital_gains` → new `capital_gains_rate` plan column (default `15`) — brokerage withdrawals
- `tax_exempt` / `cash` → 0 — Roth / cash-reserve withdrawals

Gross-up is closed-form **per bucket** as the order is walked: each bucket takes
`remaining_need / (1 - bucket_rate)`, capped at its balance, unmet need rolls to the next bucket; a
residual after the last bucket is the depletion shortfall.

**Command-driven decumulation via a two-command model.** `command.action` (previously `TEXT`, always
`'process'`, engine-ignored) becomes an enum `process | invest | withdraw`. Investment-category
entities (brokerage, tax_deferred, ira, roth_ira, hsa) emit a paired `withdraw` command on insert;
non-investment entities keep a single `process` command. The simulation filters commands by action per
phase. Withdrawal order is a **separate** `withdrawal_ordering_type` directive
(`predefined | bucket | custom`), independent of invest `ordering_type`; only `predefined`
(cash → taxable → tax-deferred → tax-exempt) ships first.

## Considered alternatives

- **Cost-basis / bracket tax realism** — rejected for #68: the single largest, most invasive change
  (touches every contribution path and account state shape) and incongruous next to a flat
  accumulation tax. Deferred to a future issue.
- **Plan-level `withdrawal_order` enum only** (no commands) — simpler, but bucket-level ordering cannot
  express per-entity drain decisions (e.g. draining the slower-growing of two tax-deferred accounts
  first to preserve compounding). Rejected in favor of the command model, which lays that groundwork.
- **Reusing invest `ordering_type` for withdrawals** — rejected: accumulation order and decumulation
  order are different axes (the predefined *contribution* priority is actively wrong as a *drain*
  order), and the user may want them set independently.

## Consequences

- The hardcoded tier array is replaced by phase-filtered command execution; adding per-entity `custom`
  and `bucket` withdrawal ordering later becomes additive, since withdraw commands already exist.
- Insert triggers for investment entities now emit two commands; `command.action` gains real semantics
  the simulation must honor.
- Taxable-bucket withdrawals are slightly over-taxed (whole withdrawal, not just the gain) — an
  intentionally conservative direction for a planning tool.
- The full feature spans engine + schema + triggers + UI and is tracked as a PRD/issue set, not a
  single issue; the first deployable slice ships `predefined` ordering with `bucket` and `custom` as
  fast-follows.

## Amendment (2026-07-15, issue #105): retired-year debt service draws from savings

Retired-year **debt** service now follows the same rule as retired-year **expense** shortfall: when
post-tax cash cannot cover the year's scheduled debt payment, the unmet portion is drawn from savings
through `withdrawFromSavings` (honoring the ordering/per-bucket taxation described above). Previously
debt was silently *cash-capped* — a retiree with ample savings would leave debt unpaid and let it
accrue interest, which is not a realistic drawdown.

The drawdown happens inside `DebtManager.processImplementation` (via `PlanManager.payDebtFromSavings`)
**before** interest is accrued, so the savings-funded principal reduction correctly lowers that year's
interest. The savings draw is gated on `isRetired()`; during accumulation debt stays cash-capped,
unchanged.