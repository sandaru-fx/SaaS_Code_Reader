"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Crown, Loader2, Sparkles, Tag } from "lucide-react";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/LandingNav";
import { FREE_TIER_LIMITS } from "@/lib/usage/constants";

const FREE_FEATURES = [
  `${FREE_TIER_LIMITS.analyze} code analyses / month`,
  `${FREE_TIER_LIMITS.chat} AI chat messages / month`,
  `${FREE_TIER_LIMITS.analyze_project} project guides / month`,
  "All languages, all features",
  "Local-first folder access",
] as const;

const PRO_FEATURES = [
  "Unlimited code analyses",
  "Unlimited AI chat",
  "Unlimited guided project breakdowns",
  "Priority Gemini routing",
  "Analysis history retained",
  "Early access to new features",
] as const;

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
    <div className="dark landing-root relative flex min-h-full flex-1 flex-col">
      <div className="relative isolate flex min-h-full flex-1 flex-col">
        <div
          aria-hidden="true"
          className="landing-mesh pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden="true"
          className="landing-dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-[720px] opacity-40 [mask-image:linear-gradient(180deg,#000_0%,transparent_85%)]"
        />
        <div
          aria-hidden="true"
          className="landing-grain pointer-events-none absolute inset-0 -z-10"
        />

        <LandingNav standalone />

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-14 px-6 py-20">
          <section className="mx-auto max-w-2xl text-center">
            <span className="landing-chip landing-chip-accent">
              <Tag className="size-3.5" strokeWidth={1.75} />
              Simple pricing
            </span>
            <h1 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[44px] sm:leading-[1.1]">
              Start free, upgrade when you outgrow it
            </h1>
            <p className="mt-4 text-[15px] leading-7 text-white/55">
              Generous free tier. One paid plan. No seat math, no tier traps.
            </p>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <article className="landing-surface flex h-full flex-col rounded-2xl p-7">
              <header>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
                  Free
                </p>
                <p className="mt-3 flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-semibold tracking-tight">
                    $0
                  </span>
                  <span className="text-sm text-white/45">/ month</span>
                </p>
                <p className="mt-2 text-[13px] leading-6 text-white/55">
                  For curious developers and weekend learners.
                </p>
              </header>
              <ul className="my-6 space-y-3">
                {FREE_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[13.5px] leading-6 text-white/70"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[#5beac8]"
                      strokeWidth={2.25}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/workspace"
                className="landing-btn-ghost mt-auto inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold"
              >
                Start free
              </Link>
            </article>

            <article
              className="landing-surface-elevated landing-glow-teal relative flex h-full flex-col overflow-hidden rounded-2xl p-7"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 0% 0%, rgba(20,209,160,0.12), transparent 55%)",
              }}
            >
              <header className="relative">
                <span className="landing-chip landing-chip-accent">
                  <Crown className="size-3.5" strokeWidth={1.75} />
                  Most popular
                </span>
                <p className="mt-4 text-[11px] font-medium uppercase tracking-wider text-white/45">
                  Pro
                </p>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  Unlimited
                </p>
                <p className="mt-2 text-[13px] leading-6 text-white/55">
                  For pros shipping features and onboarding into new codebases.
                </p>
              </header>
              <ul className="relative my-6 space-y-3">
                {PRO_FEATURES.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[13.5px] leading-6 text-white/70"
                  >
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-[#5beac8]"
                      strokeWidth={2.25}
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="landing-btn-primary relative mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:opacity-60"
                onClick={() => void handleUpgrade()}
                disabled={isUpgrading}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" strokeWidth={1.75} />
                    Upgrade to Pro
                  </>
                )}
              </button>
              {error ? (
                <p className="relative mt-3 text-center text-sm text-red-400">
                  {error}
                </p>
              ) : null}
            </article>
          </section>
        </main>

        <LandingFooter />
      </div>
    </div>
  );
}
