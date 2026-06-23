"use client";

import Link from "next/link";
import { ArrowRight, ClipboardPaste, Sparkles } from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";

export function CtaBanner() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative py-24">
      <div
        ref={ref}
        className="landing-reveal mx-auto w-full max-w-5xl px-6"
      >
        <div
          className="relative overflow-hidden rounded-[28px] border border-[#14d1a0]/25 p-10 sm:p-14"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 0%, rgba(20,209,160,0.22), transparent 55%), radial-gradient(circle at 80% 100%, rgba(204,122,49,0.12), transparent 55%), linear-gradient(180deg, #0a1714 0%, #060a09 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[#14d1a0]/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 top-0 size-64 rounded-full bg-[#cc7a31]/10 blur-3xl"
          />

          <div className="relative flex flex-col items-center gap-7 text-center">
            <span className="landing-chip landing-chip-accent">
              <Sparkles className="size-3.5" strokeWidth={1.75} />
              Ready in seconds
            </span>
            <h2 className="text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[44px] sm:leading-[1.05]">
              Ready to understand any codebase?
            </h2>
            <p className="max-w-xl text-[15.5px] leading-7 text-white/65">
              Open your first folder, hit Analyze, and watch the diagram appear.
              No credit card, no install, no upload.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/workspace"
                className="landing-btn-primary inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-semibold"
              >
                Open Workspace Free
                <ArrowRight className="size-4" strokeWidth={2.25} />
              </Link>
              <Link
                href="/workspace?mode=paste"
                className="landing-btn-ghost inline-flex h-12 items-center gap-2 rounded-full px-6 text-sm font-medium"
              >
                <ClipboardPaste className="size-4" strokeWidth={1.75} />
                Quick Paste a snippet
              </Link>
            </div>
            <p className="text-xs text-white/40">
              Free tier — no credit card required.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
