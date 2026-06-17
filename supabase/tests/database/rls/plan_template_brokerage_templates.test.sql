begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into plan_template (name) values ('Test Plan Template');
insert into brokerage_template (name, growth_rate, initial_balance) values
    ('BT 1', 0.07, 10000),
    ('BT 2', 0.08, 20000);

insert into plan_template_brokerage_templates (plan_template_id, brokerage_template_id)
select pt.id, bt.id from plan_template pt, brokerage_template bt
where pt.name = 'Test Plan Template' and bt.name = 'BT 1';

create temp table ptbt_test_vars as
select pt.id as pt_id, bt2.id as bt2_id
from plan_template pt, brokerage_template bt2
where pt.name = 'Test Plan Template' and bt2.name = 'BT 2';

-- 1. any authenticated user can select
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_brokerage_templates', 'regular user sees plan_template_brokerage_templates');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into plan_template_brokerage_templates (plan_template_id, brokerage_template_id) select pt_id, bt2_id from ptbt_test_vars$$,
    '42501',
    NULL,
    'non-admin cannot insert into plan_template_brokerage_templates'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into plan_template_brokerage_templates (plan_template_id, brokerage_template_id) select pt_id, bt2_id from ptbt_test_vars$$,
    'admin can insert into plan_template_brokerage_templates'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from plan_template_brokerage_templates$$,
    'non-admin delete on plan_template_brokerage_templates is silent'
);

-- 5. rows survive non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_brokerage_templates', 'plan_template_brokerage_templates rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_template_brokerage_templates where brokerage_template_id = (select bt2_id from ptbt_test_vars)$$,
    'admin can delete from plan_template_brokerage_templates'
);

select * from finish();

rollback;
