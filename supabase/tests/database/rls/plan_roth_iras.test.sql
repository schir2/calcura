begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into roth_ira (name, growth_rate, initial_balance, creator_id) values
    ('Roth 1', 0.07, 5000, '00000000-0000-0000-0000-000000000001'),
    ('Roth 2', 0.07, 6000, '00000000-0000-0000-0000-000000000001'),
    ('Roth 3', 0.07, 7000, '00000000-0000-0000-0000-000000000001');

insert into plan_roth_iras (plan_id, roth_ira_id)
select p.id, r.id from plan p, roth_ira r where p.name = 'Test Plan' and r.name = 'Roth 1';

create temp table prira_test_vars as
select p.id as plan_id, r2.id as roth2_id, r3.id as roth3_id
from plan p, roth_ira r2, roth_ira r3
where p.name = 'Test Plan' and r2.name = 'Roth 2' and r3.name = 'Roth 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_roth_iras', 'user_a sees own plan_roth_iras');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_roth_iras', 'user_b cannot see user_a plan_roth_iras');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_roth_iras (plan_id, roth_ira_id) select plan_id, roth2_id from prira_test_vars$$,
    'user_a can insert into own plan_roth_iras'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_roth_iras (plan_id, roth_ira_id) select plan_id, roth3_id from prira_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_roth_iras'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_roth_iras$$,
    'user_b delete on plan_roth_iras is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_roth_iras', 'user_a plan_roth_iras row survives user_b delete attempt');

select * from finish();

rollback;
