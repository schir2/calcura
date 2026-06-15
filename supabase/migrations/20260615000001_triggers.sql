-- ================================================
-- POSTGRES TRIGGER FUNCTIONS
-- Replaces Django signal handler automation.
-- All functions are SECURITY DEFINER so they can
-- operate on tables that will later be protected by RLS.
-- ================================================


-- ================================================
-- SECTION 1: on_financial_item_insert
-- Fires AFTER INSERT on each of the 9 financial item
-- tables. Creates one command row for the new item.
-- ================================================

CREATE OR REPLACE FUNCTION on_income_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'income'::command_item_type,
        NEW.id,
        'income',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_expense_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'expense'::command_item_type,
        NEW.id,
        'expense',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_debt_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'debt'::command_item_type,
        NEW.id,
        'debt',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_cash_reserve_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'cash_reserve'::command_item_type,
        NEW.id,
        'cash_reserve',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_brokerage_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'brokerage'::command_item_type,
        NEW.id,
        'brokerage',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_ira_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'ira'::command_item_type,
        NEW.id,
        'ira',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_roth_ira_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'roth_ira'::command_item_type,
        NEW.id,
        'roth_ira',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_hsa_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'hsa'::command_item_type,
        NEW.id,
        'hsa',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_tax_deferred_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO command (item_type, item_id, action, creator_id, editor_id)
    VALUES (
        'tax_deferred'::command_item_type,
        NEW.id,
        'tax_deferred',
        COALESCE(NEW.creator_id, auth.uid()),
        COALESCE(NEW.creator_id, auth.uid())
    );
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
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'income'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_expense_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'expense'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_debt_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'debt'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_cash_reserve_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'cash_reserve'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_brokerage_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'brokerage'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_ira_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'ira'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_roth_ira_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'roth_ira'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_hsa_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'hsa'::command_item_type AND item_id = OLD.id;
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_tax_deferred_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command WHERE item_type = 'tax_deferred'::command_item_type AND item_id = OLD.id;
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
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
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
-- new sequence's plan (via all 9 junction tables) and
-- inserts a command_sequence_command row for each,
-- with sequential order values starting at 1.
-- ================================================

CREATE OR REPLACE FUNCTION on_command_sequence_created()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
    v_order      INTEGER := 1;
