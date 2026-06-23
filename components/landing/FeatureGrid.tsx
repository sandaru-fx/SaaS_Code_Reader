"use client";

import {
  BookOpenCheck,
  ClipboardPaste,
  GitBranch,
  Highlighter,
  MessageSquareCode,
  ShieldCheck,
} from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";

const FEATURES = [
  {
    icon: GitBranch,
    title: "Visual flowcharts",
    description:
      "Every analysis renders a Mermaid architecture diagram you can zoom, export as PNG/SVG, and share with teammates.",
  },
  {
    icon: BookOpenCheck,
    title: "AI Tutor mode",
    description:
      "Guided learning paths that walk you through unfamiliar projects file-by-file with structured lessons.",
  },
  {
    icon: ClipboardPaste,
    title: "Quick Paste snippets",
    description:
      "Skip the file tree — paste any code block, pick a language, and get an instant explanation.",
  },
  {
    icon: ShieldCheck,
    title: "Local-first privacy",
    description:
      "Folders open in your browser via the File System API. Only the snippet you analyze is sent to the AI.",
  },
  {
    icon: MessageSquareCode,
    title: "Chat with your code",
    description:
      "Ask follow-up questions about any explanation. Persisted per-project so context never resets.",
  },
  {
    icon: Highlighter,
    title: "Syntax-aware explanations",
    description:
      "Markdown answers with Shiki-highlighted code blocks for 30+ languages, copy-ready and beautiful.",
  },
] as const;

export function FeatureGrid() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="features" className="relative py-24">
      <div
        ref={ref}
        className="landing-reveal mx-auto w-full max-w-6xl px-6"
      >
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="landing-chip landing-chip-accent">
            <GitBranch className="size-3.5" strokeWidth={1.75} />
            What you get
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
            Everything you need to read code faster
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-white/55">
            A focused workspace built for understanding, not editing.
            Diagrams, explanations, chat, and history — all in one place.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <article
              key={title}
              className="landing-card-hover landing-surface group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl p-6"
              style={{
                animationDelay: `${i * 60}ms`,
              }}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#14d1a0]/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="landing-icon-tile">
                <Icon className="size-5" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-[15.5px] font-semibold text-white">
                  {title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-6 text-white/55">
                  {description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
