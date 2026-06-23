"use client";

import Link from "next/link";
import { ArrowRight, ClipboardPaste, Sparkles } from "lucide-react";

import { AnimatedDiagramPreview } from "@/components/landing/AnimatedDiagramPreview";
import { RotatingWord } from "@/components/landing/RotatingWord";
import { useReveal } from "@/components/landing/useReveal";
import { SITE_NAME } from "@/lib/site";

const ROTATING_WORDS = ["codebase", "repository", "function", "language"] as const;

const TRUST_CHIPS = [
  "Local-first",
  "Powered by Gemini",
  "No credit card",
  "Free 10 / month",
] as const;

export function Hero() {
  const leftRef = useReveal<HTMLDivElement>();
  const rightRef = useReveal<HTMLDivElement>();

  return (
    <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div ref={leftRef} className="landing-reveal flex flex-col items-start gap-7">
          <span className="landing-chip landing-chip-accent">
            <Sparkles className="size-3.5" strokeWidth={1.75} />
            AI flowcharts for any code
          </span>

          <h1 className="text-balance text-[44px] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[56px] lg:text-[64px]">
            Understand any{" "}
            <RotatingWord words={ROTATING_WORDS} />
            <br />
            with AI flowcharts
          </h1>

          <p className="max-w-xl text-pretty text-[17px] leading-[1.6] text-white/60">
            {SITE_NAME} turns unfamiliar files into visual architecture diagrams
            and step-by-step explanations. Stop reading code line-by-line — see
            it think.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="#live-demo"
              className="landing-btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold"
            >
              Try the Demo
              <ArrowRight className="size-4" strokeWidth={2.25} />
            </Link>
            <Link
              href="/workspace?mode=paste"
              className="landing-btn-ghost inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium"
            >
              <ClipboardPaste className="size-4" strokeWidth={1.75} />
              Quick Paste
            </Link>
          </div>

          <ul className="flex flex-wrap items-center gap-2 pt-2">
            {TRUST_CHIPS.map((chip) => (
              <li key={chip} className="landing-chip">
                <span className="size-1.5 rounded-full bg-[#14d1a0]" />
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div ref={rightRef} className="landing-reveal">
          <AnimatedDiagramPreview />
        </div>
      </div>
    </section>
  );
}
