begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'regular@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'admin@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

update profiles set is_admin = true where user_id = '00000000-0000-0000-0000-000000000002';

insert into debt_template (name, principal, interest_rate, payment_strategy, frequency)
values ('Seed Template', 10000, 0.05, 'fixed', 'monthly');

-- 1. any authenticated user can select templates
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from debt_template', 'regular user sees debt_template');

-- 2. non-admin cannot insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select throws_ok(
    $$insert into debt_template (name, principal, interest_rate, payment_strategy, frequency) values ('Bad Insert', 5000, 0.04, 'minimum_payment', 'monthly')$$,
    '42501',
    NULL,
    'non-admin cannot insert debt_template'
);

-- 3. admin can insert
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$insert into debt_template (name, principal, interest_rate, payment_strategy, frequency) values ('Admin Template', 20000, 0.06, 'fixed', 'monthly')$$,
    'admin can insert debt_template'
);

-- 4. non-admin delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$delete from debt_template$$,
    'non-admin delete on debt_template is silent'
);

-- 5. seed template survives non-admin delete attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from debt_template', 'debt_template rows survive non-admin delete');

-- 6. admin can delete
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from debt_template where name = 'Admin Template'$$,
    'admin can delete debt_template'
);

select * from finish();

rollback;
