begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into hsa (name, growth_rate, initial_balance, creator_id) values
    ('HSA 1', 0.06, 2000, '00000000-0000-0000-0000-000000000001'),
    ('HSA 2', 0.06, 3000, '00000000-0000-0000-0000-000000000001'),
    ('HSA 3', 0.06, 4000, '00000000-0000-0000-0000-000000000001');

insert into plan_hsas (plan_id, hsa_id)
select p.id, h.id from plan p, hsa h where p.name = 'Test Plan' and h.name = 'HSA 1';

create temp table phsa_test_vars as
select p.id as plan_id, h2.id as hsa2_id, h3.id as hsa3_id
from plan p, hsa h2, hsa h3
where p.name = 'Test Plan' and h2.name = 'HSA 2' and h3.name = 'HSA 3';

-- 1. owner sees own junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_hsas', 'user_a sees own plan_hsas');

-- 2. other user cannot see owner's junction row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from plan_hsas', 'user_b cannot see user_a plan_hsas');

-- 3. owner can insert into own plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into plan_hsas (plan_id, hsa_id) select plan_id, hsa2_id from phsa_test_vars$$,
    'user_a can insert into own plan_hsas'
);

-- 4. other user cannot insert into owner's plan junction
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into plan_hsas (plan_id, hsa_id) select plan_id, hsa3_id from phsa_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a plan_hsas'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_hsas$$,
    'user_b delete on plan_hsas is silent'
);

-- 6. owner's junction row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_hsas', 'user_a plan_hsas row survives user_b delete attempt');

select * from finish();

rollback;
