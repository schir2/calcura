begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into plan_template (name) values ('Test Plan Template');
insert into debt_template (name, principal, interest_rate, payment_strategy, frequency) values
    ('DT 1', 10000, 0.05, 'fixed', 'monthly'),
    ('DT 2', 20000, 0.04, 'minimum_payment', 'monthly');

insert into plan_template_debt_templates (plan_template_id, debt_template_id)
select pt.id, dt.id from plan_template pt, debt_template dt
where pt.name = 'Test Plan Template' and dt.name = 'DT 1';

create temp table ptdt_test_vars as
select pt.id as pt_id, dt2.id as dt2_id
from plan_template pt, debt_template dt2
where pt.name = 'Test Plan Template' and dt2.name = 'DT 2';

-- 1. any authenticated user can select
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_debt_templates', 'regular user sees plan_template_debt_templates');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into plan_template_debt_templates (plan_template_id, debt_template_id) select pt_id, dt2_id from ptdt_test_vars$$,
    '42501',
    NULL,
    'non-admin cannot insert into plan_template_debt_templates'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into plan_template_debt_templates (plan_template_id, debt_template_id) select pt_id, dt2_id from ptdt_test_vars$$,
    'admin can insert into plan_template_debt_templates'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from plan_template_debt_templates$$,
    'non-admin delete on plan_template_debt_templates is silent'
);

-- 5. rows survive non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_debt_templates', 'plan_template_debt_templates rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_template_debt_templates where debt_template_id = (select dt2_id from ptdt_test_vars)$$,
    'admin can delete from plan_template_debt_templates'
);

select * from finish();

rollback;
