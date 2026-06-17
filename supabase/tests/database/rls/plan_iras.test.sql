begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into ira (name, growth_rate, initial_balance, creator_id) values
    ('IRA 1', 0.07, 5000, '00000000-0000-0000-0000-000000000001'),
    ('IRA 2', 0.07, 6000, '00000000-0000-0000-0000-000000000001'),
    ('IRA 3', 0.07, 7000, '00000000-0000-0000-0000-000000000001');

insert into plan_iras (plan_id, ira_id)
select p.id, i.id from plan p, ira i where p.name = 'Test Plan' and i.name = 'IRA 1';

create temp table pira_test_vars as
select p.id as plan_id, i2.id as ira2_id, i3.id as ira3_id
from plan p, ira i2, ira i3
where p.name = 'Test Plan' and i2.name = 'IRA 2' and i3.name = 'IRA 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_iras', 'user_a sees own plan_iras');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_iras', 'user_b cannot see user_a plan_iras');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_iras (plan_id, ira_id) select plan_id, ira2_id from pira_test_vars$$,
    'user_a can insert into own plan_iras'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_iras (plan_id, ira_id) select plan_id, ira3_id from pira_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_iras'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_iras$$,
    'user_b delete on plan_iras is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_iras', 'user_a plan_iras row survives user_b delete attempt');

select * from finish();

rollback;
