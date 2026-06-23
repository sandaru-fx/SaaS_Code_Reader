"use client";

import { useEffect, useState } from "react";
import { Cpu, FileCode2, GitBranch, Sparkles } from "lucide-react";

type Snapshot = {
  fileName: string;
  language: string;
  fileLines: number[];
  nodes: readonly string[];
  edges: readonly [number, number][];
  explanation: readonly string[];
};

const SNAPSHOTS: readonly Snapshot[] = [
  {
    fileName: "checkout.ts",
    language: "TypeScript",
    fileLines: [78, 56, 66, 42, 70, 50, 60],
    nodes: ["Cart", "Validate", "Stripe", "Receipt"],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    explanation: [
      "Builds a cart payload from the user session.",
      "Validates pricing rules before payment.",
      "Sends the checkout intent to Stripe.",
      "Renders the receipt and emails the user.",
    ],
  },
  {
    fileName: "auth.py",
    language: "Python",
    fileLines: [62, 48, 70, 58, 44, 66, 52],
    nodes: ["Login", "Token", "Session", "Home"],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    explanation: [
      "Accepts credentials from the sign-in form.",
      "Issues a short-lived JWT access token.",
      "Persists the session in Redis.",
      "Redirects the user to the dashboard.",
    ],
  },
  {
    fileName: "main.js",
    language: "JavaScript",
    fileLines: [54, 70, 50, 64, 46, 72, 58],
    nodes: ["Init", "Fetch", "Render", "Listen"],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
    ],
    explanation: [
      "Bootstraps the app on DOMContentLoaded.",
      "Fetches data from the catalog API.",
      "Renders product cards into the page.",
      "Wires up event listeners for the cart.",
    ],
  },
];

const CYCLE_MS = 6800;

export function AnimatedDiagramPreview() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % SNAPSHOTS.length);
    }, CYCLE_MS);

    return () => window.clearInterval(id);
  }, []);

  const snapshot = SNAPSHOTS[index];

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-6 -z-10 opacity-70 blur-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,209,160,0.35),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.18),transparent_50%)]" />
      </div>

      <div className="landing-surface-elevated landing-float overflow-hidden rounded-3xl">
        <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.06] bg-white/[0.02] px-4">
          <span className="size-2 rounded-full bg-rose-400/70" />
          <span className="size-2 rounded-full bg-amber-300/70" />
          <span className="size-2 rounded-full bg-emerald-400/70" />
          <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 text-[10.5px] font-medium text-white/55">
            <FileCode2 className="size-3" strokeWidth={1.75} />
            workspace / {snapshot.fileName}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            <span className="size-1 rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-[170px_1fr] divide-x divide-white/[0.06]">
          <div className="bg-black/20 p-4">
            <p className="mb-3 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
              <Cpu className="size-3" strokeWidth={1.75} />
              Project
            </p>
            <ul className="space-y-1 text-[11.5px]">
              {["app", "components", "lib/ai", snapshot.fileName].map(
                (item, i) => {
                  const isActive = i === 3;
                  return (
                    <li
                      key={`${snapshot.fileName}-${item}`}
                      className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 ${
                        isActive
                          ? "bg-[#14d1a0]/12 text-[#7eecd0]"
                          : "text-white/55"
                      }`}
                    >
                      <span
                        className={`size-1 rounded-full ${
                          isActive ? "bg-[#14d1a0]" : "bg-white/30"
                        }`}
                      />
                      {item}
                    </li>
                  );
                }
              )}
            </ul>

            <p className="mt-5 mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-white/40">
              <Sparkles className="size-3" strokeWidth={1.75} />
              AI status
            </p>
            <div className="space-y-1.5">
              {snapshot.fileLines.slice(0, 4).map((w, i) => (
                <div
                  key={`${snapshot.fileName}-line-${i}`}
                  className="landing-skeleton-line h-1.5"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5">
              <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-white/45">
                <GitBranch className="size-3" strokeWidth={1.75} />
                generated flowchart
              </div>
              <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-white/55">
                {snapshot.language}
              </span>
            </div>

            <div
              key={`diagram-${index}`}
              className="relative flex min-h-[260px] flex-1 items-center justify-center p-5"
            >
              <svg
                viewBox="0 0 320 200"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14d1a0" stopOpacity="0.65" />
                    <stop offset="100%" stopColor="#14d1a0" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {snapshot.edges.map(([from, to], i) => {
                  const x1 = 60 + (from % 2) * 200;
                  const y1 = 50 + Math.floor(from / 2) * 100;
                  const x2 = 60 + (to % 2) * 200;
                  const y2 = 50 + Math.floor(to / 2) * 100;
                  return (
                    <line
                      key={`edge-${i}-${index}`}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="url(#edgeGrad)"
                      strokeWidth="1.5"
                      className="landing-draw-line"
                      style={{
                        animationDelay: `${0.45 + i * 0.18}s`,
                      }}
                    />
                  );
                })}
              </svg>

              <div className="relative grid w-full max-w-[280px] grid-cols-2 gap-x-12 gap-y-10">
                {snapshot.nodes.map((node, i) => (
                  <div
                    key={`${snapshot.fileName}-node-${i}`}
                    className="landing-node-pop relative z-10 flex h-9 items-center justify-center rounded-xl border border-white/10 bg-[#0c1311] px-3 text-center text-[11px] font-medium text-white/85 shadow-[0_8px_24px_-12px_rgba(20,209,160,0.4)]"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  >
                    <span className="absolute -inset-px rounded-xl bg-gradient-to-b from-[#14d1a0]/15 to-transparent opacity-60" />
                    <span className="relative">{node}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/[0.06] px-4 py-3">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-white/40">
                Step-by-step explanation
              </p>
              <ol className="space-y-1.5">
                {snapshot.explanation.map((line, i) => (
                  <li
                    key={`${snapshot.fileName}-exp-${i}`}
                    className="landing-node-pop flex items-start gap-2 text-[11px] leading-relaxed text-white/65"
                    style={{ animationDelay: `${0.8 + i * 0.12}s` }}
                  >
                    <span className="mt-1 inline-flex size-3.5 shrink-0 items-center justify-center rounded-full bg-[#14d1a0]/15 text-[9px] font-semibold text-[#7eecd0]">
                      {i + 1}
                    </span>
                    {line}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {SNAPSHOTS.map((s, i) => (
          <button
            key={s.fileName}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show ${s.fileName} preview`}
            className={`h-1 rounded-full transition-all ${
              i === index ? "w-8 bg-[#14d1a0]" : "w-3 bg-white/15 hover:bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
