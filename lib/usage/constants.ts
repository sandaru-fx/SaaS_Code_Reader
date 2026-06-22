export const FREE_TIER_LIMITS = {
  analyze: 10,
  chat: 30,
  analyze_project: 3,
} as const;

export type UsageEventType = keyof typeof FREE_TIER_LIMITS;

export const USAGE_EVENT_LABELS: Record<UsageEventType, string> = {
  analyze: "code analyses",
  chat: "chat messages",
  analyze_project: "project analyses",
};
