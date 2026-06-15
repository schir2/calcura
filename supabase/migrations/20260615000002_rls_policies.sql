-- ================================================
-- ROW LEVEL SECURITY POLICIES
-- Enforces data isolation at the database level.
-- All tables in the public schema are covered.
-- ================================================


-- ================================================
-- SECTION 1: ENABLE RLS ON ALL TABLES
-- ================================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Financial item tables
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_reserve ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokerage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ira ENABLE ROW LEVEL SECURITY;
ALTER TABLE roth_ira ENABLE ROW LEVEL SECURITY;
ALTER TABLE hsa ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_deferred ENABLE ROW LEVEL SECURITY;

-- Plan table
ALTER TABLE plan ENABLE ROW LEVEL SECURITY;

-- Plan junction tables
ALTER TABLE plan_incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_cash_reserves ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_brokerages ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_iras ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_roth_iras ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_hsas ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_tax_deferreds ENABLE ROW LEVEL SECURITY;

-- Command tables
ALTER TABLE command ENABLE ROW LEVEL SECURITY;
ALTER TABLE command_sequence ENABLE ROW LEVEL SECURITY;
ALTER TABLE command_sequence_command ENABLE ROW LEVEL SECURITY;

-- Template tables
ALTER TABLE income_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_reserve_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE brokerage_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE ira_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE roth_ira_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE hsa_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_deferred_template ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template ENABLE ROW LEVEL SECURITY;

-- Template junction tables
ALTER TABLE plan_template_income_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_expense_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_debt_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_cash_reserve_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_brokerage_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_ira_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_roth_ira_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_hsa_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_template_tax_deferred_templates ENABLE ROW LEVEL SECURITY;


-- ================================================
-- SECTION 2: PROFILES TABLE
-- INSERT is handled exclusively by the on_user_created
-- trigger (SECURITY DEFINER), so no INSERT policy is
-- needed for the authenticated role.
-- ================================================

CREATE POLICY pol_profiles_select
    ON profiles
    FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = user_id);

CREATE POLICY pol_profiles_update
    ON profiles
    FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);


-- ================================================
-- SECTION 3: USER-OWNED FINANCIAL ITEM TABLES
-- Ownership is determined by creator_id.
-- ================================================

-- income
CREATE POLICY pol_income_select
    ON income FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_income_insert
    ON income FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_income_update
    ON income FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_income_delete
    ON income FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- expense
CREATE POLICY pol_expense_select
    ON expense FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_expense_insert
    ON expense FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_expense_update
    ON expense FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_expense_delete
    ON expense FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- debt
CREATE POLICY pol_debt_select
    ON debt FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_debt_insert
    ON debt FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_debt_update
    ON debt FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_debt_delete
    ON debt FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- cash_reserve
CREATE POLICY pol_cash_reserve_select
    ON cash_reserve FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_cash_reserve_insert
    ON cash_reserve FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_cash_reserve_update
    ON cash_reserve FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_cash_reserve_delete
    ON cash_reserve FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- brokerage
CREATE POLICY pol_brokerage_select
    ON brokerage FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_brokerage_insert
    ON brokerage FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_brokerage_update
    ON brokerage FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_brokerage_delete
    ON brokerage FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- ira
CREATE POLICY pol_ira_select
    ON ira FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_ira_insert
    ON ira FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_ira_update
    ON ira FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_ira_delete
    ON ira FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- roth_ira
CREATE POLICY pol_roth_ira_select
    ON roth_ira FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_roth_ira_insert
    ON roth_ira FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_roth_ira_update
    ON roth_ira FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_roth_ira_delete
    ON roth_ira FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- hsa
CREATE POLICY pol_hsa_select
    ON hsa FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_hsa_insert
    ON hsa FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_hsa_update
    ON hsa FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_hsa_delete
    ON hsa FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- tax_deferred
CREATE POLICY pol_tax_deferred_select
    ON tax_deferred FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_tax_deferred_insert
    ON tax_deferred FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_tax_deferred_update
    ON tax_deferred FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_tax_deferred_delete
    ON tax_deferred FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- plan
CREATE POLICY pol_plan_select
    ON plan FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_plan_insert
    ON plan FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_plan_update
    ON plan FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_plan_delete
    ON plan FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);


-- ================================================
-- SECTION 4: COMMAND TABLES
-- ================================================

-- command
CREATE POLICY pol_command_select
    ON command FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_command_insert
    ON command FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_command_update
    ON command FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_command_delete
    ON command FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- command_sequence
CREATE POLICY pol_command_sequence_select
    ON command_sequence FOR SELECT TO authenticated
    USING ((select auth.uid()) = creator_id);

CREATE POLICY pol_command_sequence_insert
    ON command_sequence FOR INSERT TO authenticated
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_command_sequence_update
    ON command_sequence FOR UPDATE TO authenticated
    USING ((select auth.uid()) = creator_id)
    WITH CHECK ((select auth.uid()) = creator_id);

