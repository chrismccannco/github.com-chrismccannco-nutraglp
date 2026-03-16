import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // Handle relevant events
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ New subscription:", {
        customer: session.customer,
        email: session.customer_details?.email,
        subscription: session.subscription,
        metadata: session.metadata,
      });

      // Relay to Google Sheets for tracking
      if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
        fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            form: "purchase",
            email: session.customer_details?.email || "",
            phone: session.customer_details?.phone || "",
            sms_opt_in: false,
            source: "stripe-checkout",
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      }

      // TODO: Store customer/subscription in your DB when ready
      // await db.execute({
      //   sql: "INSERT INTO customers (stripe_id, email, subscription_id, status) VALUES (?, ?, ?, ?)",
      //   args: [session.customer, session.customer_details?.email, session.subscription, "active"],
      // });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("📝 Subscription updated:", {
        id: subscription.id,
        status: subscription.status,
        customer: subscription.customer,
      });
      // TODO: Update subscription status in DB
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      console.log("❌ Subscription cancelled:", {
        id: subscription.id,
        customer: subscription.customer,
      });
      // TODO: Mark subscription as cancelled in DB
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log("⚠️ Payment failed:", {
        customer: invoice.customer,
        attempt: invoice.attempt_count,
      });
      // TODO: Send failed payment notification email
      break;
    }

    default:
      // Unhandled event type — log but don't error
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
