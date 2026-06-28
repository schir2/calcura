begin;

select plan(4);

-- Insert 2 users; on_user_created SECURITY DEFINER trigger should auto-create profiles
insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

-- 1 & 2. Verify profiles were auto-created (checked as postgres to bypass profiles RLS)
select ok(
    (select count(*) = 1 from profiles where user_id = '00000000-0000-0000-0000-000000000001'::uuid),
    'auth.users insert auto-creates profile for user_a via SECURITY DEFINER trigger'
);
select ok(
    (select count(*) = 1 from profiles where user_id = '00000000-0000-0000-0000-000000000002'::uuid),
    'auth.users insert auto-creates profile for user_b via SECURITY DEFINER trigger'
);

-- Setup plan as postgres (bypasses RLS)
insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('SD Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

-- Switch to authenticated role as user_a and insert income
-- The on_income_insert SECURITY DEFINER trigger writes to command despite RLS restrictions
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');

-- 3. Authenticated user can insert income (RLS allows own-creator_id inserts)
select lives_ok(
    $$insert into income (name, gross_income, growth_rate, plan_id, creator_id)
      select 'SD Income', 50000, 0.03, id, '00000000-0000-0000-0000-000000000001'
      from plan where name = 'SD Test Plan'$$,
    'authenticated user can insert income'
);

-- 4. command row created by SECURITY DEFINER trigger is visible to the inserting user
--    (trigger sets creator_id = auth.uid(), so the row passes the command SELECT policy)
select isnt_empty(
    $$select * from command where model_name = 'income'::model_name$$,
    'SECURITY DEFINER trigger created command row visible to authenticated inserter'
);

select * from finish();

rollback;
