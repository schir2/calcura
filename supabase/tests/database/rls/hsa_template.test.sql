begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into hsa_template (name, growth_rate, initial_balance)
values ('Seed Template', 0.06, 2000);

-- 1. any authenticated user can select templates
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from hsa_template', 'regular user sees hsa_template');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into hsa_template (name, growth_rate, initial_balance) values ('Bad Insert', 0.05, 1000)$$,
    '42501',
    NULL,
    'non-admin cannot insert hsa_template'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into hsa_template (name, growth_rate, initial_balance) values ('Admin Template', 0.07, 4000)$$,
    'admin can insert hsa_template'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from hsa_template$$,
    'non-admin delete on hsa_template is silent'
);

-- 5. seed template survives non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from hsa_template', 'hsa_template rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from hsa_template where name = 'Admin Template'$$,
    'admin can delete hsa_template'
);

select * from finish();

rollback;
