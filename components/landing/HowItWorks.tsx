"use client";

import { FolderOpen, Sparkles, Workflow } from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";

const STEPS = [
  {
    icon: FolderOpen,
    badge: "01",
    title: "Open or paste code",
    description:
      "Load a local folder via the File System Access API or drop a snippet into Quick Paste mode.",
    preview: (
      <div className="space-y-2">
        {["app/", "components/", "lib/ai/", "checkout.ts"].map((label, i) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] ${
              i === 3
                ? "bg-[#14d1a0]/12 text-[#7eecd0]"
                : "text-white/55"
            }`}
          >
            <span
              className={`size-1 rounded-full ${
                i === 3 ? "bg-[#14d1a0]" : "bg-white/30"
              }`}
            />
            {label}
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Sparkles,
    badge: "02",
    title: "Click Analyze",
    description:
      "Gemini scans the logic, classes, and control flow. Pre-flight rules block files that are too large or binary.",
    preview: (
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-[#14d1a0]/25 bg-[#14d1a0]/10 px-3 py-2 text-[11px] font-medium text-[#7eecd0]">
          <Sparkles className="size-3.5" strokeWidth={1.75} />
          Analyzing checkout.ts
        </div>
        <div className="landing-skeleton-line h-2 w-11/12" />
        <div className="landing-skeleton-line h-2 w-9/12" />
        <div className="landing-skeleton-line h-2 w-10/12" />
      </div>
    ),
  },
  {
    icon: Workflow,
    badge: "03",
    title: "See the diagram",
    description:
      "A Mermaid flowchart appears next to a step-by-step explanation. Export, share, or chat with the result.",
    preview: (
      <div className="relative h-[120px] w-full">
        <svg
          viewBox="0 0 200 120"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="howEdge" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#14d1a0" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#14d1a0" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          <line
            x1="50"
            y1="30"
            x2="100"
            y2="60"
            stroke="url(#howEdge)"
            strokeWidth="1.4"
          />
          <line
            x1="100"
            y1="60"
            x2="150"
            y2="30"
            stroke="url(#howEdge)"
            strokeWidth="1.4"
          />
          <line
            x1="100"
            y1="60"
            x2="100"
            y2="100"
            stroke="url(#howEdge)"
            strokeWidth="1.4"
          />
        </svg>
        {[
          { left: 18, top: 12, label: "Cart" },
          { left: 122, top: 12, label: "Stripe" },
          { left: 70, top: 46, label: "Analyze" },
          { left: 70, top: 88, label: "Receipt" },
        ].map((node) => (
          <span
            key={node.label}
            className="absolute inline-flex h-6 items-center justify-center rounded-md border border-white/10 bg-[#0c1311] px-2.5 text-[10px] font-medium text-white/80 shadow-[0_4px_12px_-6px_rgba(20,209,160,0.4)]"
            style={{ left: node.left, top: node.top }}
          >
            {node.label}
          </span>
        ))}
      </div>
    ),
  },
] as const;

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="how-it-works" className="relative py-24">
      <div
        ref={ref}
        className="landing-reveal mx-auto w-full max-w-6xl px-6"
      >
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="landing-chip landing-chip-accent">
            <Workflow className="size-3.5" strokeWidth={1.75} />
            How it works
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
            Three steps from confusion to clarity
          </h2>
        </div>

        <div className="relative grid gap-5 lg:grid-cols-3">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12%] right-[12%] top-[88px] hidden h-px lg:block"
          >
            <div className="landing-divider h-full" />
          </div>

          {STEPS.map(({ icon: Icon, badge, title, description, preview }) => (
            <div
              key={badge}
              className="landing-surface relative flex h-full flex-col gap-5 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="landing-icon-tile">
                  <Icon className="size-5" strokeWidth={1.75} />
                </div>
                <span className="font-mono text-xs font-medium text-white/35">
                  {badge}
                </span>
              </div>
              <div>
                <h3 className="text-[15.5px] font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-6 text-white/55">
                  {description}
                </p>
              </div>
              <div className="mt-auto rounded-xl border border-white/[0.06] bg-black/25 p-4">
                {preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
