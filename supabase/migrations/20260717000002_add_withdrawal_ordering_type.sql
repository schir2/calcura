-- A command_sequence carries two independent ordering directives, both reusing the existing
-- command_sequence_ordering_type enum (predefined | custom) and the shared csc.order:
--   accumulation_ordering_type — orders the process + invest commands (renamed from ordering_type)
--   withdrawal_ordering_type    — orders the withdraw commands (new)
-- Independence is the point: e.g. predefined contributions + custom drain. See ADR 009 amendment
-- (2026-07-17) and CONTEXT.md "accumulation_ordering_type" / "withdrawal_ordering_type".

-- 1. Rename the existing accumulation directive for symmetry with the new withdrawal one.
ALTER TABLE command_sequence
    RENAME COLUMN ordering_type TO accumulation_ordering_type;

-- 2. Add the withdrawal directive. Default predefined: spendable cash first, then
--    taxable -> tax-deferred -> tax-exempt -> cash_reserve (emergency fund last).
ALTER TABLE command_sequence
    ADD COLUMN IF NOT EXISTS withdrawal_ordering_type command_sequence_ordering_type NOT NULL DEFAULT 'predefined';

-- 3. on_plan_created references the renamed column — reissue it against the new name.
CREATE OR REPLACE FUNCTION on_plan_created()
    RETURNS TRIGGER
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS
$$
BEGIN
    INSERT INTO command_sequence (name, plan_id, accumulation_ordering_type, creator_id, editor_id)
    VALUES (NEW.name,
            NEW.id,
            'custom'::command_sequence_ordering_type,
            COALESCE(NEW.creator_id, auth.uid()),
            COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;
