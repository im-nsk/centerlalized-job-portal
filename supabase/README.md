# Supabase setup

## 1. Run the SQL migration

In [Supabase Dashboard](https://supabase.com/dashboard) → **SQL Editor** → New query, paste and run:

`supabase/migrations/001_profiles.sql`

This creates the `profiles` table, `updated_at` trigger, and Row Level Security policies.

## 2. Enable Google OAuth

1. **Authentication** → **Providers** → **Google** → Enable
2. Add your Google Cloud OAuth client ID and secret
3. **Authentication** → **URL Configuration**:
   - **Site URL**: `http://localhost:5173` (dev) and your production URL
   - **Redirect URLs**: add `http://localhost:5173` and production origin

## 3. Environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://aitemsjdmkykubwngvpe.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
```

Restart the dev server after changing `.env`.

## 4. First login migration

On first Google sign-in:

1. App checks Supabase `profiles` for your user
2. If empty, reads `localStorage` key `jcc_state_v2`
3. Migrates that data to Supabase and removes the local key
4. If no local data exists, seeds defaults

## 5. Data model

| Column       | Type        | Description                          |
|-------------|-------------|--------------------------------------|
| `id`        | uuid (PK)   | Matches `auth.users.id`              |
| `email`     | text        | User email from Google               |
| `state`     | jsonb       | Full app state (companies, templates, etc.) |
| `updated_at`| timestamptz | Auto-updated on save                 |

RLS ensures each user can only read/write their own row.
