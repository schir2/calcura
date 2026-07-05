# ADR 010: HSA is not income-linked; health-insurance modeling deferred

**Status:** Accepted
**Date:** 2026-07-04

## Context

While designing the Income Workspace (where investment accounts can be funded as a
percentage of a linked income — see [ADR 006](006-income-id-on-junction-tables.md)), we
hit an inconsistency. `tax_deferred`, `ira`, and `roth_ira` all carry an `income_id` and
can be funded as `percentage_of_income`. **`hsa` does not carry `income_id`**, yet its
`contribution_strategy` enum still offers `percentage_of_income` — a percent of an income
it cannot reference.

Investigating the real-world model clarified why HSA is different:

- An **HSA (Health Savings Account)** is gated by enrollment in a **High-Deductible Health
  Plan (HDHP)** — eligibility is tied to *health insurance*, not income. No HDHP, no HSA.
- Contributions are **IRS-capped to a flat annual dollar limit** (2025: ~$4,300 self /
  ~$8,550 family, +$1,000 catch-up at 55+), not derived from salary.
- HSAs are commonly *funded* via pre-tax payroll deduction and often receive a flat
  **employer contribution**, but the payroll mechanism is plumbing — the contribution
  *amount* is a dollar target, not a fraction of a paycheck.

So the natural HSA contribution strategies are `fixed` (a set amount) or `max` (fill to the
IRS limit). `percentage_of_income` does not map to how HSAs work.

This also surfaced a broader gap: **the platform has no concept of health insurance / an
HDHP.** Health costs today can only be modeled as a generic expense, which ignores the
distinct tax treatment (pre-tax premiums, HSA triple-tax-advantage, etc.). A dedicated
health-insurance / health category was considered but is out of scope now.

## Decision

1. **HSA is not income-linked.** It is excluded from the Income Workspace's "Investments
   linked to this income" list. HSAs are added and edited from the Investments section only.
   The absence of `income_id` on `hsa` is correct and intentional, not an oversight.
2. **`percentage_of_income` is not a valid HSA strategy.** It is a latent bug (a percent of a
   nonexistent income). HSA strategies are restricted to `fixed` and `max`. Tracked as its
   own issue; the enum/validation fix is separate from this ADR.
3. **A health-insurance / HDHP concept is deferred.** If HSAs, HDHP premiums, and their tax
   treatment are modeled properly later, HSA would attach to *that* concept (health
   coverage), never to `income`. Revisit only when health-specific tax handling is on the
   roadmap.

## Consequences

**Positive:**
- Matches the shipped schema (`hsa` has no `income_id`) — no migration needed now.
- Keeps the income-linkage model coherent: only accounts genuinely funded as a share of a
  paycheck (`tax_deferred`, `ira`, `roth_ira`) participate.
- Records the HSA↔HDHP real-world model so the "why isn't HSA linkable like a 401(k)?"
  question is not re-litigated.

**Negative / Trade-offs:**
- Users who fund an HSA by payroll percentage cannot express that directly; they approximate
  with `fixed` or `max`. Acceptable — HSA limits are low and flat, so `max`/`fixed` cover
  most real modeling.
- Defers a genuinely different tax domain (health) rather than solving it.

## Related

- [ADR 006](006-income-id-on-junction-tables.md) — income association on junction tables.
- CONTEXT.md → "Glossary — Contribution Strategies" (income linkage, deferred detachment
  question).
