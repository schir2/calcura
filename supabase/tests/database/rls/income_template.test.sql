begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into income_template (name, gross_income, growth_rate)
values ('Seed Template', 50000, 0.02);

-- 1. any authenticated user can select templates
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from income_template', 'regular user sees income_template');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into income_template (name, gross_income, growth_rate) values ('Bad Insert', 40000, 0.01)$$,
    '42501',
    NULL,
    'non-admin cannot insert income_template'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into income_template (name, gross_income, growth_rate) values ('Admin Template', 60000, 0.03)$$,
    'admin can insert income_template'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from income_template$$,
    'non-admin delete on income_template is silent'
);

-- 5. seed template survives non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from income_template', 'income_template rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from income_template where name = 'Admin Template'$$,
    'admin can delete income_template'
);

select * from finish();

rollback;
