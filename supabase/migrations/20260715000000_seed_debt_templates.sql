-- Seed debt templates so template selection has real starting points in the Entity Workspace (#136).
-- Idempotent: skips names already present.
INSERT INTO debt_template (name, principal, interest_rate, payment_minimum, payment_strategy, payment_fixed_amount, payment_percentage, frequency, description)
SELECT *
FROM (VALUES
    ('Credit Card', 6000, 22.9, 150, 'percentage_of_debt'::debt_payment_strategy, 0, 3, 'monthly'::frequency, 'Revolving high-interest balance paid as a share of what you owe.'),
    ('Auto Loan', 25000, 7.5, 450, 'fixed'::debt_payment_strategy, 450, 0, 'monthly'::frequency, 'Fixed-term car loan with a level monthly payment.'),
    ('Student Loan', 30000, 5.5, 300, 'fixed'::debt_payment_strategy, 300, 0, 'monthly'::frequency, 'Standard 10-year repayment with a fixed monthly payment.'),
    ('Mortgage', 300000, 6.5, 1900, 'fixed'::debt_payment_strategy, 1900, 0, 'monthly'::frequency, 'Fixed-rate home loan amortized over the life of the loan.')
) AS seed(name, principal, interest_rate, payment_minimum, payment_strategy, payment_fixed_amount, payment_percentage, frequency, description)
WHERE NOT EXISTS (SELECT 1 FROM debt_template dt WHERE dt.name = seed.name);
