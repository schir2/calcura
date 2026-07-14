-- ================================================
-- duplicate_plan(p_plan_id) -> new plan id
--
-- A plan is a *scenario*, and scenarios are made by cloning and tweaking (see ADR 015).
-- Deep-copies a plan, its nine entity tables, and its command sequences into a new,
-- fully independent plan owned by the caller.
--
-- SECURITY INVOKER on purpose: every statement below runs under the caller's RLS, so a
-- caller who does not own the source plan simply matches zero rows and gets the
-- not-found error. No hand-rolled auth.uid() check to get wrong.
--
-- Runs in a single implicit transaction: a failure anywhere leaves no partial plan behind.
-- ================================================

CREATE OR REPLACE FUNCTION duplicate_plan(p_plan_id BIGINT)
    RETURNS BIGINT
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = public
AS
$$
DECLARE
    -- `income` MUST be copied first: ira / roth_ira / tax_deferred carry income_id (ADR 006)
    -- and are re-pointed at the *copied* income as they are inserted.
    c_tables CONSTANT TEXT[] := ARRAY [
        'income', 'expense', 'debt', 'cash_reserve', 'brokerage',
        'hsa', 'ira', 'roth_ira', 'tax_deferred'
        ];

    -- Never inherited by the copy: the identity PK, and the audit trail. Omitting
    -- creator_id/editor_id lets them default to auth.uid(), so the copy belongs to whoever
    -- duplicated it and the creator_id-based RLS policies apply to the new rows.
    c_skip   CONSTANT TEXT[] := ARRAY ['id', 'created_at', 'edited_at', 'creator_id', 'editor_id'];

    v_new_plan_id BIGINT;
    v_table       TEXT;
    v_cols        TEXT;
    v_select      TEXT;
    v_old_id      BIGINT;
    v_new_id      BIGINT;

    -- 'income:12' -> 34. One flat map across all nine tables. Used twice: to re-point income_id
    -- on the income-linked accounts, and to translate each source command's model_id when the
    -- sequences are rebuilt.
    v_id_map      JSONB  := '{}'::jsonb;

    v_seq         RECORD;
    v_new_seq_id  BIGINT;
    v_csc         RECORD;
    v_new_cmd_id  BIGINT;
BEGIN
    -- ------------------------------------------------
    -- 1. The plan row.
    -- Column lists are derived from the catalog rather than hard-coded. A hard-coded list is a
    -- silent-corruption hazard here: it goes stale the moment a column is added (the new column
    -- is quietly not copied) or dropped (`insufficient_funds_strategy` already was).
    -- ------------------------------------------------
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

    -- trg_plan_created has just auto-created a default command_sequence on the copy. Drop it —
    -- the source's own sequences are copied verbatim in step 3, and leaving this one would give
    -- the copy an extra sequence the source never had.
    --
    -- Dropping it *before* the entities are inserted is also what makes step 3 work: with no
    -- sequence on the plan, each entity's insert trigger creates its `command` row but links it
    -- to nothing, leaving the sequences created in step 3 to pick those commands up cleanly.
    DELETE FROM command_sequence WHERE plan_id = v_new_plan_id;

    -- ------------------------------------------------
    -- 2. The nine entity tables.
    -- ------------------------------------------------
    FOREACH v_table IN ARRAY c_tables
        LOOP
            -- Rebuilt per table, and *after* income has been copied, so the income_id expression
            -- below closes over a v_id_map that already contains every income.
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

            -- Row at a time, so each source id can be mapped to the id it became. A set-based
            -- INSERT ... SELECT cannot return that correlation.
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

    -- ------------------------------------------------
    -- 3. The command sequences.
    -- Inserting each one fires trg_command_sequence_created, which links every command on the
    -- copy to it with is_active = TRUE and an arbitrary order. Those defaults are then corrected,
    -- command by command, to match the source sequence.
    -- ------------------------------------------------
    FOR v_seq IN
        SELECT id, name, ordering_type
        FROM command_sequence
        WHERE plan_id = p_plan_id
        ORDER BY id
        LOOP
            INSERT INTO command_sequence (name, plan_id, ordering_type)
            VALUES (v_seq.name, v_new_plan_id, v_seq.ordering_type)
            RETURNING id INTO v_new_seq_id;

            FOR v_csc IN
                SELECT csc."order", csc.is_active, cmd.model_name, cmd.model_id
                FROM command_sequence_command csc
                         JOIN command cmd ON cmd.id = csc.command_id
                WHERE csc.sequence_id = v_seq.id
                LOOP
                    -- Translate the source command's target entity to the copied entity, then
                    -- find the command the insert trigger created for it. This is the step that
                    -- keeps the copy self-referential: it must never resolve to a command
                    -- belonging to the source plan.
                    SELECT cmd.id
                    INTO v_new_cmd_id
                    FROM command cmd
                    WHERE cmd.model_name = v_csc.model_name
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
