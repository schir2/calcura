-- Capital-gains rate is a taxpayer/plan-level property (parallel to tax_rate), not per-account.
-- Used to tax the gain portion of brokerage (taxable-bucket) withdrawals in retirement.
-- See ADR 009 amendment (2026-07-17) and CONTEXT.md "Per-bucket effective rate".

ALTER TABLE plan
    ADD COLUMN IF NOT EXISTS capital_gains_rate NUMERIC NOT NULL DEFAULT 15;
