import {
  FREE_TIER_LIMITS,
  USAGE_EVENT_LABELS,
  type UsageEventType,
} from "@/lib/usage/constants";
import { isUsageLimitsEnabled } from "@/lib/usage/is-enabled";
import type { UsageLimitResult, UsageStatus, UserPlan } from "@/lib/usage/types";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type UsagePeriod = {
  start: Date;
  end: Date;
};

function getCurrentUsagePeriod(): UsagePeriod {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));

  return { start, end };
}

async function getUserPlan(userId: string): Promise<UserPlan> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("user_subscriptions")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.plan === "pro" ? "pro" : "free";
}

async function countUsage(
  userId: string,
  eventType: UsageEventType,
  period: UsagePeriod
): Promise<number> {
  const supabase = getSupabaseAdmin();
  const { count, error } = await supabase
    .from("usage_events")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", eventType)
    .gte("created_at", period.start.toISOString())
    .lt("created_at", period.end.toISOString());

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function checkUsageLimit(
  userId: string,
  eventType: UsageEventType
): Promise<UsageLimitResult> {
  if (!isUsageLimitsEnabled()) {
    return { allowed: true, remaining: Number.POSITIVE_INFINITY };
  }

  const plan = await getUserPlan(userId);

  if (plan === "pro") {
    return { allowed: true, remaining: Number.POSITIVE_INFINITY };
  }

  const period = getCurrentUsagePeriod();
  const used = await countUsage(userId, eventType, period);
  const limit = FREE_TIER_LIMITS[eventType];
  const remaining = Math.max(limit - used, 0);

  if (used >= limit) {
    return {
      allowed: false,
      remaining: 0,
      eventType,
      message: `Free plan limit reached for ${USAGE_EVENT_LABELS[eventType]} this month (${limit}). Upgrade to Pro for unlimited access.`,
    };
  }

  return { allowed: true, remaining };
}

export async function recordUsage(
  userId: string,
  eventType: UsageEventType
): Promise<void> {
  if (!isUsageLimitsEnabled()) {
    return;
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("usage_events").insert({
    user_id: userId,
    event_type: eventType,
  });

  if (error) {
    throw error;
  }
}

export async function getUsageStatus(userId: string): Promise<UsageStatus> {
  const period = getCurrentUsagePeriod();
  const limits = { ...FREE_TIER_LIMITS };
  const used: UsageStatus["used"] = {
    analyze: 0,
    chat: 0,
    analyze_project: 0,
  };

  if (!isUsageLimitsEnabled()) {
    return {
      plan: "free",
      enabled: false,
      stripeConfigured: false,
      limits,
      used,
      remaining: { ...limits },
      periodStart: period.start.toISOString(),
      periodEnd: period.end.toISOString(),
    };
  }

  const plan = await getUserPlan(userId);

  for (const eventType of Object.keys(FREE_TIER_LIMITS) as UsageEventType[]) {
    used[eventType] = await countUsage(userId, eventType, period);
  }

  const remaining = Object.fromEntries(
    (Object.keys(FREE_TIER_LIMITS) as UsageEventType[]).map((eventType) => [
      eventType,
      plan === "pro"
        ? Number.POSITIVE_INFINITY
        : Math.max(limits[eventType] - used[eventType], 0),
    ])
  ) as UsageStatus["remaining"];

  return {
    plan,
    enabled: true,
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
    limits,
    used,
    remaining,
    periodStart: period.start.toISOString(),
    periodEnd: period.end.toISOString(),
  };
}

export async function upsertProSubscription(input: {
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("user_subscriptions").upsert({
    user_id: input.userId,
    plan: "pro",
    stripe_customer_id: input.stripeCustomerId,
    stripe_subscription_id: input.stripeSubscriptionId,
    current_period_start: input.currentPeriodStart.toISOString(),
    current_period_end: input.currentPeriodEnd.toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}

export async function downgradeToFree(userId: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("user_subscriptions").upsert({
    user_id: userId,
    plan: "free",
    stripe_subscription_id: null,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}
