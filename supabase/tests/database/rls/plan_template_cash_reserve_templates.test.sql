begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into plan_template (name) values ('Test Plan Template');
insert into cash_reserve_template (name, initial_amount, cash_reserve_strategy) values
    ('CRT 1', 5000, 'fixed'),
    ('CRT 2', 8000, 'variable');

insert into plan_template_cash_reserve_templates (plan_template_id, cash_reserve_template_id)
select pt.id, crt.id from plan_template pt, cash_reserve_template crt
where pt.name = 'Test Plan Template' and crt.name = 'CRT 1';

create temp table ptcrt_test_vars as
select pt.id as pt_id, crt2.id as crt2_id
from plan_template pt, cash_reserve_template crt2
where pt.name = 'Test Plan Template' and crt2.name = 'CRT 2';

-- 1. any authenticated user can select
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_cash_reserve_templates', 'regular user sees plan_template_cash_reserve_templates');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into plan_template_cash_reserve_templates (plan_template_id, cash_reserve_template_id) select pt_id, crt2_id from ptcrt_test_vars$$,
    '42501',
    NULL,
    'non-admin cannot insert into plan_template_cash_reserve_templates'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into plan_template_cash_reserve_templates (plan_template_id, cash_reserve_template_id) select pt_id, crt2_id from ptcrt_test_vars$$,
    'admin can insert into plan_template_cash_reserve_templates'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from plan_template_cash_reserve_templates$$,
    'non-admin delete on plan_template_cash_reserve_templates is silent'
);

-- 5. rows survive non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_cash_reserve_templates', 'plan_template_cash_reserve_templates rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_template_cash_reserve_templates where cash_reserve_template_id = (select crt2_id from ptcrt_test_vars)$$,
    'admin can delete from plan_template_cash_reserve_templates'
);

select * from finish();

rollback;
