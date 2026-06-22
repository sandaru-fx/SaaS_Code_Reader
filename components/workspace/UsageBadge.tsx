"use client";

import Link from "next/link";
import { Crown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUsageStatus } from "@/components/workspace/useUsageStatus";

async function startCheckout() {
  const response = await fetch("/api/stripe/checkout", { method: "POST" });
  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Unable to start checkout.");
  }

  window.location.href = data.url;
}

export function UsageBadge() {
  const { usage, isLoading } = useUsageStatus();

  if (isLoading && !usage) {
    return (
      <span className="hidden items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] text-slate-500 lg:inline-flex dark:border-white/[0.06] dark:text-[#e3e3e3]/45">
        <Loader2 className="size-3 animate-spin" />
        Usage
      </span>
    );
  }

  if (!usage?.enabled) {
    return null;
  }

  if (usage.plan === "pro") {
    return (
      <span className="hidden items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-700 lg:inline-flex dark:border-[#cc7a31]/30 dark:bg-[#cc7a31]/10 dark:text-[#cc7a31]">
        <Crown className="size-3" />
        Pro
      </span>
    );
  }

  const remainingAnalyses = Number.isFinite(usage.remaining.analyze)
    ? usage.remaining.analyze
    : "∞";

  return (
    <div className="hidden items-center gap-2 lg:flex">
      <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#e3e3e3]/65">
        {remainingAnalyses} analyses left
      </span>
      {usage.stripeConfigured ? (
        <Button
          type="button"
          size="sm"
          className="h-7 rounded-full px-3 text-[11px] premium-btn-primary"
          onClick={() => void startCheckout().catch(() => undefined)}
        >
          Upgrade
        </Button>
      ) : (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-7 rounded-full px-3 text-[11px] dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
          nativeButton={false}
          render={<Link href="/pricing">Plans</Link>}
        />
      )}
    </div>
  );
}