CREATE POLICY pol_command_sequence_delete
    ON command_sequence FOR DELETE TO authenticated
    USING ((select auth.uid()) = creator_id);

-- command_sequence_command
-- No creator_id column — ownership traced via sequence_id → command_sequence.creator_id
CREATE POLICY pol_command_sequence_command_select
    ON command_sequence_command FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM command_sequence cs
            WHERE cs.id = sequence_id
              AND cs.creator_id = (select auth.uid())
        )
    );

CREATE POLICY pol_command_sequence_command_insert
    ON command_sequence_command FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM command_sequence cs
            WHERE cs.id = sequence_id
              AND cs.creator_id = (select auth.uid())
        )
    );

CREATE POLICY pol_command_sequence_command_update
    ON command_sequence_command FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM command_sequence cs
            WHERE cs.id = sequence_id
              AND cs.creator_id = (select auth.uid())
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM command_sequence cs
            WHERE cs.id = sequence_id
              AND cs.creator_id = (select auth.uid())
        )
    );

CREATE POLICY pol_command_sequence_command_delete
    ON command_sequence_command FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM command_sequence cs
            WHERE cs.id = sequence_id
              AND cs.creator_id = (select auth.uid())
        )
    );


-- ================================================
-- SECTION 5: PLAN JUNCTION TABLES
-- Ownership traced via plan_id → plan.creator_id
-- ================================================

-- plan_incomes
CREATE POLICY pol_plan_incomes_select
    ON plan_incomes FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_incomes_insert
    ON plan_incomes FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_incomes_update
    ON plan_incomes FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_incomes_delete
    ON plan_incomes FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_expenses
CREATE POLICY pol_plan_expenses_select
    ON plan_expenses FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_expenses_insert
    ON plan_expenses FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_expenses_update
    ON plan_expenses FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_expenses_delete
    ON plan_expenses FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_debts
CREATE POLICY pol_plan_debts_select
    ON plan_debts FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_debts_insert
    ON plan_debts FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_debts_update
    ON plan_debts FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_debts_delete
    ON plan_debts FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_cash_reserves
CREATE POLICY pol_plan_cash_reserves_select
    ON plan_cash_reserves FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_cash_reserves_insert
    ON plan_cash_reserves FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_cash_reserves_update
    ON plan_cash_reserves FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_cash_reserves_delete
    ON plan_cash_reserves FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_brokerages
CREATE POLICY pol_plan_brokerages_select
    ON plan_brokerages FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_brokerages_insert
    ON plan_brokerages FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_brokerages_update
    ON plan_brokerages FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_brokerages_delete
    ON plan_brokerages FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_iras
CREATE POLICY pol_plan_iras_select
    ON plan_iras FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_iras_insert
    ON plan_iras FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_iras_update
    ON plan_iras FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_iras_delete
    ON plan_iras FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_roth_iras
CREATE POLICY pol_plan_roth_iras_select
    ON plan_roth_iras FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_roth_iras_insert
    ON plan_roth_iras FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_roth_iras_update
    ON plan_roth_iras FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_roth_iras_delete
    ON plan_roth_iras FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_hsas
CREATE POLICY pol_plan_hsas_select
    ON plan_hsas FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_hsas_insert
    ON plan_hsas FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_hsas_update
    ON plan_hsas FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_hsas_delete
    ON plan_hsas FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

-- plan_tax_deferreds
CREATE POLICY pol_plan_tax_deferreds_select
    ON plan_tax_deferreds FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_tax_deferreds_insert
    ON plan_tax_deferreds FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_tax_deferreds_update
    ON plan_tax_deferreds FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())))
    WITH CHECK (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));

CREATE POLICY pol_plan_tax_deferreds_delete
    ON plan_tax_deferreds FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM plan p WHERE p.id = plan_id AND p.creator_id = (select auth.uid())));


-- ================================================
-- SECTION 6: TEMPLATE TABLES
-- SELECT is open to all authenticated users.
-- INSERT, UPDATE, DELETE restricted to admins only
-- (is_admin = true in profiles).
-- ================================================

-- income_template
CREATE POLICY pol_income_template_select
    ON income_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_income_template_insert
    ON income_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_income_template_update
    ON income_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_income_template_delete
    ON income_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- expense_template
CREATE POLICY pol_expense_template_select
    ON expense_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_expense_template_insert
    ON expense_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_expense_template_update
    ON expense_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_expense_template_delete
    ON expense_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- debt_template
CREATE POLICY pol_debt_template_select
    ON debt_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_debt_template_insert
    ON debt_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_debt_template_update
    ON debt_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_debt_template_delete
    ON debt_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- cash_reserve_template
