-- ================================================
-- POSTGRES TRIGGER FUNCTIONS
-- Replaces Django signal handler automation.
-- All functions are SECURITY DEFINER so they can
-- operate on tables that will later be protected by RLS.
-- ================================================


-- ================================================
-- SECTION 1: on_financial_item_insert
-- Fires AFTER INSERT on each of the 9 financial item
-- tables. Creates one command row for the new item,
-- then links it to every command_sequence on that plan.
-- ================================================

CREATE OR REPLACE FUNCTION on_income_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'income'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_expense_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'expense'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_debt_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'debt'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_cash_reserve_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'cash_reserve'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_brokerage_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'brokerage'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_ira_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'ira'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_roth_ira_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'roth_ira'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_hsa_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'hsa'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_tax_deferred_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (
        'tax_deferred'::model_name,
        NEW.id,
        'process',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    )
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT
        cs.id,
        v_command_id,
        COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
        TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = NEW.plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Attach insert triggers to each financial item table
CREATE TRIGGER trg_income_insert
    AFTER INSERT ON income
    FOR EACH ROW EXECUTE FUNCTION on_income_insert();

CREATE TRIGGER trg_expense_insert
    AFTER INSERT ON expense
    FOR EACH ROW EXECUTE FUNCTION on_expense_insert();

CREATE TRIGGER trg_debt_insert
    AFTER INSERT ON debt
    FOR EACH ROW EXECUTE FUNCTION on_debt_insert();

CREATE TRIGGER trg_cash_reserve_insert
    AFTER INSERT ON cash_reserve
    FOR EACH ROW EXECUTE FUNCTION on_cash_reserve_insert();

CREATE TRIGGER trg_brokerage_insert
    AFTER INSERT ON brokerage
    FOR EACH ROW EXECUTE FUNCTION on_brokerage_insert();

CREATE TRIGGER trg_ira_insert
    AFTER INSERT ON ira
    FOR EACH ROW EXECUTE FUNCTION on_ira_insert();

CREATE TRIGGER trg_roth_ira_insert
    AFTER INSERT ON roth_ira
    FOR EACH ROW EXECUTE FUNCTION on_roth_ira_insert();

CREATE TRIGGER trg_hsa_insert
    AFTER INSERT ON hsa
    FOR EACH ROW EXECUTE FUNCTION on_hsa_insert();

CREATE TRIGGER trg_tax_deferred_insert
    AFTER INSERT ON tax_deferred
    FOR EACH ROW EXECUTE FUNCTION on_tax_deferred_insert();


-- ================================================
-- SECTION 2: on_financial_item_delete
-- Fires AFTER DELETE on each of the 9 financial item
-- tables. Deletes the matching command row.
-- Cascade on command_sequence_command handles child rows.
-- ================================================

CREATE OR REPLACE FUNCTION on_income_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'income'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_expense_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'expense'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_debt_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'debt'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_cash_reserve_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'cash_reserve'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_brokerage_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'brokerage'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_ira_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'ira'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_roth_ira_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'roth_ira'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_hsa_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'hsa'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_tax_deferred_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM command WHERE model_name = 'tax_deferred'::model_name AND model_id = OLD.id;
    RETURN OLD;
END;
$$;

-- Attach delete triggers to each financial item table
CREATE TRIGGER trg_income_delete
    AFTER DELETE ON income
    FOR EACH ROW EXECUTE FUNCTION on_income_delete();

CREATE TRIGGER trg_expense_delete
    AFTER DELETE ON expense
    FOR EACH ROW EXECUTE FUNCTION on_expense_delete();

CREATE TRIGGER trg_debt_delete
    AFTER DELETE ON debt
    FOR EACH ROW EXECUTE FUNCTION on_debt_delete();

CREATE TRIGGER trg_cash_reserve_delete
    AFTER DELETE ON cash_reserve
    FOR EACH ROW EXECUTE FUNCTION on_cash_reserve_delete();

CREATE TRIGGER trg_brokerage_delete
    AFTER DELETE ON brokerage
    FOR EACH ROW EXECUTE FUNCTION on_brokerage_delete();

CREATE TRIGGER trg_ira_delete
    AFTER DELETE ON ira
    FOR EACH ROW EXECUTE FUNCTION on_ira_delete();

CREATE TRIGGER trg_roth_ira_delete
    AFTER DELETE ON roth_ira
    FOR EACH ROW EXECUTE FUNCTION on_roth_ira_delete();

CREATE TRIGGER trg_hsa_delete
    AFTER DELETE ON hsa
    FOR EACH ROW EXECUTE FUNCTION on_hsa_delete();

CREATE TRIGGER trg_tax_deferred_delete
    AFTER DELETE ON tax_deferred
    FOR EACH ROW EXECUTE FUNCTION on_tax_deferred_delete();


-- ================================================
-- SECTION 3: on_plan_created
-- Fires AFTER INSERT on plan.
-- Creates a default command_sequence for the new plan.
-- ================================================

CREATE OR REPLACE FUNCTION on_plan_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO command_sequence (name, plan_id, ordering_type, creator_id, editor_id)
    VALUES (
        NEW.name,
        NEW.id,
        'custom'::command_sequence_ordering_type,
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_plan_created
    AFTER INSERT ON plan
    FOR EACH ROW EXECUTE FUNCTION on_plan_created();


-- ================================================
-- SECTION 4: on_command_sequence_created
-- Fires AFTER INSERT on command_sequence.
-- Finds all commands for items already linked to the
-- new sequence's plan via direct plan_id FK and inserts
-- a command_sequence_command row for each.
-- ================================================

CREATE OR REPLACE FUNCTION on_command_sequence_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_command_id BIGINT;
    v_order      INTEGER := 1;
BEGIN
    FOR v_command_id IN
        WITH plan_commands AS (
            SELECT c.id AS command_id
            FROM income i
            JOIN command c ON c.model_name = 'income'::model_name AND c.model_id = i.id
            WHERE i.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM expense e
            JOIN command c ON c.model_name = 'expense'::model_name AND c.model_id = e.id
            WHERE e.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM debt d
            JOIN command c ON c.model_name = 'debt'::model_name AND c.model_id = d.id
            WHERE d.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM cash_reserve cr
            JOIN command c ON c.model_name = 'cash_reserve'::model_name AND c.model_id = cr.id
            WHERE cr.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM brokerage b
            JOIN command c ON c.model_name = 'brokerage'::model_name AND c.model_id = b.id
            WHERE b.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM ira i
            JOIN command c ON c.model_name = 'ira'::model_name AND c.model_id = i.id
            WHERE i.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM roth_ira ri
            JOIN command c ON c.model_name = 'roth_ira'::model_name AND c.model_id = ri.id
            WHERE ri.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM hsa h
            JOIN command c ON c.model_name = 'hsa'::model_name AND c.model_id = h.id
            WHERE h.plan_id = NEW.plan_id

            UNION ALL

            SELECT c.id
            FROM tax_deferred td
            JOIN command c ON c.model_name = 'tax_deferred'::model_name AND c.model_id = td.id
            WHERE td.plan_id = NEW.plan_id
        )
        SELECT command_id FROM plan_commands ORDER BY command_id
    LOOP
        INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
        VALUES (NEW.id, v_command_id, v_order, TRUE)
        ON CONFLICT (sequence_id, command_id) DO NOTHING;
        v_order := v_order + 1;
    END LOOP;

    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_command_sequence_created
    AFTER INSERT ON command_sequence
    FOR EACH ROW EXECUTE FUNCTION on_command_sequence_created();