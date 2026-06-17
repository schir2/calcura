begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into expense_template (name, amount, growth_rate, expense_type, frequency)
values ('Seed Template', 1000, 0.02, 'fixed', 'monthly');

-- 1. any authenticated user can select templates
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from expense_template', 'regular user sees expense_template');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into expense_template (name, amount, growth_rate, expense_type, frequency) values ('Bad Insert', 500, 0.01, 'variable', 'annual')$$,
    '42501',
    NULL,
    'non-admin cannot insert expense_template'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into expense_template (name, amount, growth_rate, expense_type, frequency) values ('Admin Template', 2000, 0.03, 'fixed', 'monthly')$$,
    'admin can insert expense_template'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from expense_template$$,
    'non-admin delete on expense_template is silent'
);

-- 5. seed template survives non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from expense_template', 'expense_template rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from expense_template where name = 'Admin Template'$$,
    'admin can delete expense_template'
);

select * from finish();

rollback;
