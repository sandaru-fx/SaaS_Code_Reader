"use client";

import { HelpCircle, Plus } from "lucide-react";

import { useReveal } from "@/components/landing/useReveal";

const FAQS = [
  {
    q: "Is my code uploaded anywhere?",
    a: "No. CodeRider opens folders locally via the File System Access API — files never leave your browser. Only the specific snippet or file you click Analyze on is sent to Gemini, and we don't persist it on our servers.",
  },
  {
    q: "Which languages are supported?",
    a: "30+ languages including TypeScript, JavaScript, Python, Go, Rust, Java, Kotlin, Swift, PHP, Ruby, C#, C/C++, SQL, YAML, JSON, Markdown, and more. Syntax highlighting and Mermaid diagrams work for all of them.",
  },
  {
    q: "What's the free tier limit?",
    a: "The free plan includes 10 code analyses, 30 AI chat messages, and 3 guided project breakdowns per month. No credit card required to start — you only see the Pro upgrade prompt after you hit a limit.",
  },
  {
    q: "Can I use this on private or client repos?",
    a: "Yes. Because the file tree lives in your browser, you can analyze closed-source, NDA'd, or client code. Only the file you actively analyze is sent to the AI provider for that single request.",
  },
  {
    q: "Which browsers work?",
    a: "Local folder opening uses the File System Access API, which works in Chrome, Edge, Opera, and other Chromium-based browsers on desktop. Firefox and Safari are not yet supported for folder mode — Quick Paste works everywhere.",
  },
  {
    q: "How is this different from ChatGPT or Copilot?",
    a: "ChatGPT chats; Copilot autocompletes. CodeRider focuses purely on understanding — Mermaid architecture diagrams, file-by-file walkthroughs, persisted chat scoped to your project, and a workspace you can return to.",
  },
] as const;

export function Faq() {
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="faq" className="relative py-24">
      <div ref={ref} className="landing-reveal mx-auto w-full max-w-4xl px-6">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="landing-chip landing-chip-accent">
            <HelpCircle className="size-3.5" strokeWidth={1.75} />
            FAQ
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.025em] text-white sm:text-[40px] sm:leading-[1.1]">
            Quick answers before you dive in
          </h2>
        </div>

        <div className="divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group px-6 py-5 transition-colors open:bg-white/[0.025]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left">
                <span className="text-[15px] font-medium text-white">
                  {item.q}
                </span>
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-white/55 transition-all group-open:rotate-45 group-open:bg-[#14d1a0]/15 group-open:text-[#7eecd0]">
                  <Plus className="size-4" strokeWidth={1.75} />
                </span>
              </summary>
              <p className="mt-3 text-[13.5px] leading-7 text-white/60">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
