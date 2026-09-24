# RILOC Admin Dashboard

This is a separate Next.js app for managing the RILOC website. It is designed for deployment on Vercel with Supabase Authentication, Postgres, and Storage.

## Local setup

1. Create a Supabase project.
2. In its SQL Editor, run `supabase/schema.sql`.
3. Create the first user in Supabase Authentication. Turn off public sign-ups.
4. Copy `.env.example` to `.env.local`. Fill in the Supabase project URL, publishable key, secret key, and the first user UUID. Keep the secret key private; never use a `NEXT_PUBLIC_` name for it.
5. Install dependencies with `npm install`.
6. Seed the pages and administrator role with `npm run seed`.
7. Run `npm run dev`, then open `http://localhost:3001`. The public site can use `http://localhost:3000` in a separate terminal.

The `seed` script imports the four existing pages from `../riloc-nextjs/lib` into `data/initial-content.json` and pushes them to Supabase. To refresh that import, run `node scripts/import-website.mjs ../riloc-nextjs` before seeding.

## Online deployment

Deploy this folder as its own Vercel project. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` to the dashboard deployment. Add the same Supabase URL and publishable key to the public website deployment. The website reads only published page rows; Supabase RLS prevents anonymous access to drafts and administrative changes. Apply the SQL schema and run the seed script once from a trusted local environment. Do not put the secret key into Vercel browser-visible environment variables.

The public site must be deployed from `../riloc-nextjs` and redeployed after the Supabase environment variables are added. Without Supabase configuration, the site continues rendering its bundled content.

## Scripts

- `npm run dev` — start local development
- `npm run typecheck` — check TypeScript
- `npm run build` — production build
- `npm run seed` — grant the selected admin account and import page content



