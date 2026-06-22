"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Loader2 } from "lucide-react";

import { LandingHeader } from "@/components/auth/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/button";
import { FREE_TIER_LIMITS } from "@/lib/usage/constants";

async function startCheckout() {
  const response = await fetch("/api/stripe/checkout", { method: "POST" });
  const data = (await response.json()) as { url?: string; error?: string };

  if (!response.ok || !data.url) {
    throw new Error(data.error ?? "Unable to start checkout.");
  }

  window.location.href = data.url;
}

export default function PricingPage() {
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    setError(null);

    try {
      await startCheckout();
    } catch (upgradeError) {
      setError(
        upgradeError instanceof Error
          ? upgradeError.message
          : "Unable to start checkout."
      );
      setIsUpgrading(false);
    }
  };

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#f6f7fb] dark:bg-[#0a0a0a]">
      <LandingHeader />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-16">
        <section className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600 dark:text-[#14d1a0]">
            Pricing
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-[#1f1f1f] dark:text-[#e3e3e3]">
            Simple plans for learning and building
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600 dark:text-[#e3e3e3]/65">
            Start free while you explore projects. Upgrade to Pro when you need
            unlimited AI analyses, chat, and guided project breakdowns.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-white/[0.06] dark:bg-[#1c1c1c]">
            <h2 className="text-xl font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">
              Free
            </h2>
            <p className="mt-2 text-3xl font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
              $0
              <span className="text-base font-normal text-slate-500 dark:text-[#e3e3e3]/55">
                /month
              </span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-[#e3e3e3]/70">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-blue-600 dark:text-[#14d1a0]" />
                {FREE_TIER_LIMITS.analyze} code analyses / month
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-blue-600 dark:text-[#14d1a0]" />
                {FREE_TIER_LIMITS.chat} chat messages / month
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-blue-600 dark:text-[#14d1a0]" />
                {FREE_TIER_LIMITS.analyze_project} project guides / month
              </li>
            </ul>
            <Button
              className="mt-8 w-full rounded-full"
              variant="outline"
              nativeButton={false}
              render={<Link href="/workspace">Start free</Link>}
            />
          </div>

          <div className="rounded-3xl border border-blue-200 bg-white p-8 shadow-lg dark:border-[#14d1a0]/30 dark:bg-[#1c1c1c] dark:shadow-[0_0_32px_-12px_rgba(20,209,160,0.25)]">
            <div className="flex items-center gap-2 text-amber-600 dark:text-[#cc7a31]">
              <Crown className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em]">
                Most popular
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">
              Pro
            </h2>
            <p className="mt-2 text-3xl font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
              Unlimited
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600 dark:text-[#e3e3e3]/70">
              <li className="flex items-center gap-2">
                <Check className="size-4 text-blue-600 dark:text-[#14d1a0]" />
                Unlimited code analyses
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-blue-600 dark:text-[#14d1a0]" />
                Unlimited AI chat
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-4 text-blue-600 dark:text-[#14d1a0]" />
                Unlimited guided project breakdowns
              </li>
            </ul>
            <Button
              className="mt-8 w-full rounded-full premium-btn-primary"
              onClick={() => void handleUpgrade()}
              disabled={isUpgrading}
            >
              {isUpgrading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Upgrade to Pro"
              )}
            </Button>
            {error ? (
              <p className="mt-3 text-center text-sm text-red-500">{error}</p>
            ) : null}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
