# Authentication — Supabase Auth

Calcura uses [Supabase Auth](https://supabase.com/docs/guides/auth) for all authentication. The old Django session/CSRF flow has been removed entirely.

## Flow overview

```
User fills login form
  → authStore.login(email, password)
  → useAuth.signInWithPassword(email, password)
  → supabase.auth.signInWithPassword(...)
  → Supabase returns Session (JWT) + User
  → authStore.onAuthStateChange fires → stores session + user
  → middleware/auth.ts: useSupabaseUser() is now populated → route allowed
```

## Key files

| File | Role |
|------|------|
| `composables/useAuth.ts` | Thin wrapper around `supabase.auth.*` |
| `stores/authStore.ts` | Holds reactive `Session` and `User` state |
| `middleware/auth.ts` | Redirects unauthenticated users to `/auth/login` |
| `pages/auth/login.vue` | Login form (email/password + Google OAuth button) |
| `pages/auth/register.vue` | Registration form |
| `pages/auth/verify.vue` | Waits for Supabase email verification redirect |
| `supabase/migrations/20260615000003_auth_trigger.sql` | Postgres trigger: auto-creates `profiles` on signup |

## Profile auto-creation

When a user signs up, the `on_user_created` Postgres trigger fires on `auth.users` INSERT and inserts a row into `public.profiles` with default values (`is_admin = false`). This trigger runs as `SECURITY DEFINER` (bypasses RLS), because the `profiles` INSERT policy is intentionally blocked for the `authenticated` role — only the trigger can insert profiles.

## Google OAuth

Google OAuth requires a one-time manual step in the Supabase Dashboard:
1. Go to **Authentication → Providers → Google**
2. Enable the Google provider
3. Add your Google OAuth client ID and secret from [Google Cloud Console](https://console.cloud.google.com)
4. Add the Supabase redirect URL to your Google OAuth app's authorized redirect URIs

The frontend code in `composables/useAuth.ts` (`signInWithGoogle`) is already implemented.

## Supabase Auth settings

Configure in the Supabase dashboard under **Authentication → Settings**:
- **Email confirmations:** enabled (users must verify before logging in)
- **Site URL:** your production URL (e.g., `https://calcura.org`)
- **Additional redirect URLs:** `http://localhost:3000` for local dev

## Session management

`authStore.initialize()` should be called once on app startup. It:
1. Calls `supabase.auth.getSession()` to restore an existing session from localStorage
2. Sets up `supabase.auth.onAuthStateChange()` to keep the store in sync with Supabase

Call this in `app.vue` `onMounted` or a Nuxt plugin.

## No CSRF tokens

There are no CSRF tokens. The old `plugins/api.ts` plugin has been deleted. Supabase uses JWT-based auth via the `Authorization` header, which the `@nuxtjs/supabase` module handles automatically.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon/public key |
| `NUXT_SUPABASE_SECRET_KEY` | Service role key (server-side only, not exposed to browser) |

See `.env.example` for the full list.

## Auth middleware

`middleware/auth.ts` uses `useSupabaseUser()` (provided by `@nuxtjs/supabase`) to check for an authenticated user. The module's built-in redirect middleware is disabled (`supabase.redirect: false` in `nuxt.config.ts`) — this custom middleware is the only auth gate. See [ADR 007](adr/007-supabase-redirect-false.md).
