"use client";

import Link from "next/link";
import { ArrowRight, Check, Crown, Sparkles, Tag } from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";
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

export function PricingTeaser() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="pricing" className="relative py-24">
      <div ref={ref} className="landing-reveal mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="landing-chip landing-chip-accent">
            <Tag className="size-3.5" strokeWidth={1.75} />
            Simple pricing
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
            Start free, upgrade when you outgrow it
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-white/55">
            Generous free tier. One paid plan. No seat math, no tier traps.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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
            <span className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-[#cc7a31]/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#f0a060]">
              <Crown className="size-3" strokeWidth={2} />
              Most popular
            </span>
            <header>
              <p className="text-[11px] font-medium uppercase tracking-wider text-[#7eecd0]">
                Pro
              </p>
              <p className="mt-3 flex items-baseline gap-1 text-white">
                <span className="text-4xl font-semibold tracking-tight">
                  $12
                </span>
                <span className="text-sm text-white/45">/ month</span>
              </p>
              <p className="mt-2 text-[13px] leading-6 text-white/55">
                For pros shipping features and onboarding into new codebases
                every week.
              </p>
            </header>
            <ul className="my-6 space-y-3">
              {PRO_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-[13.5px] leading-6 text-white"
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
              href="/pricing"
              className="landing-btn-primary mt-auto inline-flex h-11 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-semibold"
            >
              <Sparkles className="size-4" strokeWidth={1.75} />
              Upgrade to Pro
            </Link>
          </article>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-white"
          >
            Compare plans in detail
            <ArrowRight className="size-3.5" strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
