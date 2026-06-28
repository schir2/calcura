begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('RLS Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

create temp table t_plan as select id as plan_id from plan where name = 'RLS Test Plan';
grant select on t_plan to authenticated;

insert into hsa (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test HSA', 0.06, 2000, plan_id, '00000000-0000-0000-0000-000000000001' from t_plan;

-- 1. owner sees own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from hsa', 'user_a sees own hsa');

-- 2. other user cannot see owner's row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from hsa', 'user_b cannot see user_a hsa');

-- 3. owner can insert own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into hsa (name, growth_rate, initial_balance, plan_id, creator_id) select 'HSA 2', 0.05, 1000, plan_id, '00000000-0000-0000-0000-000000000001' from t_plan$$,
    'user_a can insert own hsa'
);

-- 4. other user cannot insert claiming owner's creator_id
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into hsa (name, growth_rate, initial_balance, plan_id, creator_id) select 'Stolen', 0.06, 2000, plan_id, '00000000-0000-0000-0000-000000000001' from t_plan$$,
    '42501',
    NULL,
    'user_b cannot insert hsa with user_a creator_id'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from hsa$$,
    'user_b delete on hsa is silent'
);

-- 6. owner's row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from hsa', 'user_a hsa row survives user_b delete attempt');

select * from finish();

rollback;
