begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

insert into roth_ira (name, growth_rate, initial_balance, creator_id)
values ('Test Roth IRA', 0.07, 5000, '00000000-0000-0000-0000-000000000001');

-- 1. owner sees own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from roth_ira', 'user_a sees own roth_ira');

-- 2. other user cannot see owner's row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from roth_ira', 'user_b cannot see user_a roth_ira');

-- 3. owner can insert own row
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$insert into roth_ira (name, growth_rate, initial_balance, creator_id) values ('Roth IRA 2', 0.06, 3000, '00000000-0000-0000-0000-000000000001')$$,
    'user_a can insert own roth_ira'
);

-- 4. other user cannot insert claiming owner's creator_id
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into roth_ira (name, growth_rate, initial_balance, creator_id) values ('Stolen', 0.07, 5000, '00000000-0000-0000-0000-000000000001')$$,
    '42501',
    NULL,
    'user_b cannot insert roth_ira with user_a creator_id'
);

-- 5. other user delete attempt is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$delete from roth_ira$$,
    'user_b delete on roth_ira is silent'
);

-- 6. owner's row survives
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from roth_ira', 'user_a roth_ira row survives user_b delete attempt');

select * from finish();

rollback;
