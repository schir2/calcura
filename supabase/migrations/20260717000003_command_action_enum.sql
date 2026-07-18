-- command.action gains real semantics (was TEXT, always 'process', engine-ignored):
--   process  — runs in BOTH phases (income / expense / debt compute every year)
--   invest   — accumulation-only funding (skipped once retired)
--   withdraw — retirement-only drawdown
-- Existing rows are all 'process', which is a valid label, so the USING cast is lossless.
-- See ADR 009 and CONTEXT.md "Withdraw Command".

CREATE TYPE command_action AS ENUM ('process', 'invest', 'withdraw');

ALTER TABLE command
    ALTER COLUMN action TYPE command_action USING action::command_action;
