begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into plan_template (name) values ('Test Plan Template');
insert into ira_template (name, growth_rate, initial_balance) values
    ('IRAT 1', 0.07, 5000),
    ('IRAT 2', 0.07, 6000);

insert into plan_template_ira_templates (plan_template_id, ira_template_id)
select pt.id, it.id from plan_template pt, ira_template it
where pt.name = 'Test Plan Template' and it.name = 'IRAT 1';

create temp table ptirat_test_vars as
select pt.id as pt_id, it2.id as it2_id
from plan_template pt, ira_template it2
where pt.name = 'Test Plan Template' and it2.name = 'IRAT 2';

-- 1. any authenticated user can select
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_ira_templates', 'regular user sees plan_template_ira_templates');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into plan_template_ira_templates (plan_template_id, ira_template_id) select pt_id, it2_id from ptirat_test_vars$$,
    '42501',
    NULL,
    'non-admin cannot insert into plan_template_ira_templates'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into plan_template_ira_templates (plan_template_id, ira_template_id) select pt_id, it2_id from ptirat_test_vars$$,
    'admin can insert into plan_template_ira_templates'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from plan_template_ira_templates$$,
    'non-admin delete on plan_template_ira_templates is silent'
);

-- 5. rows survive non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_ira_templates', 'plan_template_ira_templates rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_template_ira_templates where ira_template_id = (select it2_id from ptirat_test_vars)$$,
    'admin can delete from plan_template_ira_templates'
);

select * from finish();

rollback;
