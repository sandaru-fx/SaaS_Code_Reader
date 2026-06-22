import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { SITE_URL } from "@/lib/site";
import { getStripeClient } from "@/lib/stripe/client";
import { isStripeCheckoutConfigured } from "@/lib/stripe/is-configured";

export async function POST() {
  if (!isClerkConfigured()) {
    return NextResponse.json(
      { error: "Authentication is not configured." },
      { status: 503 }
    );
  }

  if (!isStripeCheckoutConfigured()) {
    return NextResponse.json(
      { error: "Stripe billing is not configured yet." },
      { status: 503 }
    );
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Please sign in to upgrade." }, { status: 401 });
  }

  const user = await currentUser();
  const email = user?.emailAddresses.find(
    (entry) => entry.id === user.primaryEmailAddressId
  )?.emailAddress;

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/workspace?upgrade=success`,
      cancel_url: `${SITE_URL}/pricing?cancelled=1`,
      client_reference_id: userId,
      metadata: {
        clerkUserId: userId,
      },
      subscription_data: {
        metadata: {
          clerkUserId: userId,
        },
      },
      ...(email ? { customer_email: email } : {}),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
