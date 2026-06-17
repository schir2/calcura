begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into tax_deferred (name, growth_rate, initial_balance, elective_contribution_strategy, creator_id) values
    ('TD 1', 0.07, 10000, 'fixed', '00000000-0000-0000-0000-000000000001'),
    ('TD 2', 0.07, 15000, 'max', '00000000-0000-0000-0000-000000000001'),
    ('TD 3', 0.07, 20000, 'fixed', '00000000-0000-0000-0000-000000000001');

insert into plan_tax_deferreds (plan_id, tax_deferred_id)
select p.id, td.id from plan p, tax_deferred td where p.name = 'Test Plan' and td.name = 'TD 1';

create temp table ptd_test_vars as
select p.id as plan_id, td2.id as td2_id, td3.id as td3_id
from plan p, tax_deferred td2, tax_deferred td3
where p.name = 'Test Plan' and td2.name = 'TD 2' and td3.name = 'TD 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_tax_deferreds', 'user_a sees own plan_tax_deferreds');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_tax_deferreds', 'user_b cannot see user_a plan_tax_deferreds');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_tax_deferreds (plan_id, tax_deferred_id) select plan_id, td2_id from ptd_test_vars$$,
    'user_a can insert into own plan_tax_deferreds'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_tax_deferreds (plan_id, tax_deferred_id) select plan_id, td3_id from ptd_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_tax_deferreds'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_tax_deferreds$$,
    'user_b delete on plan_tax_deferreds is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_tax_deferreds', 'user_a plan_tax_deferreds row survives user_b delete attempt');

select * from finish();

rollback;
