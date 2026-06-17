begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into cash_reserve (name, initial_amount, cash_reserve_strategy, creator_id) values
    ('Reserve 1', 5000, 'fixed', '00000000-0000-0000-0000-000000000001'),
    ('Reserve 2', 8000, 'fixed', '00000000-0000-0000-0000-000000000001'),
    ('Reserve 3', 10000, 'variable', '00000000-0000-0000-0000-000000000001');

insert into plan_cash_reserves (plan_id, cash_reserve_id)
select p.id, cr.id from plan p, cash_reserve cr where p.name = 'Test Plan' and cr.name = 'Reserve 1';

create temp table pcr_test_vars as
select p.id as plan_id, cr2.id as cr2_id, cr3.id as cr3_id
from plan p, cash_reserve cr2, cash_reserve cr3
where p.name = 'Test Plan' and cr2.name = 'Reserve 2' and cr3.name = 'Reserve 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_cash_reserves', 'user_a sees own plan_cash_reserves');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_cash_reserves', 'user_b cannot see user_a plan_cash_reserves');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_cash_reserves (plan_id, cash_reserve_id) select plan_id, cr2_id from pcr_test_vars$$,
    'user_a can insert into own plan_cash_reserves'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_cash_reserves (plan_id, cash_reserve_id) select plan_id, cr3_id from pcr_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_cash_reserves'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_cash_reserves$$,
    'user_b delete on plan_cash_reserves is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_cash_reserves', 'user_a plan_cash_reserves row survives user_b delete attempt');

select * from finish();

rollback;
