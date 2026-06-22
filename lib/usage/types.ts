import type { UsageEventType } from "@/lib/usage/constants";

export type UserPlan = "free" | "pro";

export type UsageStatus = {
  plan: UserPlan;
  enabled: boolean;
  stripeConfigured: boolean;
  limits: Record<UsageEventType, number>;
  used: Record<UsageEventType, number>;
  remaining: Record<UsageEventType, number>;
  periodStart: string;
  periodEnd: string;
};

export type UsageLimitResult =
  | { allowed: true; remaining: number }
  | {
      allowed: false;
      remaining: 0;
      message: string;
      eventType: UsageEventType;
    };
