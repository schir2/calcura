begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into plan_template (name) values ('Test Plan Template');
insert into hsa_template (name, growth_rate, initial_balance) values
    ('HSAT 1', 0.06, 2000),
    ('HSAT 2', 0.06, 3000);

insert into plan_template_hsa_templates (plan_template_id, hsa_template_id)
select pt.id, ht.id from plan_template pt, hsa_template ht
where pt.name = 'Test Plan Template' and ht.name = 'HSAT 1';

create temp table pthsat_test_vars as
select pt.id as pt_id, ht2.id as ht2_id
from plan_template pt, hsa_template ht2
where pt.name = 'Test Plan Template' and ht2.name = 'HSAT 2';

-- 1. any authenticated user can select
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_hsa_templates', 'regular user sees plan_template_hsa_templates');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into plan_template_hsa_templates (plan_template_id, hsa_template_id) select pt_id, ht2_id from pthsat_test_vars$$,
    '42501',
    NULL,
    'non-admin cannot insert into plan_template_hsa_templates'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into plan_template_hsa_templates (plan_template_id, hsa_template_id) select pt_id, ht2_id from pthsat_test_vars$$,
    'admin can insert into plan_template_hsa_templates'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from plan_template_hsa_templates$$,
    'non-admin delete on plan_template_hsa_templates is silent'
);

-- 5. rows survive non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from plan_template_hsa_templates', 'plan_template_hsa_templates rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from plan_template_hsa_templates where hsa_template_id = (select ht2_id from pthsat_test_vars)$$,
    'admin can delete from plan_template_hsa_templates'
);

select * from finish();

rollback;
