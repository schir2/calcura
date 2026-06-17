begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into brokerage (name, growth_rate, initial_balance, creator_id) values
    ('Brokerage 1', 0.07, 10000, '00000000-0000-0000-0000-000000000001'),
    ('Brokerage 2', 0.08, 20000, '00000000-0000-0000-0000-000000000001'),
    ('Brokerage 3', 0.09, 30000, '00000000-0000-0000-0000-000000000001');

insert into plan_brokerages (plan_id, brokerage_id)
select p.id, b.id from plan p, brokerage b where p.name = 'Test Plan' and b.name = 'Brokerage 1';

create temp table pb_test_vars as
select p.id as plan_id, b2.id as b2_id, b3.id as b3_id
from plan p, brokerage b2, brokerage b3
where p.name = 'Test Plan' and b2.name = 'Brokerage 2' and b3.name = 'Brokerage 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_brokerages', 'user_a sees own plan_brokerages');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_brokerages', 'user_b cannot see user_a plan_brokerages');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_brokerages (plan_id, brokerage_id) select plan_id, b2_id from pb_test_vars$$,
    'user_a can insert into own plan_brokerages'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_brokerages (plan_id, brokerage_id) select plan_id, b3_id from pb_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_brokerages'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_brokerages$$,
    'user_b delete on plan_brokerages is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_brokerages', 'user_a plan_brokerages row survives user_b delete attempt');

select * from finish();

rollback;
