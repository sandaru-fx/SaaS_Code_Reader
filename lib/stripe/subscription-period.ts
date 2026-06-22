import type Stripe from "stripe";

type SubscriptionPeriod = {
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
};

function getMonthlyFallbackPeriod(): SubscriptionPeriod {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return {
    currentPeriodStart: start,
    currentPeriodEnd: end,
  };
}

export function getSubscriptionPeriod(
  subscription: Stripe.Subscription
): SubscriptionPeriod {
  const firstItem = subscription.items?.data?.[0];
  const startSeconds = firstItem?.current_period_start;
  const endSeconds = firstItem?.current_period_end;

  if (typeof startSeconds === "number" && typeof endSeconds === "number") {
    return {
      currentPeriodStart: new Date(startSeconds * 1000),
      currentPeriodEnd: new Date(endSeconds * 1000),
    };
  }

  return getMonthlyFallbackPeriod();
}
