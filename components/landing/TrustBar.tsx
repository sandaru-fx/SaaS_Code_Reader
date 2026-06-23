"use client";

import {
  Globe2,
  Languages,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";

const STATS = [
  { value: "30+", label: "languages supported" },
  { value: "100KB", label: "per-file safety cap" },
  { value: "<5s", label: "median analyze time" },
  { value: "0", label: "files uploaded to AI" },
] as const;

const BADGES = [
  { icon: ShieldCheck, label: "Local-first" },
  { icon: Sparkles, label: "Gemini-powered" },
  { icon: Languages, label: "30+ languages" },
  { icon: Zap, label: "Instant analyze" },
  { icon: Globe2, label: "Runs in your browser" },
] as const;

export function TrustBar() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="border-y border-white/[0.05] bg-white/[0.015]">
      <div
        ref={ref}
        className="landing-reveal mx-auto grid w-full max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr] lg:items-center"
      >
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-left">
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-[28px]">
                {stat.value}
              </p>
              <p className="mt-1 text-[12px] leading-snug text-white/45">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {BADGES.map(({ icon: Icon, label }) => (
            <span key={label} className="landing-chip">
              <Icon className="size-3.5" strokeWidth={1.75} />
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
