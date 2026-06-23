begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('CSC Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

insert into command (model_name, model_id, action, creator_id)
values
    ('plan', 1, 'cmd_1', '00000000-0000-0000-0000-000000000001'),
    ('plan', 2, 'cmd_2', '00000000-0000-0000-0000-000000000001');

insert into command_sequence (name, plan_id, creator_id)
select 'Test Sequence', id, '00000000-0000-0000-0000-000000000001' from plan where name = 'CSC Test Plan';

insert into command_sequence_command (sequence_id, command_id, "order")
select cs.id, c.id, 1
from command_sequence cs, command c
where cs.name = 'Test Sequence' and c.action = 'cmd_1';

-- Store IDs for cross-role use
create temp table csc_test_vars as
select cs.id as sequence_id, c.id as cmd2_id
from command_sequence cs, command c
where cs.name = 'Test Sequence' and c.action = 'cmd_2';

-- 1. owner sees own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from command_sequence_command', 'user_a sees own command_sequence_command');

-- 2. other user cannot see owner's row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from command_sequence_command', 'user_b cannot see user_a command_sequence_command');

-- 3. owner can insert own row (link cmd_2 to sequence)
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into command_sequence_command (sequence_id, command_id, "order") select sequence_id, cmd2_id, 2 from csc_test_vars$$,
    'user_a can insert own command_sequence_command'
);

-- 4. other user cannot insert into user_a's sequence
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into command_sequence_command (sequence_id, command_id, "order") select sequence_id, cmd2_id, 3 from csc_test_vars$$,
    '42501',
    NULL,
    'user_b cannot insert into user_a command_sequence'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from command_sequence_command$$,
    'user_b delete on command_sequence_command is silent'
);

-- 6. owner's row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from command_sequence_command', 'user_a command_sequence_command row survives user_b delete attempt');

select * from finish();

rollback;
