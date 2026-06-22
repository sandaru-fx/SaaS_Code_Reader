# Production deployment guide

Use this checklist to deploy CodeRider with auth, billing, and usage limits on Vercel.

## 1. Prerequisites

- GitHub repo connected to Vercel
- [Google AI Studio](https://aistudio.google.com) API key
- [Clerk](https://dashboard.clerk.com) application
- [Supabase](https://supabase.com) project
- [Stripe](https://dashboard.stripe.com) account (test mode first)

## 2. Supabase migrations

Run both migrations on your production database:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Or paste SQL from:

- `supabase/migrations/20260621170000_create_analyses.sql`
- `supabase/migrations/20260622120000_create_billing_tables.sql`

Tables created:

- `analyses` — saved AI results
- `user_subscriptions` — free/pro plan per Clerk user
- `usage_events` — monthly AI usage tracking

## 3. Vercel environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Required | Notes |
|----------|----------|-------|
| `GEMINI_API_KEY` | Yes | AI features |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Auth |
| `CLERK_SECRET_KEY` | Yes | Auth |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | `/workspace` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | `/workspace` |
| `NEXT_PUBLIC_SITE_URL` | Yes | e.g. `https://coderider.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Usage limits + history |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side only |
| `STRIPE_SECRET_KEY` | For billing | `sk_test_...` or live |
| `STRIPE_PRICE_ID` | For billing | Pro plan price ID |
| `STRIPE_WEBHOOK_SECRET` | For billing | From Stripe webhook endpoint |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Optional | Future client-side Stripe |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is not required by the app today.

## 4. Clerk production settings

In Clerk Dashboard:

1. Add your production domain (e.g. `coderider.vercel.app`)
2. Set redirect URLs to match env vars above
3. Copy production API keys into Vercel

## 5. Stripe setup

1. Create a **Product** → **Pro** with recurring monthly price
2. Copy **Price ID** → `STRIPE_PRICE_ID`
3. Create webhook endpoint:

   **URL:** `https://<your-domain>/api/stripe/webhook`

   **Events:**
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

## 6. Deploy

### Option A — Git push (recommended)

```bash
npm run lint
npm run build
git push origin main
```

Vercel auto-deploys when GitHub is linked.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
vercel deploy --prod
```

## 7. Post-deploy smoke test

| Check | URL / action |
|-------|----------------|
| Health | `GET /api/health` — all required services `true` |
| Landing | `/` loads |
| Pricing | `/pricing` loads |
| Auth | Sign up → redirect to `/workspace` |
| Analyze | Paste snippet → Analyze works |
| Usage | Top bar shows remaining analyses |
| Upgrade | `/pricing` → Upgrade (Stripe test card `4242...`) |
| Webhook | Stripe dashboard shows `200` for test event |

## 8. Free tier limits (when Clerk + Supabase enabled)

| Feature | Free / month |
|---------|----------------|
| Code analyses | 10 |
| Chat messages | 30 |
| Project guides | 3 |

Pro subscribers get unlimited usage after webhook sync.

## 9. Troubleshooting

| Issue | Fix |
|-------|-----|
| `401` on analyze/chat | Clerk keys missing or user not signed in |
| Usage limits not working | Run billing migration; check Supabase service role key |
| Stripe checkout `503` | Set `STRIPE_SECRET_KEY` + `STRIPE_PRICE_ID` |
| Webhook fails | Verify `STRIPE_WEBHOOK_SECRET` and endpoint URL |
| Build fails | Run `npm run build` locally first |

## 10. Go live checklist

- [ ] Production env vars set in Vercel
- [ ] Supabase migrations applied
- [ ] Clerk domain + keys configured
- [ ] Stripe webhook receiving events
- [ ] `/api/health` returns expected flags
- [ ] Test upgrade flow with Stripe test mode
- [ ] Switch Stripe to live keys when ready to charge
