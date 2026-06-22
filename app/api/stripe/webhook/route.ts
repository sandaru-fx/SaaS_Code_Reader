import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { getStripeClient } from "@/lib/stripe/client";
import { isStripeConfigured } from "@/lib/stripe/is-configured";
import { getSubscriptionPeriod } from "@/lib/stripe/subscription-period";
import { downgradeToFree, upsertProSubscription } from "@/lib/usage/usage";

export const runtime = "nodejs";

function getClerkUserIdFromSession(session: Stripe.Checkout.Session): string | null {
  return (
    session.metadata?.clerkUserId ??
    session.client_reference_id ??
    null
  );
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: "Stripe webhooks are not configured." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripeClient();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = getClerkUserIdFromSession(session);

        if (!userId || !session.subscription || !session.customer) {
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(
          String(session.subscription)
        );
        const period = getSubscriptionPeriod(subscription);

        await upsertProSubscription({
          userId,
          stripeCustomerId: String(session.customer),
          stripeSubscriptionId: subscription.id,
          currentPeriodStart: period.currentPeriodStart,
          currentPeriodEnd: period.currentPeriodEnd,
        });
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;

        if (!userId) {
          break;
        }

        if (subscription.status === "active" || subscription.status === "trialing") {
          const period = getSubscriptionPeriod(subscription);

          await upsertProSubscription({
            userId,
            stripeCustomerId: String(subscription.customer),
            stripeSubscriptionId: subscription.id,
            currentPeriodStart: period.currentPeriodStart,
            currentPeriodEnd: period.currentPeriodEnd,
          });
        } else {
          await downgradeToFree(userId);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.clerkUserId;

        if (userId) {
          await downgradeToFree(userId);
        }
        break;
      }
      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: "Webhook handler failed." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
