begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into debt (name, principal, interest_rate, payment_strategy, frequency, creator_id) values
    ('Debt 1', 10000, 0.05, 'fixed', 'monthly', '00000000-0000-0000-0000-000000000001'),
    ('Debt 2', 20000, 0.04, 'fixed', 'monthly', '00000000-0000-0000-0000-000000000001'),
    ('Debt 3', 30000, 0.03, 'fixed', 'monthly', '00000000-0000-0000-0000-000000000001');

insert into plan_debts (plan_id, debt_id)
select p.id, d.id from plan p, debt d where p.name = 'Test Plan' and d.name = 'Debt 1';

create temp table pd_test_vars as
select p.id as plan_id, d2.id as debt2_id, d3.id as debt3_id
from plan p, debt d2, debt d3
where p.name = 'Test Plan' and d2.name = 'Debt 2' and d3.name = 'Debt 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_debts', 'user_a sees own plan_debts');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_debts', 'user_b cannot see user_a plan_debts');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_debts (plan_id, debt_id) select plan_id, debt2_id from pd_test_vars$$,
    'user_a can insert into own plan_debts'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_debts (plan_id, debt_id) select plan_id, debt3_id from pd_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_debts'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_debts$$,
    'user_b delete on plan_debts is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_debts', 'user_a plan_debts row survives user_b delete attempt');

select * from finish();

rollback;
