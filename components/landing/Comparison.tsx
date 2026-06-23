"use client";

import { Check, Scale, X } from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";

const ROWS = [
  {
    without: "Hours reading unfamiliar code line-by-line",
    with: "Minutes to grasp the architecture",
  },
  {
    without: "Lost in deeply nested conditionals and callbacks",
    with: "Flowcharts surface the control flow visually",
  },
  {
    without: "Upload your entire repo to a chat tool",
    with: "Files stay local — only the analyzed snippet is sent",
  },
  {
    without: "Copy-paste between ChatGPT tabs and IDEs",
    with: "One workspace with diagrams, chat, and history",
  },
  {
    without: "Explanations buried in walls of prose",
    with: "Step-numbered breakdowns next to the diagram",
  },
] as const;

export function Comparison() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section className="relative py-24">
      <div
        ref={ref}
        className="landing-reveal mx-auto w-full max-w-6xl px-6"
      >
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="landing-chip landing-chip-accent">
            <Scale className="size-3.5" strokeWidth={1.75} />
            Why CodeRider
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
            The old way vs the CodeRider way
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="landing-surface rounded-2xl p-6">
            <header className="mb-5 flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-300">
                <X className="size-5" strokeWidth={2} />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40">
                  Without CodeRider
                </p>
                <p className="text-[15px] font-semibold text-white">
                  The slow, manual loop
                </p>
              </div>
            </header>
            <ul className="space-y-3">
              {ROWS.map((row) => (
                <li
                  key={`without-${row.without}`}
                  className="flex items-start gap-3 text-[13.5px] leading-6 text-white/55"
                >
                  <span className="mt-1.5 inline-flex size-1.5 shrink-0 rounded-full bg-rose-400/60" />
                  {row.without}
                </li>
              ))}
            </ul>
          </div>

          <div
            className="landing-surface-elevated rounded-2xl p-6"
            style={{
              backgroundImage:
                "radial-gradient(circle at 0% 0%, rgba(20,209,160,0.10), transparent 55%), radial-gradient(circle at 100% 100%, rgba(20,209,160,0.06), transparent 50%)",
            }}
          >
            <header className="mb-5 flex items-center gap-3">
              <span className="landing-icon-tile">
                <Check className="size-5" strokeWidth={2.25} />
              </span>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-[#7eecd0]">
                  With CodeRider
                </p>
                <p className="text-[15px] font-semibold text-white">
                  Visual understanding, instantly
                </p>
              </div>
            </header>
            <ul className="space-y-3">
              {ROWS.map((row) => (
                <li
                  key={`with-${row.with}`}
                  className="flex items-start gap-3 text-[13.5px] leading-6 text-white/80"
                >
                  <Check
                    className="mt-0.5 size-4 shrink-0 text-[#5beac8]"
                    strokeWidth={2.5}
                  />
                  {row.with}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
