# Stripe Checkout Setup — Slim SHOT Subscriptions

## When you're ready to go live:

### 1. Create a Stripe account
Go to https://dashboard.stripe.com/register

### 2. Create a Product + Price in Stripe Dashboard
- Products → Add product
- Name: "Slim SHOT Monthly Subscription"
- Price: $149.00 / month (recurring)
- Copy the **Price ID** (starts with `price_`)

### 3. Set up a webhook endpoint
- Developers → Webhooks → Add endpoint
- URL: `https://elaborate-meerkat-88b39d.netlify.app/api/webhooks/stripe`
  (replace with your custom domain when ready)
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Copy the **Webhook signing secret** (starts with `whsec_`)

### 4. Enable Stripe Tax (optional but recommended)
- Settings → Tax → Enable Stripe Tax
- This auto-calculates sales tax based on shipping address

### 5. Add environment variables to Netlify
Go to: Project configuration → Environment variables

```
STRIPE_SECRET_KEY=sk_live_...       # or sk_test_... for testing
STRIPE_PRICE_ID=price_...           # from step 2
STRIPE_WEBHOOK_SECRET=whsec_...     # from step 3
NEXT_PUBLIC_STRIPE_ENABLED=true     # flip this to show Buy button
```

### 6. Trigger a redeploy
The site will pick up the new env vars on the next deploy.

### 7. Test with Stripe test mode first
Use `sk_test_` keys and test card `4242 4242 4242 4242` to verify
the full flow before switching to live keys.

---

## How the switch works

The Slim SHOT page uses `NEXT_PUBLIC_STRIPE_ENABLED` to decide what to show:

- **Not set or `false`**: Shows the waitlist email form (current behavior)
- **`true`**: Shows the "Subscribe — $149/mo" checkout button

No code changes needed. Just set the env var and redeploy.

---

## File map

| File | Purpose |
|------|---------|
| `app/api/checkout/route.ts` | Creates Stripe Checkout session |
| `app/api/webhooks/stripe/route.ts` | Handles Stripe webhook events |
| `app/checkout/success/page.tsx` | Post-purchase confirmation page |
| `app/checkout/cancel/page.tsx` | Checkout cancelled page |
| `app/components/BuyButton.tsx` | Checkout button component |

## Customer portal (self-service)

When ready, you can enable the Stripe Customer Portal:
- Stripe Dashboard → Settings → Customer portal
- Enable: cancel subscription, update payment method, view invoices
- Add a "Manage Subscription" link to your site that redirects to the portal
