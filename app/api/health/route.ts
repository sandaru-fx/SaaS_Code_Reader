import { NextResponse } from "next/server";

import { isGeminiConfigured } from "@/lib/ai/validate-request";
import { isClerkConfigured } from "@/lib/clerk/is-configured";
import { isStripeCheckoutConfigured, isStripeConfigured } from "@/lib/stripe/is-configured";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { isUsageLimitsEnabled } from "@/lib/usage/is-enabled";
import { SITE_URL } from "@/lib/site";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "coderider",
    siteUrl: SITE_URL,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    services: {
      gemini: isGeminiConfigured(),
      clerk: isClerkConfigured(),
      supabase: isSupabaseConfigured(),
      usageLimits: isUsageLimitsEnabled(),
      stripeCheckout: isStripeCheckoutConfigured(),
      stripeWebhooks: isStripeConfigured(),
    },
  });
}
