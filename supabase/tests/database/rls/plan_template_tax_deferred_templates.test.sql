begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into plan_template (name) values ('Test Plan Template');
insert into tax_deferred_template (name, growth_rate, initial_balance, elective_contribution_strategy) values
    ('TDT 1', 0.07, 10000, 'fixed'),
    ('TDT 2', 0.07, 15000, 'max');

insert into plan_template_tax_deferred_templates (plan_template_id, tax_deferred_template_id)
select pt.id, tdt.id from plan_template pt, tax_deferred_template tdt
where pt.name = 'Test Plan Template' and tdt.name = 'TDT 1';

create temp table pttdt_test_vars as
select pt.id as pt_id, tdt2.id as tdt2_id
from plan_template pt, tax_deferred_template tdt2
where pt.name = 'Test Plan Template' and tdt2.name = 'TDT 2';

-- 1. any authenticated user can select
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_tax_deferred_templates', 'regular user sees plan_template_tax_deferred_templates');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into plan_template_tax_deferred_templates (plan_template_id, tax_deferred_template_id) select pt_id, tdt2_id from pttdt_test_vars$$,
    '42501',
    NULL,
    'non-admin cannot insert into plan_template_tax_deferred_templates'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into plan_template_tax_deferred_templates (plan_template_id, tax_deferred_template_id) select pt_id, tdt2_id from pttdt_test_vars$$,
    'admin can insert into plan_template_tax_deferred_templates'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from plan_template_tax_deferred_templates$$,
    'non-admin delete on plan_template_tax_deferred_templates is silent'
);

-- 5. rows survive non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_tax_deferred_templates', 'plan_template_tax_deferred_templates rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_template_tax_deferred_templates where tax_deferred_template_id = (select tdt2_id from pttdt_test_vars)$$,
    'admin can delete from plan_template_tax_deferred_templates'
);

select * from finish();

rollback;
