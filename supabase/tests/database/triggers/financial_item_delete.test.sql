begin;

select plan(18);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into plan (name, inflation_rate, growth_rate, tax_rate, life_expectancy, creator_id)
values ('Delete Trigger Test Plan', 0.03, 0.07, 0.25, 90, '00000000-0000-0000-0000-000000000001');

-- Insert all 9 financial item types; each insert trigger creates a command and links it to the plan's sequence
insert into income (name, gross_income, growth_rate, plan_id, creator_id)
select 'Test Income', 50000, 0.03, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into expense (name, amount, growth_rate, expense_type, frequency, plan_id, creator_id)
select 'Test Expense', 1000, 0.02, 'fixed'::expense_type, 'annual'::frequency, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into debt (name, principal, interest_rate, payment_strategy, frequency, plan_id, creator_id)
select 'Test Debt', 10000, 0.05, 'fixed'::debt_payment_strategy, 'monthly'::frequency, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into cash_reserve (name, initial_amount, cash_reserve_strategy, plan_id, creator_id)
select 'Test Cash Reserve', 5000, 'fixed'::cash_reserve_strategy, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into brokerage (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test Brokerage', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into ira (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test IRA', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into roth_ira (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test Roth IRA', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into hsa (name, growth_rate, initial_balance, plan_id, creator_id)
select 'Test HSA', 0.07, 10000, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

insert into tax_deferred (name, growth_rate, initial_balance, elective_contribution_strategy, plan_id, creator_id)
select 'Test Tax Deferred', 0.07, 10000, 'fixed'::tax_deferred_contribution_strategy, id, '00000000-0000-0000-0000-000000000001' from plan where name = 'Delete Trigger Test Plan';

-- Reusable temp table: populated with the target command_id before each deletion
create temp table t_del_cmd (cmd_id bigint);

-- income
insert into t_del_cmd select c.id from command c join income i on i.name = 'Test Income' where c.model_name = 'income'::model_name and c.model_id = i.id;
delete from income where name = 'Test Income';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'income delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'income command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- expense
insert into t_del_cmd select c.id from command c join expense e on e.name = 'Test Expense' where c.model_name = 'expense'::model_name and c.model_id = e.id;
delete from expense where name = 'Test Expense';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'expense delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'expense command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- debt
insert into t_del_cmd select c.id from command c join debt d on d.name = 'Test Debt' where c.model_name = 'debt'::model_name and c.model_id = d.id;
delete from debt where name = 'Test Debt';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'debt delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'debt command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- cash_reserve
insert into t_del_cmd select c.id from command c join cash_reserve cr on cr.name = 'Test Cash Reserve' where c.model_name = 'cash_reserve'::model_name and c.model_id = cr.id;
delete from cash_reserve where name = 'Test Cash Reserve';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'cash_reserve delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'cash_reserve command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- brokerage
insert into t_del_cmd select c.id from command c join brokerage b on b.name = 'Test Brokerage' where c.model_name = 'brokerage'::model_name and c.model_id = b.id;
delete from brokerage where name = 'Test Brokerage';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'brokerage delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'brokerage command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- ira
insert into t_del_cmd select c.id from command c join ira i on i.name = 'Test IRA' where c.model_name = 'ira'::model_name and c.model_id = i.id;
delete from ira where name = 'Test IRA';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'ira delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'ira command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- roth_ira
insert into t_del_cmd select c.id from command c join roth_ira ri on ri.name = 'Test Roth IRA' where c.model_name = 'roth_ira'::model_name and c.model_id = ri.id;
delete from roth_ira where name = 'Test Roth IRA';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'roth_ira delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'roth_ira command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- hsa
insert into t_del_cmd select c.id from command c join hsa h on h.name = 'Test HSA' where c.model_name = 'hsa'::model_name and c.model_id = h.id;
delete from hsa where name = 'Test HSA';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'hsa delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'hsa command_sequence_command rows cascade-deleted');
truncate t_del_cmd;

-- tax_deferred
insert into t_del_cmd select c.id from command c join tax_deferred td on td.name = 'Test Tax Deferred' where c.model_name = 'tax_deferred'::model_name and c.model_id = td.id;
delete from tax_deferred where name = 'Test Tax Deferred';
select ok(not exists(select 1 from command where id in (select cmd_id from t_del_cmd)), 'tax_deferred delete removes command row');
select ok(not exists(select 1 from command_sequence_command where command_id in (select cmd_id from t_del_cmd)), 'tax_deferred command_sequence_command rows cascade-deleted');

select * from finish();

rollback;
