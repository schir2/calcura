begin;

select plan(2);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Trigger Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

-- 1. plan insert creates exactly one command_sequence named after the plan
select ok(
    (select count(*) = 1 from command_sequence where name = 'Trigger Test Plan'),
    'plan insert creates command_sequence named after the plan'
);

-- 2. command_sequence.plan_id matches the inserted plan's id
select ok(
    (select cs.plan_id = p.id
     from command_sequence cs
     join plan p on p.name = 'Trigger Test Plan'
     where cs.name = 'Trigger Test Plan'),
    'command_sequence plan_id matches inserted plan id'
);

select * from finish();

rollback;
