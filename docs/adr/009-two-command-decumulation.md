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

> **Re-integrated with the tax-aware resolver (2026-07-17).** The original `payDebtFromSavings` used the
> untaxed `withdrawFromSavings`, which the per-account resolver replaced, so it was reverted during the
> #79 spine and then rebuilt on the new machinery. `DebtManager.process()` now pays from cash and records
> the unmet payment as `DebtState.payment_shortfall`; the retirement **drawdown resolver** funds
> `expense.shortfall + Σ debt payment_shortfall` from savings (tax-aware, ordered), applying the debt
> portion via `DebtManager.applySavingsPayment()` (pays down principal, caps at the shortfall). One
> deliberate imprecision: because the resolver runs after each manager processes, the savings-funded
> debt payment lands just **after** that year's interest accrued on the cash-only principal — a small,
> conservative interest overstatement, accepted over the fragility of draining mid-process.

## Amendment (2026-07-17, follow-up to issue #105): taxable-bucket withdrawals use pro-rata basis

The original decision above taxes the **taxable (brokerage) bucket** on the *whole withdrawal* at
`capital_gains_rate`, "deliberately *not* cost-basis tracking," accepting the over-tax of returned
principal as "an intentionally conservative direction." **This is superseded.**

The taxable bucket now taxes **only the gain**, via pro-rata (average-cost) basis: each taxable account
tracks its cost basis (post-tax contributions), and a withdrawal of `w` from balance `b` with basis `k`
returns `w × (k/b)` of basis untaxed and taxes `w × (1 − k/b)` at `capital_gains_rate`. The
basis-to-balance ratio is recomputed per withdrawal as the account grows.

Why the reversal: the original stance was chosen to match the flat-tax world and stay conservative, but
over-taxing the taxable bucket fails *pessimistic* on the depletion age — the single number this tool
exists to produce — and pro-rata's cost is bounded (one basis number per account, not per-lot / FIFO
tracking). The `tax_deferred` → `ordinary`, `tax_exempt`/`cash` → `0` rows are unchanged; only the
taxable row moves from whole-withdrawal to gain-only. Tax brackets and short-vs-long-term holding
periods remain out of scope. See `CONTEXT.md` → *Pro-rata basis* / *Cost basis*.

Basis is tracked **per brokerage account** (a `cost_basis` field on `BrokerageState`), not aggregated at
the bucket level. The withdrawal resolver already iterates managers within a bucket
(`withdrawFromSavings` → `liquidateFromManager`), so the per-account walk is not new work; only the
taxable bucket needs basis (tax-deferred and tax-exempt rates are uniform, so their gross-up stays the
simple bucket-level closed form). A new account's basis is **initialized to its whole `initial_balance`**
— a known-optimistic simplification (pre-existing embedded gains escape tax); an explicit starting-basis
input is a deferred future refinement. See `CONTEXT.md` → *Cost basis* / *Pro-rata basis*.

Note: this taxation seam (`taxFor`, per-bucket rates, `withdrawal_ordering_type`, the withdraw-command
enum) is still **designed-but-unimplemented** — `withdrawFromSavings` currently moves balances without
tax. This amendment revises the blueprint before it is built; the expense-shortfall and (new)
debt-service drawdown paths both inherit whatever the seam ultimately applies.

## Amendment (2026-07-17): drop the `bucket` withdrawal-ordering mode; rates are plan-level

Two follow-on decisions from the same grill:

1. **`withdrawal_ordering_type` ships `predefined | custom` only — the `bucket` mode is dropped.**
   `bucket` was designed as the *intermediate* granularity (reorder the four tax-category buckets as
   units) on the way to per-account ordering. Since taxation is now **per-account** (cost basis is
   per-account), `custom` strictly dominates `bucket` — a bucket order is a per-account order that keeps
   same-category accounts adjacent — so the middle tier is redundant storage/UI/test surface.
   `predefined` still sorts accounts by tax category, so the category concept survives as a sort key.
   **Issue #80 (bucket reorder mode) is closed won't-do.** Tax categories and the aggregate
   asset-category state in `OrchestratorState` (load-bearing for `canRetire`, projections, `invest`
   routing) are unaffected — only the ordering *mode* is removed.

