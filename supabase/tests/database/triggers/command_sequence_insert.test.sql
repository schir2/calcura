begin;

select plan(2);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

-- Plan insert auto-creates a command_sequence named 'CS Test Plan'
insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('CS Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

-- Insert 2 financial items; each insert trigger creates a command and links it to 'CS Test Plan' sequence
insert into income (name, gross_income, growth_rate, plan_id, creator_id)
select 'CS Income', 50000, 0.03, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'CS Test Plan';

insert into expense (name, amount, growth_rate, expense_type, frequency, plan_id, creator_id)
select 'CS Expense', 1000, 0.02, 'fixed'::expense_type, 'annual'::frequency, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'CS Test Plan';

-- 1. Original sequence has 2 command_sequence_command rows (one per inserted item)
select ok(
    (select count(*) = 2
     from command_sequence_command csc
     join command_sequence cs on cs.id = csc.sequence_id
     where cs.name = 'CS Test Plan'),
    'original command_sequence has 2 command links after inserting 2 financial items'
);

-- Insert a second sequence; on_command_sequence_created fires and auto-populates it
-- from all commands already associated with the plan
insert into command_sequence (name, plan_id, creator_id)
select 'CS Sequence 2', id, '00000000-0000-0000-0000-000000000001' from plan where name = 'CS Test Plan';

-- 2. New sequence is auto-populated with both existing commands
select ok(
    (select count(*) = 2
     from command_sequence_command csc
     join command_sequence cs on cs.id = csc.sequence_id
     where cs.name = 'CS Sequence 2'),
    'new command_sequence auto-populated with 2 command_sequence_command rows by trigger'
);

select * from finish();

rollback;
