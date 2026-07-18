-- ================================================
-- Two-command decumulation (ADR 009).
--
-- Every funding-and-drawable account (brokerage, tax_deferred, ira, roth_ira, hsa, cash_reserve)
-- emits TWO commands on insert: `invest` (accumulation) + `withdraw` (retirement drawdown).
-- income / expense / debt keep their single `process` command (they compute every year and are not
-- drawdown sources; debt is a drawdown *consumer*, funded by the withdraw commands per #105).
--
-- This migration:
--   1. adds a helper that creates a command and links it to every sequence on the plan
--   2. reissues the 6 drawable insert triggers to emit invest + withdraw
--   3. backfills existing data (flip drawable process -> invest, add the missing withdraw commands)
--   4. reissues duplicate_plan to match commands by (model_name, model_id, ACTION) and to copy the
--      renamed accumulation_ordering_type + new withdrawal_ordering_type
-- ================================================

-- ------------------------------------------------
-- 1. Helper: create one command + link it to every sequence on the plan.
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION emit_command_for_item(
    p_model_name model_name,
    p_model_id   BIGINT,
    p_action     command_action,
    p_plan_id    BIGINT,
    p_creator    UUID,
    p_editor     UUID
)
    RETURNS VOID
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
AS
$$
DECLARE
    v_command_id BIGINT;
BEGIN
    INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
    VALUES (p_model_name, p_model_id, p_action, p_creator, p_editor)
    RETURNING id INTO v_command_id;

    INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
    SELECT cs.id,
           v_command_id,
           COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = cs.id), 0) + 1,
           TRUE
    FROM command_sequence cs
    WHERE cs.plan_id = p_plan_id
    ON CONFLICT (sequence_id, command_id) DO NOTHING;
END;
$$;

