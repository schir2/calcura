begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('CS Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into command_sequence (name, plan_id, creator_id)
select 'Test Sequence', id, '00000000-0000-0000-0000-000000000001' from plan where name = 'CS Test Plan';

-- Store plan_id for cross-role use
create temp table cs_test_vars as
select id as plan_id from plan where name = 'CS Test Plan';
grant select on cs_test_vars to authenticated;

-- 1. owner sees own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from command_sequence', 'user_a sees own command_sequence');

-- 2. other user cannot see owner's row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from command_sequence', 'user_b cannot see user_a command_sequence');

-- 3. owner can insert own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into command_sequence (name, plan_id, creator_id) select 'Sequence 2', plan_id, '00000000-0000-0000-0000-000000000001' from cs_test_vars$$,
    'user_a can insert own command_sequence'
);

-- 4. other user cannot insert claiming owner's creator_id
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into command_sequence (name, plan_id, creator_id) select 'Stolen', plan_id, '00000000-0000-0000-0000-000000000001' from cs_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert command_sequence with user_a creator_id'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from command_sequence$$,
    'user_b delete on command_sequence is silent'
);

-- 6. owner's row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from command_sequence', 'user_a command_sequence row survives user_b delete attempt');

select * from finish();

rollback;