CREATE POLICY pol_cash_reserve_template_select
    ON cash_reserve_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_cash_reserve_template_insert
    ON cash_reserve_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_cash_reserve_template_update
    ON cash_reserve_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_cash_reserve_template_delete
    ON cash_reserve_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- brokerage_template
CREATE POLICY pol_brokerage_template_select
    ON brokerage_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_brokerage_template_insert
    ON brokerage_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_brokerage_template_update
    ON brokerage_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_brokerage_template_delete
    ON brokerage_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- ira_template
CREATE POLICY pol_ira_template_select
    ON ira_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_ira_template_insert
    ON ira_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_ira_template_update
    ON ira_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_ira_template_delete
    ON ira_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- roth_ira_template
CREATE POLICY pol_roth_ira_template_select
    ON roth_ira_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_roth_ira_template_insert
    ON roth_ira_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_roth_ira_template_update
    ON roth_ira_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_roth_ira_template_delete
    ON roth_ira_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- hsa_template
CREATE POLICY pol_hsa_template_select
    ON hsa_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_hsa_template_insert
    ON hsa_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_hsa_template_update
    ON hsa_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_hsa_template_delete
    ON hsa_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- tax_deferred_template
CREATE POLICY pol_tax_deferred_template_select
    ON tax_deferred_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_tax_deferred_template_insert
    ON tax_deferred_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_tax_deferred_template_update
    ON tax_deferred_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_tax_deferred_template_delete
    ON tax_deferred_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template
CREATE POLICY pol_plan_template_select
    ON plan_template FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_insert
    ON plan_template FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_update
    ON plan_template FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_delete
    ON plan_template FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));


-- ================================================
-- SECTION 7: TEMPLATE JUNCTION TABLES
-- SELECT open to all authenticated users.
-- INSERT, UPDATE, DELETE restricted to admins only.
-- ================================================

-- plan_template_income_templates
CREATE POLICY pol_plan_template_income_templates_select
    ON plan_template_income_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_income_templates_insert
    ON plan_template_income_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_income_templates_update
    ON plan_template_income_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_income_templates_delete
    ON plan_template_income_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_expense_templates
CREATE POLICY pol_plan_template_expense_templates_select
    ON plan_template_expense_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_expense_templates_insert
    ON plan_template_expense_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_expense_templates_update
    ON plan_template_expense_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_expense_templates_delete
    ON plan_template_expense_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_debt_templates
CREATE POLICY pol_plan_template_debt_templates_select
    ON plan_template_debt_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_debt_templates_insert
    ON plan_template_debt_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_debt_templates_update
    ON plan_template_debt_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_debt_templates_delete
    ON plan_template_debt_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_cash_reserve_templates
CREATE POLICY pol_plan_template_cash_reserve_templates_select
    ON plan_template_cash_reserve_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_cash_reserve_templates_insert
    ON plan_template_cash_reserve_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_cash_reserve_templates_update
    ON plan_template_cash_reserve_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_cash_reserve_templates_delete
    ON plan_template_cash_reserve_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_brokerage_templates
CREATE POLICY pol_plan_template_brokerage_templates_select
    ON plan_template_brokerage_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_brokerage_templates_insert
    ON plan_template_brokerage_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_brokerage_templates_update
    ON plan_template_brokerage_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_brokerage_templates_delete
    ON plan_template_brokerage_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_ira_templates
CREATE POLICY pol_plan_template_ira_templates_select
    ON plan_template_ira_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_ira_templates_insert
    ON plan_template_ira_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_ira_templates_update
    ON plan_template_ira_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_ira_templates_delete
    ON plan_template_ira_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_roth_ira_templates
CREATE POLICY pol_plan_template_roth_ira_templates_select
    ON plan_template_roth_ira_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_roth_ira_templates_insert
    ON plan_template_roth_ira_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_roth_ira_templates_update
    ON plan_template_roth_ira_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_roth_ira_templates_delete
    ON plan_template_roth_ira_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_hsa_templates
CREATE POLICY pol_plan_template_hsa_templates_select
    ON plan_template_hsa_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_hsa_templates_insert
    ON plan_template_hsa_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_hsa_templates_update
    ON plan_template_hsa_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_hsa_templates_delete
    ON plan_template_hsa_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

-- plan_template_tax_deferred_templates
CREATE POLICY pol_plan_template_tax_deferred_templates_select
    ON plan_template_tax_deferred_templates FOR SELECT TO authenticated
    USING (true);

CREATE POLICY pol_plan_template_tax_deferred_templates_insert
    ON plan_template_tax_deferred_templates FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_tax_deferred_templates_update
    ON plan_template_tax_deferred_templates FOR UPDATE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));

CREATE POLICY pol_plan_template_tax_deferred_templates_delete
    ON plan_template_tax_deferred_templates FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles WHERE user_id = (select auth.uid()) AND is_admin = true));
