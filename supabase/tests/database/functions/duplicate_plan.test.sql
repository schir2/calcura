begin;

select plan(12);

-- ------------------------------------------------
-- Fixture, built as postgres with an explicit creator_id (auth.uid() is NULL for this role).
-- The insert triggers COALESCE(NEW.creator_id, auth.uid()), so the auto-created commands and
-- the default sequence inherit user A as well.
-- ------------------------------------------------
insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at,
                        aud, role)
values ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(),
        'authenticated', 'authenticated'),
       ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(),
        'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy,
                  retirement_strategy, retirement_age, creator_id)
values ('Source Plan', 3, 6, 20, 85, 'age', 65, '00000000-0000-0000-0000-000000000001');

insert into income (plan_id, name, gross_income, growth_rate, income_type, frequency, creator_id)
select id, 'Salary', 100000, 2, 'ordinary', 'annual', '00000000-0000-0000-0000-000000000001'
from plan
where name = 'Source Plan';

-- The 401(k) is funded as a percentage of that income (ADR 006). This is the row whose income_id
-- must end up pointing at the COPIED income rather than the source's.
insert into tax_deferred (plan_id, name, growth_rate, initial_balance,
                          elective_contribution_strategy, elective_contribution_percentage,
                          income_id, creator_id)
select p.id,
       '401k',
       6,
       50000,
       'percentage_of_income',
       6,
       i.id,
       '00000000-0000-0000-0000-000000000001'
from plan p
         join income i on i.plan_id = p.id
where p.name = 'Source Plan';

insert into brokerage (plan_id, name, growth_rate, initial_balance, contribution_strategy,
                       contribution_fixed_amount, creator_id)
select id, 'Taxable', 6, 10000, 'fixed', 5000, '00000000-0000-0000-0000-000000000001'
from plan
where name = 'Source Plan';

-- A second sequence, so the copy must reproduce more than the one auto-created default.
insert into command_sequence (name, plan_id, ordering_type, creator_id)
select 'Alternate', id, 'custom', '00000000-0000-0000-0000-000000000001'
from plan
where name = 'Source Plan';

-- Deactivate the brokerage command inside Alternate and give it a distinctive order, so we can
-- prove per-sequence is_active/order survive rather than being reset to the insert trigger's
-- defaults (TRUE / appended).
update command_sequence_command csc
set is_active = false,
    "order"   = 99
from command cmd,
     command_sequence cs,
     plan p
where csc.command_id = cmd.id
  and csc.sequence_id = cs.id
  and cs.plan_id = p.id
  and p.name = 'Source Plan'
  and cs.name = 'Alternate'
  and cmd.model_name = 'brokerage';

-- Stash the real plan id while still unrestricted. User B must attack it BY ID: if the test
-- looked it up by name as user B, RLS would return NULL and the function would throw for the
-- wrong reason, proving nothing about ownership.
select set_config('tests.source_plan_id',
                  (select id::text from plan where name = 'Source Plan'),
                  true);

-- ------------------------------------------------
-- Duplicate, as the owning user.
-- ------------------------------------------------
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');

select lives_ok(
               $$select duplicate_plan((select id from plan where name = 'Source Plan'))$$,
               'the owner can duplicate their own plan'
       );

select isnt_empty(
               $$select 1 from plan where name = 'Source Plan (copy)'$$,
               'the copy exists, named with a (copy) suffix'
       );

select ok(
               (select id from plan where name = 'Source Plan (copy)') <>
               (select id from plan where name = 'Source Plan'),
               'the copy is a distinct plan row'
       );

-- ------------------------------------------------
-- Entities are copied as new rows.
-- ------------------------------------------------
select is(
               (select count(*)::int
                from income
                where plan_id = (select id from plan where name = 'Source Plan (copy)')),
               1,
               'the income is copied'
       );

select is(
               (select count(*)::int
                from tax_deferred
                where plan_id = (select id from plan where name = 'Source Plan (copy)')),
               1,
               'the tax_deferred is copied'
       );

select ok(
               (select i.id
                from income i
                where i.plan_id = (select id from plan where name = 'Source Plan (copy)')) <>
               (select i.id
                from income i
                where i.plan_id = (select id from plan where name = 'Source Plan')),
               'the copied income is a new row, not the source row re-parented'
       );

-- ------------------------------------------------
-- THE critical assertion. If income_id were carried over verbatim, the copy's 401(k) would be
-- funded by the SOURCE plan's salary, and the two "independent" scenarios would be coupled.
-- ------------------------------------------------
select is(
               (select td.income_id
                from tax_deferred td
                where td.plan_id = (select id from plan where name = 'Source Plan (copy)')),
               (select i.id
                from income i
                where i.plan_id = (select id from plan where name = 'Source Plan (copy)')),
               'the copied 401(k) income_id points at the COPIED income'
       );

select is_empty(
               $$select 1
                 from tax_deferred td
                          join income i on i.id = td.income_id
                 where td.plan_id = (select id from plan where name = 'Source Plan (copy)')
                   and i.plan_id = (select id from plan where name = 'Source Plan')$$,
               'no copied account references an income belonging to the source plan'
       );

-- ------------------------------------------------
-- Command sequences.
-- ------------------------------------------------
select is(
               (select count(*)::int
                from command_sequence
                where plan_id = (select id from plan where name = 'Source Plan (copy)')),
               (select count(*)::int
                from command_sequence
                where plan_id = (select id from plan where name = 'Source Plan')),
               'the copy has the same sequence count as the source (no stray auto-created default)'
       );

select is_empty(
               $$select 1
                 from command_sequence cs
                          join command_sequence_command csc on csc.sequence_id = cs.id
                          join command cmd on cmd.id = csc.command_id
                          join income i on i.id = cmd.model_id and cmd.model_name = 'income'
                 where cs.plan_id = (select id from plan where name = 'Source Plan (copy)')
                   and i.plan_id = (select id from plan where name = 'Source Plan')$$,
               'no command on the copy targets an entity belonging to the source plan'
       );

select is(
               (select csc.is_active
                from command_sequence cs
                         join command_sequence_command csc on csc.sequence_id = cs.id
                         join command cmd on cmd.id = csc.command_id
                where cs.plan_id = (select id from plan where name = 'Source Plan (copy)')
                  and cs.name = 'Alternate'
                  and cmd.model_name = 'brokerage'),
               false,
               'per-sequence is_active survives the copy (deactivated brokerage stays deactivated)'
       );

-- ------------------------------------------------
-- Ownership. RLS hides the source plan from user B, so the function finds nothing to copy.
-- ------------------------------------------------
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');

-- P0002 = PL/pgSQL's no_data_found. Deliberately a not-found, not a permission error: RLS hides
-- the plan from user B, so the function must not confirm that it exists.
select throws_ok(
               $$select duplicate_plan(current_setting('tests.source_plan_id')::bigint)$$,
               'P0002',
               NULL,
               'a user cannot duplicate a plan they do not own, even knowing its id'
       );

select * from finish();

rollback;
