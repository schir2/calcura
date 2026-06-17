begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into income (name, gross_income, growth_rate, creator_id) values
    ('Income 1', 50000, 0.03, '00000000-0000-0000-0000-000000000001'),
    ('Income 2', 60000, 0.03, '00000000-0000-0000-0000-000000000001'),
    ('Income 3', 70000, 0.03, '00000000-0000-0000-0000-000000000001');

insert into plan_incomes (plan_id, income_id)
select p.id, i.id from plan p, income i where p.name = 'Test Plan' and i.name = 'Income 1';

-- Store IDs for cross-role use
create temp table pi_test_vars as
select p.id as plan_id, i2.id as income2_id, i3.id as income3_id
from plan p, income i2, income i3
where p.name = 'Test Plan' and i2.name = 'Income 2' and i3.name = 'Income 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_incomes', 'user_a sees own plan_incomes');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_incomes', 'user_b cannot see user_a plan_incomes');

-- 3. owner can link another income to own plan
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_incomes (plan_id, income_id) select plan_id, income2_id from pi_test_vars$$,
    'user_a can insert into own plan_incomes'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_incomes (plan_id, income_id) select plan_id, income3_id from pi_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_incomes'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_incomes$$,
    'user_b delete on plan_incomes is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_incomes', 'user_a plan_incomes row survives user_b delete attempt');

select * from finish();

rollback;
