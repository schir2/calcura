begin;

select plan(6);

insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
values
    ('00000000-0000-0000-0000-000000000001', 'user_a@test.com', '', now(), now(), now(), 'authenticated', 'authenticated'),
    ('00000000-0000-0000-0000-000000000002', 'user_b@test.com', '', now(), now(), now(), 'authenticated', 'authenticated');

-- Trigger auto-creates profiles; set user_a's name so we can verify it isn't mutated
update profiles set first_name = 'Alice' where user_id = '00000000-0000-0000-0000-000000000001';

-- 1. owner sees own profile
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty('select * from profiles', 'user_a sees own profile');

-- 2. other user cannot see owner's profile
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select is_empty('select * from profiles where user_id = ''00000000-0000-0000-0000-000000000001''', 'user_b cannot see user_a profile');

-- 3. owner can update own profile
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select lives_ok(
    $$update profiles set first_name = 'Alicia' where user_id = '00000000-0000-0000-0000-000000000001'$$,
    'user_a can update own profile'
);

-- 4. authenticated users cannot insert profiles directly (no INSERT policy; trigger-only)
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select throws_ok(
    $$insert into profiles (user_id) values ('00000000-0000-0000-0000-000000000099')$$,
    '42501',
    NULL,
    'authenticated user cannot insert profile directly'
);

-- 5. other user update attempt on owner's profile is silent
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000002');
select lives_ok(
    $$update profiles set first_name = 'Hacked' where user_id = '00000000-0000-0000-0000-000000000001'$$,
    'user_b update on user_a profile is silent'
);

-- 6. owner's profile unchanged after other user's update attempt
set local role authenticated;
select tests.jwt_authenticated('00000000-0000-0000-0000-000000000001');
select isnt_empty(
    $$select * from profiles where first_name = 'Alicia'$$,
    'user_a profile not mutated by user_b'
);

select * from finish();

rollback;