-- ------------------------------------------------
-- 2. Reissue the 6 drawable insert triggers: invest + withdraw.
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION on_brokerage_insert()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM emit_command_for_item('brokerage'::model_name, NEW.id, 'invest'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    PERFORM emit_command_for_item('brokerage'::model_name, NEW.id, 'withdraw'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_tax_deferred_insert()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM emit_command_for_item('tax_deferred'::model_name, NEW.id, 'invest'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    PERFORM emit_command_for_item('tax_deferred'::model_name, NEW.id, 'withdraw'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_ira_insert()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM emit_command_for_item('ira'::model_name, NEW.id, 'invest'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    PERFORM emit_command_for_item('ira'::model_name, NEW.id, 'withdraw'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_roth_ira_insert()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM emit_command_for_item('roth_ira'::model_name, NEW.id, 'invest'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    PERFORM emit_command_for_item('roth_ira'::model_name, NEW.id, 'withdraw'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_hsa_insert()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM emit_command_for_item('hsa'::model_name, NEW.id, 'invest'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    PERFORM emit_command_for_item('hsa'::model_name, NEW.id, 'withdraw'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION on_cash_reserve_insert()
    RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    PERFORM emit_command_for_item('cash_reserve'::model_name, NEW.id, 'invest'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    PERFORM emit_command_for_item('cash_reserve'::model_name, NEW.id, 'withdraw'::command_action,
                                  NEW.plan_id, COALESCE(NEW.creator_id, auth.uid()), COALESCE(NEW.creator_id, auth.uid()));
    RETURN NEW;
END;
$$;

-- ------------------------------------------------
-- 3. Backfill existing data.
-- ------------------------------------------------
-- 3a. Existing drawable-entity accumulation commands become 'invest'.
UPDATE command
SET action = 'invest'::command_action
WHERE action = 'process'::command_action
  AND model_name IN ('brokerage', 'tax_deferred', 'ira', 'roth_ira', 'hsa', 'cash_reserve');

-- 3b. Add a paired 'withdraw' command for each drawable entity that lacks one, linked to every
--     sequence its invest command already belongs to.
DO
$$
    DECLARE
        r            RECORD;
        v_command_id BIGINT;
    BEGIN
        FOR r IN
            SELECT DISTINCT ON (c.model_name, c.model_id)
                   c.model_name,
                   c.model_id,
                   c.creator_id,
                   c.editor_id
            FROM command c
            WHERE c.model_name IN ('brokerage', 'tax_deferred', 'ira', 'roth_ira', 'hsa', 'cash_reserve')
              AND c.action = 'invest'::command_action
              AND NOT EXISTS (SELECT 1
                              FROM command w
                              WHERE w.model_name = c.model_name
                                AND w.model_id = c.model_id
                                AND w.action = 'withdraw'::command_action)
            ORDER BY c.model_name, c.model_id, c.id
            LOOP
                INSERT INTO command (model_name, model_id, action, creator_id, editor_id)
                VALUES (r.model_name, r.model_id, 'withdraw'::command_action, r.creator_id, r.editor_id)
                RETURNING id INTO v_command_id;

                INSERT INTO command_sequence_command (sequence_id, command_id, "order", is_active)
                SELECT s.sequence_id,
                       v_command_id,
                       COALESCE((SELECT MAX("order") FROM command_sequence_command WHERE sequence_id = s.sequence_id), 0) + 1,
                       TRUE
                FROM (SELECT DISTINCT csc.sequence_id
                      FROM command_sequence_command csc
                               JOIN command ic ON ic.id = csc.command_id
                      WHERE ic.model_name = r.model_name
                        AND ic.model_id = r.model_id) s
                ON CONFLICT (sequence_id, command_id) DO NOTHING;
            END LOOP;
    END;
$$;

-- ------------------------------------------------
-- 4. Reissue duplicate_plan: match commands by (model_name, model_id, action) — a model now has two
--    commands, so the pair alone is ambiguous — and copy both ordering directives.
-- ------------------------------------------------
CREATE OR REPLACE FUNCTION duplicate_plan(p_plan_id BIGINT)
    RETURNS BIGINT
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = public
AS
$$
DECLARE
    c_tables CONSTANT TEXT[] := ARRAY [
        'income', 'expense', 'debt', 'cash_reserve', 'brokerage',
        'hsa', 'ira', 'roth_ira', 'tax_deferred'
        ];
    c_skip   CONSTANT TEXT[] := ARRAY ['id', 'created_at', 'edited_at', 'creator_id', 'editor_id'];

    v_new_plan_id BIGINT;
    v_table       TEXT;
    v_cols        TEXT;
    v_select      TEXT;
    v_old_id      BIGINT;
    v_new_id      BIGINT;
    v_id_map      JSONB  := '{}'::jsonb;
    v_seq         RECORD;
    v_new_seq_id  BIGINT;
    v_csc         RECORD;
    v_new_cmd_id  BIGINT;
BEGIN
    SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position),
           string_agg(CASE column_name
                          WHEN 'name' THEN 'name || '' (copy)'''
                          ELSE quote_ident(column_name)
                          END, ', ' ORDER BY ordinal_position)
    INTO v_cols, v_select
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'plan'
      AND NOT (column_name = ANY (c_skip));

    EXECUTE format('INSERT INTO plan (%s) SELECT %s FROM plan WHERE id = $1 RETURNING id',
                   v_cols, v_select)
        USING p_plan_id
        INTO v_new_plan_id;

    IF v_new_plan_id IS NULL THEN
        RAISE EXCEPTION 'Plan % not found, or not owned by the caller', p_plan_id
            USING ERRCODE = 'no_data_found';
    END IF;

    DELETE FROM command_sequence WHERE plan_id = v_new_plan_id;

    FOREACH v_table IN ARRAY c_tables
        LOOP
            SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position),
                   string_agg(CASE column_name
                                  WHEN 'plan_id' THEN v_new_plan_id::text
                                  WHEN 'income_id' THEN
                                      format('(%L::jsonb ->> (''income:'' || income_id::text))::bigint',
                                             v_id_map)
                                  ELSE quote_ident(column_name)
                                  END, ', ' ORDER BY ordinal_position)
            INTO v_cols, v_select
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = v_table
              AND NOT (column_name = ANY (c_skip));

            FOR v_old_id IN
                EXECUTE format('SELECT id FROM %I WHERE plan_id = $1 ORDER BY id', v_table)
                    USING p_plan_id
                LOOP
                    EXECUTE format(
                            'INSERT INTO %I (%s) SELECT %s FROM %I WHERE id = $1 RETURNING id',
                            v_table, v_cols, v_select, v_table)
                        USING v_old_id
                        INTO v_new_id;

                    v_id_map := jsonb_set(v_id_map,
                                          ARRAY [v_table || ':' || v_old_id::text],
                                          to_jsonb(v_new_id));
                END LOOP;
        END LOOP;

    FOR v_seq IN
        SELECT id, name, accumulation_ordering_type, withdrawal_ordering_type
        FROM command_sequence
        WHERE plan_id = p_plan_id
        ORDER BY id
        LOOP
            INSERT INTO command_sequence (name, plan_id, accumulation_ordering_type, withdrawal_ordering_type)
            VALUES (v_seq.name, v_new_plan_id, v_seq.accumulation_ordering_type, v_seq.withdrawal_ordering_type)
            RETURNING id INTO v_new_seq_id;

            FOR v_csc IN
                SELECT csc."order", csc.is_active, cmd.model_name, cmd.model_id, cmd.action
                FROM command_sequence_command csc
                         JOIN command cmd ON cmd.id = csc.command_id
                WHERE csc.sequence_id = v_seq.id
                LOOP
                    -- Match by (model_name, model_id, action): a model now has both an invest and a
                    -- withdraw command, so the pair alone would resolve ambiguously.
                    SELECT cmd.id
                    INTO v_new_cmd_id
                    FROM command cmd
                    WHERE cmd.model_name = v_csc.model_name
                      AND cmd.action = v_csc.action
                      AND cmd.model_id = (v_id_map ->> (v_csc.model_name::text || ':' ||
                                                        v_csc.model_id::text))::bigint;

                    CONTINUE WHEN v_new_cmd_id IS NULL;

                    UPDATE command_sequence_command
                    SET "order"   = v_csc."order",
                        is_active = v_csc.is_active
                    WHERE sequence_id = v_new_seq_id
                      AND command_id = v_new_cmd_id;
                END LOOP;
        END LOOP;

    RETURN v_new_plan_id;
END;
$$;

GRANT EXECUTE ON FUNCTION duplicate_plan(BIGINT) TO authenticated;
