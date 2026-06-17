begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into expense (name, amount, growth_rate, expense_type, frequency, creator_id) values
    ('Expense 1', 1000, 0.02, 'fixed', 'monthly', '00000000-0000-0000-0000-000000000001'),
    ('Expense 2', 2000, 0.02, 'fixed', 'monthly', '00000000-0000-0000-0000-000000000001'),
    ('Expense 3', 3000, 0.02, 'fixed', 'monthly', '00000000-0000-0000-0000-000000000001');

insert into plan_expenses (plan_id, expense_id)
select p.id, e.id from plan p, expense e where p.name = 'Test Plan' and e.name = 'Expense 1';

create temp table pe_test_vars as
select p.id as plan_id, e2.id as expense2_id, e3.id as expense3_id
from plan p, expense e2, expense e3
where p.name = 'Test Plan' and e2.name = 'Expense 2' and e3.name = 'Expense 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_expenses', 'user_a sees own plan_expenses');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_expenses', 'user_b cannot see user_a plan_expenses');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_expenses (plan_id, expense_id) select plan_id, expense2_id from pe_test_vars$$,
    'user_a can insert into own plan_expenses'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_expenses (plan_id, expense_id) select plan_id, expense3_id from pe_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_expenses'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_expenses$$,
    'user_b delete on plan_expenses is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_expenses', 'user_a plan_expenses row survives user_b delete attempt');

select * from finish();

rollback;