BEGIN
    -- Collect all commands associated with the plan via all junction tables,
    -- ordered by command id for deterministic ordering.
    FOR v_command_id IN
        WITH plan_commands AS (
            -- incomes
            SELECT c.id AS command_id
            FROM plan_incomes pi
            JOIN command c ON c.item_type = 'income'::command_item_type AND c.item_id = pi.income_id
            WHERE pi.plan_id = NEW.plan_id

            UNION ALL

            -- expenses
            SELECT c.id
            FROM plan_expenses pe
            JOIN command c ON c.item_type = 'expense'::command_item_type AND c.item_id = pe.expense_id
            WHERE pe.plan_id = NEW.plan_id

            UNION ALL

            -- debts
            SELECT c.id
            FROM plan_debts pd
            JOIN command c ON c.item_type = 'debt'::command_item_type AND c.item_id = pd.debt_id
            WHERE pd.plan_id = NEW.plan_id

            UNION ALL

            -- cash reserves
            SELECT c.id
            FROM plan_cash_reserves pcr
            JOIN command c ON c.item_type = 'cash_reserve'::command_item_type AND c.item_id = pcr.cash_reserve_id
            WHERE pcr.plan_id = NEW.plan_id

            UNION ALL

            -- brokerages
            SELECT c.id
            FROM plan_brokerages pb
            JOIN command c ON c.item_type = 'brokerage'::command_item_type AND c.item_id = pb.brokerage_id
            WHERE pb.plan_id = NEW.plan_id

            UNION ALL

            -- iras
            SELECT c.id
            FROM plan_iras pira
            JOIN command c ON c.item_type = 'ira'::command_item_type AND c.item_id = pira.ira_id
            WHERE pira.plan_id = NEW.plan_id

            UNION ALL

            -- roth iras
            SELECT c.id
            FROM plan_roth_iras prira
            JOIN command c ON c.item_type = 'roth_ira'::command_item_type AND c.item_id = prira.roth_ira_id
            WHERE prira.plan_id = NEW.plan_id

            UNION ALL

            -- hsas
            SELECT c.id
            FROM plan_hsas ph
            JOIN command c ON c.item_type = 'hsa'::command_item_type AND c.item_id = ph.hsa_id
            WHERE ph.plan_id = NEW.plan_id

            UNION ALL

            -- tax deferreds
            SELECT c.id
            FROM plan_tax_deferreds ptd
            JOIN command c ON c.item_type = 'tax_deferred'::command_item_type AND c.item_id = ptd.tax_deferred_id
            WHERE ptd.plan_id = NEW.plan_id
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


-- ================================================
-- SECTION 5: on_plan_item_junction_insert
-- Fires AFTER INSERT on each of the 9 junction tables.
-- Finds the command row for the newly linked item and
-- inserts a command_sequence_command row into every
-- command_sequence belonging to that plan.
-- Uses INSERT ... ON CONFLICT DO NOTHING for idempotency.
-- Each junction table has a distinct item FK column name,
-- so a dedicated function is required per junction table.
-- ================================================

CREATE OR REPLACE FUNCTION on_plan_incomes_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'income'::command_item_type AND item_id = NEW.income_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_expenses_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'expense'::command_item_type AND item_id = NEW.expense_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_debts_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'debt'::command_item_type AND item_id = NEW.debt_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_cash_reserves_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'cash_reserve'::command_item_type AND item_id = NEW.cash_reserve_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_brokerages_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'brokerage'::command_item_type AND item_id = NEW.brokerage_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_iras_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'ira'::command_item_type AND item_id = NEW.ira_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_roth_iras_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'roth_ira'::command_item_type AND item_id = NEW.roth_ira_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_hsas_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'hsa'::command_item_type AND item_id = NEW.hsa_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

CREATE OR REPLACE FUNCTION on_plan_tax_deferreds_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_command_id BIGINT;
BEGIN
    SELECT id INTO v_command_id
    FROM command
    WHERE item_type = 'tax_deferred'::command_item_type AND item_id = NEW.tax_deferred_id
    LIMIT 1;

    IF v_command_id IS NULL THEN
        RETURN NEW;
    END IF;

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

-- Attach junction insert triggers
CREATE TRIGGER trg_plan_incomes_insert
    AFTER INSERT ON plan_incomes
    FOR EACH ROW EXECUTE FUNCTION on_plan_incomes_insert();

CREATE TRIGGER trg_plan_expenses_insert
    AFTER INSERT ON plan_expenses
    FOR EACH ROW EXECUTE FUNCTION on_plan_expenses_insert();

CREATE TRIGGER trg_plan_debts_insert
    AFTER INSERT ON plan_debts
    FOR EACH ROW EXECUTE FUNCTION on_plan_debts_insert();

CREATE TRIGGER trg_plan_cash_reserves_insert
    AFTER INSERT ON plan_cash_reserves
    FOR EACH ROW EXECUTE FUNCTION on_plan_cash_reserves_insert();

CREATE TRIGGER trg_plan_brokerages_insert
    AFTER INSERT ON plan_brokerages
    FOR EACH ROW EXECUTE FUNCTION on_plan_brokerages_insert();

CREATE TRIGGER trg_plan_iras_insert
    AFTER INSERT ON plan_iras
    FOR EACH ROW EXECUTE FUNCTION on_plan_iras_insert();

CREATE TRIGGER trg_plan_roth_iras_insert
    AFTER INSERT ON plan_roth_iras
    FOR EACH ROW EXECUTE FUNCTION on_plan_roth_iras_insert();

CREATE TRIGGER trg_plan_hsas_insert
    AFTER INSERT ON plan_hsas
    FOR EACH ROW EXECUTE FUNCTION on_plan_hsas_insert();

CREATE TRIGGER trg_plan_tax_deferreds_insert
    AFTER INSERT ON plan_tax_deferreds
    FOR EACH ROW EXECUTE FUNCTION on_plan_tax_deferreds_insert();


-- ================================================
-- SECTION 6: on_plan_item_junction_delete
-- Fires AFTER DELETE on each of the 9 junction tables.
-- Finds the command row for the removed item and deletes
-- all command_sequence_command rows from sequences
-- belonging to that plan.
-- ================================================

CREATE OR REPLACE FUNCTION on_plan_incomes_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'income'::command_item_type AND item_id = OLD.income_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_expenses_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'expense'::command_item_type AND item_id = OLD.expense_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_debts_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'debt'::command_item_type AND item_id = OLD.debt_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_cash_reserves_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'cash_reserve'::command_item_type AND item_id = OLD.cash_reserve_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_brokerages_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'brokerage'::command_item_type AND item_id = OLD.brokerage_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_iras_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'ira'::command_item_type AND item_id = OLD.ira_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_roth_iras_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'roth_ira'::command_item_type AND item_id = OLD.roth_ira_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_hsas_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'hsa'::command_item_type AND item_id = OLD.hsa_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

CREATE OR REPLACE FUNCTION on_plan_tax_deferreds_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    DELETE FROM command_sequence_command
    WHERE command_id IN (
        SELECT id FROM command
        WHERE item_type = 'tax_deferred'::command_item_type AND item_id = OLD.tax_deferred_id
    )
    AND sequence_id IN (
        SELECT id FROM command_sequence WHERE plan_id = OLD.plan_id
    );
    RETURN OLD;
END;
$$;

-- Attach junction delete triggers
CREATE TRIGGER trg_plan_incomes_delete
    AFTER DELETE ON plan_incomes
    FOR EACH ROW EXECUTE FUNCTION on_plan_incomes_delete();

CREATE TRIGGER trg_plan_expenses_delete
    AFTER DELETE ON plan_expenses
    FOR EACH ROW EXECUTE FUNCTION on_plan_expenses_delete();

CREATE TRIGGER trg_plan_debts_delete
    AFTER DELETE ON plan_debts
    FOR EACH ROW EXECUTE FUNCTION on_plan_debts_delete();

CREATE TRIGGER trg_plan_cash_reserves_delete
    AFTER DELETE ON plan_cash_reserves
    FOR EACH ROW EXECUTE FUNCTION on_plan_cash_reserves_delete();

CREATE TRIGGER trg_plan_brokerages_delete
    AFTER DELETE ON plan_brokerages
    FOR EACH ROW EXECUTE FUNCTION on_plan_brokerages_delete();

CREATE TRIGGER trg_plan_iras_delete
    AFTER DELETE ON plan_iras
    FOR EACH ROW EXECUTE FUNCTION on_plan_iras_delete();

CREATE TRIGGER trg_plan_roth_iras_delete
    AFTER DELETE ON plan_roth_iras
    FOR EACH ROW EXECUTE FUNCTION on_plan_roth_iras_delete();

CREATE TRIGGER trg_plan_hsas_delete
    AFTER DELETE ON plan_hsas
    FOR EACH ROW EXECUTE FUNCTION on_plan_hsas_delete();

CREATE TRIGGER trg_plan_tax_deferreds_delete
    AFTER DELETE ON plan_tax_deferreds
    FOR EACH ROW EXECUTE FUNCTION on_plan_tax_deferreds_delete();
