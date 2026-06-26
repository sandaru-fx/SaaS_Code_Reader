import { NextResponse } from "next/server";

import {
  USAGE_EVENT_LABELS,
  type UsageEventType,
} from "@/lib/usage/constants";
import { isUsageLimitsEnabled } from "@/lib/usage/is-enabled";
import { checkUsageLimit } from "@/lib/usage/usage";

type UsageErrorResponse = {
  error: string;
  code: "usage-limit-exceeded";
  eventType: UsageEventType;
  upgradeUrl: string;
};

export async function enforceUsageLimit(
  userId: string,
  eventType: UsageEventType
): Promise<NextResponse<UsageErrorResponse> | null> {
  if (!isUsageLimitsEnabled()) {
    return null;
  }

  try {
    const result = await checkUsageLimit(userId, eventType);

    if (result.allowed) {
      return null;
    }

    return NextResponse.json(
      {
        error: result.message,
        code: "usage-limit-exceeded",
        eventType: result.eventType,
        upgradeUrl: "/pricing",
      },
      {
        status: 429,
        headers: {
          "X-Usage-Event": result.eventType,
          "X-Usage-Limit": USAGE_EVENT_LABELS[result.eventType],
        },
      }
    );
  } catch {
    // Billing tables missing or Supabase unavailable — do not block core features.
    return null;
  }
}