2. **Rates are taxpayer/plan-level; only basis is per-account.** `capital_gains_rate` lives on the
   `plan` (parallel to the ordinary `tax_rate`), not on the brokerage — a taxpayer's long-term cap-gains
   rate is a function of total taxable income, identical across their accounts, so a per-account rate
   would model something unreal and break symmetry with ordinary tax. What varies per account is the
   **cost basis** (amendment above), not the rate. Manager-level tax tests still control the rate via
   the plan config the manager reads (`orchestrator.getConfig().capital_gains_rate`).

## Amendment (2026-07-17): cash-reserve drains last; command model unified

The original predefined order (`cash → taxable → tax-deferred → tax-exempt`) conflated two different
"cash": **spendable cash** (`cash.net`, the liquid post-tax cash flow, always spent first) and the
**cash-reserve account** (`CashReserveManager`, the *emergency fund*). The emergency fund should drain
**last**, not first. Corrected `predefined` order: spendable `cash.net` (implicit, first) → **taxable →
tax-deferred → tax-exempt → cash_reserve (last)**. Cash reserve is zero-tax yet pinned last — this
deliberately overrides the cheapest-taxed-first heuristic, because preserving the emergency fund matters
more than tax efficiency. In `custom` mode the user may drag the cash reserve anywhere; in `predefined`
it is **pinned last**.

Consequently the two-command model is **unified**: `cash_reserve` becomes an **`invest` + `withdraw`**
entity like the investment accounts (it funds in accumulation, drains in retirement), rather than the
single-`process` entity the original PRD described. `debt` stays `process` — it is a drawdown *consumer*
(its retirement shortfall is funded by the withdraw commands, per the #105 amendment above), not a source.

## Amendment (2026-07-17): decomposed manager operations (grow / contribute / withdraw / process)

The manager lifecycle is decomposed. There are **four** distinct yearly operations, and the earlier
"`invest` is accumulation-only, skipped in retirement" framing is **superseded** — it would freeze
balances mid-retirement, since money keeps compounding while you draw it down.

- **`grow`** — apply market return. Runs **every year, both phases** (unconditional; return doesn't stop
  at retirement). Cash reserve is the exception: it does not grow (a no-op).
- **`contribute`** — add new money. **Accumulation only** — self-gates to 0 once `isRetired()` (this
  also fixes the latent gap where a *fixed* contribution kept firing in retirement, pulling from cash).
- **`withdraw`** — drain with gross-up + per-account tax. **Retirement only.**
- **`process`** — the compute-every-year flow for `income` / `expense` / `debt`.

**Command action ↔ operation mapping.** The `invest` command runs **every year** and performs
`grow()` **always** plus `contribute()` **only while accumulating** — so growth is unconditional without
needing a separate command. The `withdraw` command runs **retirement-only** and performs `withdraw()`;
it is skipped during accumulation. `process` commands run every year. Thus "always-run growth" is
realized by the invest command not being skipped in retirement, with contribution self-gating — *not* by
duplicating `grow()` into the withdraw path.

**Start/end-of-year timing becomes explicit.** `growth_application_strategy` ('start' | 'end') is now an
orchestration ordering — grow-before-contribute (`start`) vs contribute-before-grow (`end`) — rather
than a hidden parameter threaded into `calculateGrowthAmount`.

**Structure.** The six funding-and-drawable accounts (brokerage, tax_deferred, ira, roth_ira, hsa,
cash_reserve) share an `InvestableManager` base exposing `grow()` / `contribute()` / `withdraw()` and a
**tax category** (→ withdrawal rate). income / expense / debt remain plain `BaseManager`s with
`process()`. See the lifecycle diagram and CONTEXT.md "Withdraw Command".