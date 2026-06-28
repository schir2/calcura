begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

-- Insert plan + income; the insert trigger creates the command row for user_a
insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Command RLS Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into income (name, gross_income, growth_rate, plan_id, creator_id)
select 'Command RLS Income', 50000, 0.03, id, '00000000-0000-0000-0000-000000000001'
from plan where name = 'Command RLS Plan';

-- 1. owner sees own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from command', 'user_a sees own command');

-- 2. other user cannot see owner's row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from command', 'user_b cannot see user_a command');

-- 3. owner can insert own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into command (model_name, model_id, action, creator_id) values ('expense', 999, 'another_action', '00000000-0000-0000-0000-000000000001')$$,
    'user_a can insert own command'
);

-- 4. other user cannot insert claiming owner's creator_id
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into command (model_name, model_id, action, creator_id) values ('expense', 999, 'stolen', '00000000-0000-0000-0000-000000000001')$$,
    '42501',
    NULL,
    'user_b cannot insert command with user_a creator_id'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from command$$,
    'user_b delete on command is silent'
);

-- 6. owner's row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from command', 'user_a command row survives user_b delete attempt');

select * from finish();

rollback;
