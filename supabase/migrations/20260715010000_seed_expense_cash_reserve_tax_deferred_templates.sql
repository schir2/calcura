-- Seed templates for expense, cash_reserve, and tax_deferred so the Workspace pickers have real
-- starting points (#136). Idempotent: each row is skipped if its name already exists.

INSERT INTO expense_template (name, amount, growth_rate, expense_type, frequency, is_essential, grows_with_inflation, is_tax_deductible, description)
SELECT *
FROM (VALUES
    ('Rent / Mortgage', 1800, 3, 'fixed'::expense_type, 'monthly'::frequency, TRUE, TRUE, FALSE, 'Housing payment — the largest essential line for most households.'),
    ('Groceries', 600, 3, 'variable'::expense_type, 'monthly'::frequency, TRUE, TRUE, FALSE, 'Food and household staples.'),
    ('Utilities', 250, 3, 'fixed'::expense_type, 'monthly'::frequency, TRUE, TRUE, FALSE, 'Electricity, gas, water, internet.'),
    ('Insurance', 200, 3, 'fixed'::expense_type, 'monthly'::frequency, TRUE, TRUE, FALSE, 'Health, auto, and renters/home premiums.'),
    ('Transportation', 400, 3, 'variable'::expense_type, 'monthly'::frequency, TRUE, TRUE, FALSE, 'Fuel, transit, and vehicle upkeep.'),
    ('Healthcare', 300, 4, 'variable'::expense_type, 'monthly'::frequency, TRUE, TRUE, FALSE, 'Out-of-pocket medical, dental, and prescriptions.'),
    ('Discretionary', 500, 3, 'variable'::expense_type, 'monthly'::frequency, FALSE, TRUE, FALSE, 'Dining out, entertainment, and non-essential spending.')
) AS seed(name, amount, growth_rate, expense_type, frequency, is_essential, grows_with_inflation, is_tax_deductible, description)
WHERE NOT EXISTS (SELECT 1 FROM expense_template t WHERE t.name = seed.name);

INSERT INTO cash_reserve_template (name, initial_amount, cash_reserve_strategy, reserve_amount, reserve_months, description)
SELECT *
FROM (VALUES
    ('3-month emergency fund', 0, 'variable'::cash_reserve_strategy, NULL::numeric, 3, 'A lean safety net covering three months of expenses.'),
    ('6-month emergency fund', 0, 'variable'::cash_reserve_strategy, NULL::numeric, 6, 'The common rule of thumb — six months of expenses on hand.'),
    ('12-month safety net', 0, 'variable'::cash_reserve_strategy, NULL::numeric, 12, 'A conservative buffer for variable income or single earners.'),
    ('Fixed $10k buffer', 0, 'fixed'::cash_reserve_strategy, 10000, NULL::integer, 'A flat cash cushion regardless of monthly spending.')
) AS seed(name, initial_amount, cash_reserve_strategy, reserve_amount, reserve_months, description)
WHERE NOT EXISTS (SELECT 1 FROM cash_reserve_template t WHERE t.name = seed.name);

INSERT INTO tax_deferred_template (name, growth_rate, initial_balance, elective_contribution_strategy, elective_contribution_percentage, elective_contribution_fixed_amount, employer_contributes, employer_contribution_strategy, employer_match_percentage, employer_match_percentage_limit, employer_compensation_match_percentage, employer_contribution_fixed_amount, description)
SELECT *
FROM (VALUES
    ('401(k) — no employer match', 7, 0, 'percentage_of_income'::tax_deferred_contribution_strategy, 10, NULL::numeric, FALSE, NULL::employer_contribution_strategy, NULL::numeric, NULL::numeric, NULL::numeric, NULL::numeric, 'Contribute 10% of income with no employer contribution.'),
    ('401(k) — partial match (50% up to 6%)', 7, 0, 'percentage_of_income'::tax_deferred_contribution_strategy, 10, NULL::numeric, TRUE, 'percentage_of_contribution'::employer_contribution_strategy, 50, 6, NULL::numeric, NULL::numeric, 'Employer matches half of your contributions up to 6% of pay.'),
    ('401(k) — full match (100% up to 4%)', 7, 0, 'percentage_of_income'::tax_deferred_contribution_strategy, 10, NULL::numeric, TRUE, 'percentage_of_contribution'::employer_contribution_strategy, 100, 4, NULL::numeric, NULL::numeric, 'Employer matches every dollar up to 4% of pay.')
) AS seed(name, growth_rate, initial_balance, elective_contribution_strategy, elective_contribution_percentage, elective_contribution_fixed_amount, employer_contributes, employer_contribution_strategy, employer_match_percentage, employer_match_percentage_limit, employer_compensation_match_percentage, employer_contribution_fixed_amount, description)
WHERE NOT EXISTS (SELECT 1 FROM tax_deferred_template t WHERE t.name = seed.name);
