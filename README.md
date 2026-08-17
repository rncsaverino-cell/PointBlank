# PointBlank — Wholesale Portal

A retailer-only B2B ecommerce portal for PointBlank, a modern target-design brand.
Built with Next.js (App Router), TypeScript, Tailwind CSS, hand-rolled shadcn/ui-style
components, Supabase (auth + Postgres), and an optional Stripe integration.

Public visitors see marketing pages only. Approved retailers get wholesale pricing,
a bulk-order cart, order history, and a reorder tool. Admins get a portal to approve
retailers, manage the product/collection catalog, and track orders.

## Demo mode (works immediately, no setup)

If `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` aren't set, the app runs
in **demo mode**:

- The public site, retailer dashboard, and admin portal all render with realistic seed
  data (6 collections, 20 products, 5 retailers, 5 sample orders) from
  [`lib/mock-data.ts`](lib/mock-data.ts).
- Logging in with any credentials signs you in as a sample approved retailer. From the
  login page you can also jump straight into the **admin portal** preview.
- Admin actions (approve a retailer, edit a product, update an order's status, etc.)
  mutate an in-memory store (see [`lib/demo-store.ts`](lib/demo-store.ts)) so the UI
  feels real — changes reset when the dev server restarts.
- Route protection (middleware) is bypassed in demo mode so every page is reachable.

This means you can install dependencies and run the app right away to see the full
design and flows before setting up a real backend.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure Supabase (for real accounts + persistence)

1. Create a project at [supabase.com](https://supabase.com).
2. In **Settings → API**, copy the Project URL and `anon public` key.
3. Copy `.env.example` to `.env.local` and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Settings → API → service_role
   ```
4. In the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql) — this
   creates all tables (`profiles`, `retailer_applications`, `collections`, `products`,
   `orders`, `order_items`, `retailer_pricing`), enables Row Level Security, and sets
   up a trigger that auto-creates a `profiles` row whenever someone signs up.
5. Then run [`supabase/seed.sql`](supabase/seed.sql) to load the 6 collections and 20
   products. (Collections/products don't depend on auth, so this works immediately.)
6. **Seeding retailers & orders**: because Supabase manages `auth.users` specially,
   sample retailer accounts aren't created by SQL. Instead:
   - Go to `/apply` and submit the application form (use a real email you can access,
     or any email if you disable email confirmation in Supabase Auth settings).
   - Approve it from `/admin/retailers` once you're an admin (see step 6 below).
   - Repeat for a few accounts, then run the commented-out `orders` block at the
     bottom of `supabase/seed.sql`, editing the email addresses to match.
7. In **Authentication → URL Configuration**, add your site URL and
   `http://localhost:3000/auth/callback` as a redirect URL (and your production
   callback URL once deployed).

## 3. Configure Stripe (optional)

Stripe is **not required** for the core flow — retailers submit orders for PointBlank
to process, no card payment needed. It's wired up as an optional "pay this order by
card" action:

1. Get your keys from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
3. `STRIPE_WEBHOOK_SECRET` comes from Dashboard → Developers → Webhooks → add an
   endpoint at `https://yourdomain.com/api/stripe/webhook` listening for
   `checkout.session.completed`.
4. See [`app/api/stripe/create-payment-session/route.ts`](app/api/stripe/create-payment-session/route.ts)
   and [`app/api/stripe/webhook/route.ts`](app/api/stripe/webhook/route.ts).

## 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 5. Deploy

The app deploys cleanly to [Vercel](https://vercel.com) (or any Next.js host):

1. Push this repo to GitHub and import it in Vercel.
2. Add the same environment variables from `.env.local` in the Vercel project settings.
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. Update the Supabase Auth redirect URL to `https://yourdomain.com/auth/callback`.
5. If using Stripe, update the webhook endpoint to your production URL.

## 6. Make an account an administrator

Admin status is stored in `profiles.role`. After a user has signed up (e.g. via
`/apply`), promote them from the Supabase SQL editor:

```sql
update profiles set role = 'admin' where email = 'you@yourbusiness.com';
```

They'll get access to `/admin` on their next login. In **demo mode**, there's no real
account to promote — instead use the "Preview the admin portal" link on the login page,
or the "Switch to Admin view" banner shown in the retailer dashboard.

## Project structure

```
app/
  (public)/        Marketing site: home, /targets, /wholesale, /apply, /login, legal
  (retailer)/       Approved-retailer app: dashboard, shop, collections, cart, orders,
                     reorder, downloads, account — protected by middleware.ts
  (admin)/          Admin portal: analytics, retailers, products, collections, orders
  api/               Route handlers: apply, orders, admin/*, auth, stripe/*
components/
  ui/                Reusable primitives (button, input, dialog, table, ...)
  layout/            Headers, footer, admin sidebar
  marketing/          Homepage sections
  product/            Product cards, filters, gallery, order panel
  cart/ orders/ admin/ dashboard/ forms/
lib/
  supabase/          Browser/server Supabase clients + middleware helper
  data.ts            Data-access layer (real Supabase query or demo-store fallback)
  auth.ts            Current-user/profile helper (real session or demo profile)
  mock-data.ts        Seed content used by demo mode
  demo-store.ts        In-memory mutable copy of mock data for demo-mode admin actions
  types.ts, validations.ts, constants.ts, cart-context.tsx, utils.ts
supabase/
  schema.sql          Tables, RLS policies, triggers
  seed.sql             Collections + products seed data
```

## Notes on the wholesale rules

Minimum opening order ($250) and free-shipping threshold ($1,000) are defined in
[`lib/constants.ts`](lib/constants.ts) — change them there to update it everywhere
(cart, wholesale page copy).
