# ADR 006: IRA/RothIRA/TaxDeferred income association lives on junction tables

**Status:** Accepted  
**Date:** 2026-06-15

## Context

IRA, Roth IRA, and Tax-Deferred accounts use an associated income source to calculate percentage-based contributions (e.g., "contribute 6% of income to 401k"). There are two options:
1. Store `income_id` directly on the `ira`, `roth_ira`, `tax_deferred` item tables (global association)
2. Store `income_id` on the junction tables `plan_iras`, `plan_roth_iras`, `plan_tax_deferreds` (plan-specific association)

## Decision

`income_id` lives on the junction tables, not the item tables:

```sql
CREATE TABLE plan_iras (
    plan_id   BIGINT NOT NULL REFERENCES plan(id) ON DELETE CASCADE,
    ira_id    BIGINT NOT NULL REFERENCES ira(id) ON DELETE CASCADE,
    income_id BIGINT REFERENCES income(id) ON DELETE SET NULL,
    PRIMARY KEY (plan_id, ira_id)
);
```

## Consequences

**Positive:**
- The same IRA account can be associated with different income sources in different plans. This reflects real-world usage: the same Roth IRA might be funded from a side-income in Plan A and a primary salary in Plan B.
- Item tables (`ira`, `roth_ira`, `tax_deferred`) remain clean and plan-agnostic — they describe the account itself, not its funding source in a specific plan.
- Income changes in one plan do not affect the same account in another plan.

**Negative / Trade-offs:**
- To retrieve an IRA with its associated income for a plan, you must JOIN through the junction table rather than just fetching the item directly.
- When reading plan data via PostgREST, related income for IRA/RothIRA/TaxDeferred must be requested via the junction table: `plan_iras(ira(*), income(*))`.
- Migration is a breaking change from the Django model where `income_id` was on the item table directly.
