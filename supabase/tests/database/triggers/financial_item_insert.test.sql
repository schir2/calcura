begin;

select plan(27);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Insert Trigger Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

-- Every assertion below is scoped to THIS plan's rows.
--
-- They used to count globally (`count(*) = 1 from command where model_name = 'income'`), which
-- silently assumed an empty database: the moment the local dev DB held a single real income, the
-- count exceeded 1 and twelve assertions failed for reasons that had nothing to do with the
-- triggers. A trigger test must assert on what the trigger did, not on what else lives in the DB.
select set_config('tests.plan_id',
                  (select id::text from plan where name = 'Insert Trigger Test Plan'),
                  true);

-- Insert all 9 financial item types, each linked to the plan
insert into income (name, gross_income, growth_rate, plan_id, creator_id)
select 'Test Income', 50000, 0.03, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into expense (name, amount, growth_rate, expense_type, frequency, plan_id, creator_id)
select 'Test Expense', 1000, 0.02, 'fixed'::expense_type, 'annual'::frequency, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into debt (name, principal, interest_rate, payment_strategy, frequency, plan_id, creator_id)
select 'Test Debt', 10000, 0.05, 'fixed'::debt_payment_strategy, 'monthly'::frequency, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into cash_reserve (name, initial_amount, cash_reserve_strategy, plan_id, creator_id)
select 'Test Cash Reserve', 5000, 'fixed'::cash_reserve_strategy, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into brokerage (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test Brokerage', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into ira (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test IRA', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into roth_ira (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test Roth IRA', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into hsa (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test HSA', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

insert into tax_deferred (name, growth_rate, initial_balance, elective_contribution_strategy, plan_id, creator_id)
select 'Test Tax Deferred', 0.07, 10000, 'fixed'::tax_deferred_contribution_strategy, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Insert Trigger Test Plan';

-- income
select ok((select count(*) = 1 from command c join income i on i.id = c.model_id where c.model_name = 'income'::model_name and i.plan_id = current_setting('tests.plan_id')::bigint), 'income insert creates 1 command row');
select ok(exists(select 1 from command c join income i on i.id = c.model_id where c.model_name = 'income'::model_name and i.name = 'Test Income' and i.plan_id = current_setting('tests.plan_id')::bigint), 'income command.model_id references inserted income row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'income'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'income command linked to plan command_sequence');

-- expense
select ok((select count(*) = 1 from command c join expense e on e.id = c.model_id where c.model_name = 'expense'::model_name and e.plan_id = current_setting('tests.plan_id')::bigint), 'expense insert creates 1 command row');
select ok(exists(select 1 from command c join expense e on e.id = c.model_id where c.model_name = 'expense'::model_name and e.name = 'Test Expense' and e.plan_id = current_setting('tests.plan_id')::bigint), 'expense command.model_id references inserted expense row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'expense'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'expense command linked to plan command_sequence');

-- debt
select ok((select count(*) = 1 from command c join debt d on d.id = c.model_id where c.model_name = 'debt'::model_name and d.plan_id = current_setting('tests.plan_id')::bigint), 'debt insert creates 1 command row');
select ok(exists(select 1 from command c join debt d on d.id = c.model_id where c.model_name = 'debt'::model_name and d.name = 'Test Debt' and d.plan_id = current_setting('tests.plan_id')::bigint), 'debt command.model_id references inserted debt row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'debt'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'debt command linked to plan command_sequence');

-- cash_reserve
select ok((select count(*) = 1 from command c join cash_reserve cr on cr.id = c.model_id where c.model_name = 'cash_reserve'::model_name and cr.plan_id = current_setting('tests.plan_id')::bigint), 'cash_reserve insert creates 1 command row');
select ok(exists(select 1 from command c join cash_reserve cr on cr.id = c.model_id where c.model_name = 'cash_reserve'::model_name and cr.name = 'Test Cash Reserve' and cr.plan_id = current_setting('tests.plan_id')::bigint), 'cash_reserve command.model_id references inserted cash_reserve row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'cash_reserve'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'cash_reserve command linked to plan command_sequence');

-- brokerage
select ok((select count(*) = 1 from command c join brokerage b on b.id = c.model_id where c.model_name = 'brokerage'::model_name and b.plan_id = current_setting('tests.plan_id')::bigint), 'brokerage insert creates 1 command row');
select ok(exists(select 1 from command c join brokerage b on b.id = c.model_id where c.model_name = 'brokerage'::model_name and b.name = 'Test Brokerage' and b.plan_id = current_setting('tests.plan_id')::bigint), 'brokerage command.model_id references inserted brokerage row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'brokerage'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'brokerage command linked to plan command_sequence');

-- ira
select ok((select count(*) = 1 from command c join ira i on i.id = c.model_id where c.model_name = 'ira'::model_name and i.plan_id = current_setting('tests.plan_id')::bigint), 'ira insert creates 1 command row');
select ok(exists(select 1 from command c join ira i on i.id = c.model_id where c.model_name = 'ira'::model_name and i.name = 'Test IRA' and i.plan_id = current_setting('tests.plan_id')::bigint), 'ira command.model_id references inserted ira row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'ira'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'ira command linked to plan command_sequence');

-- roth_ira
select ok((select count(*) = 1 from command c join roth_ira ri on ri.id = c.model_id where c.model_name = 'roth_ira'::model_name and ri.plan_id = current_setting('tests.plan_id')::bigint), 'roth_ira insert creates 1 command row');
select ok(exists(select 1 from command c join roth_ira ri on ri.id = c.model_id where c.model_name = 'roth_ira'::model_name and ri.name = 'Test Roth IRA' and ri.plan_id = current_setting('tests.plan_id')::bigint), 'roth_ira command.model_id references inserted roth_ira row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'roth_ira'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'roth_ira command linked to plan command_sequence');

-- hsa
select ok((select count(*) = 1 from command c join hsa h on h.id = c.model_id where c.model_name = 'hsa'::model_name and h.plan_id = current_setting('tests.plan_id')::bigint), 'hsa insert creates 1 command row');
select ok(exists(select 1 from command c join hsa h on h.id = c.model_id where c.model_name = 'hsa'::model_name and h.name = 'Test HSA' and h.plan_id = current_setting('tests.plan_id')::bigint), 'hsa command.model_id references inserted hsa row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'hsa'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'hsa command linked to plan command_sequence');

-- tax_deferred
select ok((select count(*) = 1 from command c join tax_deferred td on td.id = c.model_id where c.model_name = 'tax_deferred'::model_name and td.plan_id = current_setting('tests.plan_id')::bigint), 'tax_deferred insert creates 1 command row');
select ok(exists(select 1 from command c join tax_deferred td on td.id = c.model_id where c.model_name = 'tax_deferred'::model_name and td.name = 'Test Tax Deferred' and td.plan_id = current_setting('tests.plan_id')::bigint), 'tax_deferred command.model_id references inserted tax_deferred row');
select ok((select count(*) = 1 from command_sequence_command csc join command c on c.id = csc.command_id join command_sequence cs on cs.id = csc.sequence_id where c.model_name = 'tax_deferred'::model_name and cs.plan_id = current_setting('tests.plan_id')::bigint), 'tax_deferred command linked to plan command_sequence');

select * from finish();

rollback;
