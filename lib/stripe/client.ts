import Stripe from "stripe";

import { isStripeCheckoutConfigured } from "@/lib/stripe/is-configured";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!isStripeCheckoutConfigured()) {
    throw new Error("Stripe is not configured on the server.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }

  return stripeClient;
}
