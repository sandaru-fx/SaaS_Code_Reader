import {
  CheckCircle2,
  Code2,
  FolderOpen,
  GitBranch,
  LockKeyhole,
  Sparkles,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";

import { HeroActions } from "@/components/auth/HeroActions";
import { LandingHeader } from "@/components/auth/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI code flowcharts & explanations",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} - Understand any code with AI flowcharts`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
};

const features = [
  {
    icon: FolderOpen,
    title: "Open local folders",
    description:
      "Browse projects in your browser. Files never leave your machine until you analyze.",
  },
  {
    icon: GitBranch,
    title: "Visual flowcharts",
    description:
      "Gemini reads your code and generates Mermaid architecture diagrams automatically.",
  },
  {
    icon: Zap,
    title: "Quick paste mode",
    description:
      "Skip the file tree - paste a snippet and get an instant explanation.",
  },
] as const;

const stats = [
  { value: "100KB", label: "per-file safety cap" },
  { value: "500KB", label: "project guardrail" },
  { value: "$0", label: "MVP cloud stack" },
] as const;

const steps = [
  {
    step: "1",
    title: "Open or paste code",
    description: "Load a local folder or drop a snippet into Quick Paste mode.",
  },
  {
    step: "2",
    title: "Click Analyze",
    description: "AI scans the logic and maps how your code flows.",
  },
  {
    step: "3",
    title: "See the diagram",
    description: "Get a flowchart plus a plain-English walkthrough side by side.",
  },
] as const;

const benefits = [
  "No repo upload required",
  "Mermaid diagrams you can inspect",
  "Paste mode for quick debugging",
  "Production-ready guardrails",
] as const;

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden bg-[#f6f7fb]">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_34%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(246,247,251,1))]" />
      <LandingHeader />

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-20 px-6 py-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="flex flex-col items-start gap-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
              <Sparkles className="size-3.5 text-blue-600" />
              AI-powered visual workspace for developers
            </div>

            <div className="flex max-w-3xl flex-col gap-5">
              <h1 className="text-balance text-5xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
                Understand any code with AI flowcharts
              </h1>
              <p className="max-w-2xl text-pretty text-lg leading-8 text-slate-600">
                {SITE_NAME} turns files and snippets into visual architecture
                diagrams and step-by-step explanations, so developers can move
                from confusion to clarity faster.
              </p>
            </div>

            <HeroActions />

            <div className="grid w-full max-w-xl grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <p className="text-xl font-semibold tracking-tight text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-4 text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-slate-950 p-3 shadow-2xl shadow-slate-950/20">
            <div className="overflow-hidden rounded-[1.45rem] border border-white/10 bg-slate-900">
              <div className="flex h-11 items-center gap-2 border-b border-white/10 bg-white/5 px-4">
                <span className="size-2.5 rounded-full bg-red-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 rounded-full bg-white/10 px-3 py-1 text-[11px] text-slate-300">
                  Workspace / analyze.ts
                </span>
              </div>
              <div className="grid min-h-[380px] grid-cols-[0.75fr_1fr]">
                <div className="border-r border-white/10 bg-slate-950/80 p-4">
                  <div className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                    <FolderOpen className="size-3.5" />
                    Project
                  </div>
                  {["app", "components", "lib/ai", "workspace.tsx"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`mb-2 rounded-xl px-3 py-2 text-sm ${
                          index === 2
                            ? "bg-blue-500/15 text-blue-100 ring-1 ring-blue-400/20"
                            : "text-slate-400"
                        }`}
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="border-b border-white/10 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="font-mono text-xs text-slate-500">
                        Gemini analysis
                      </span>
                      <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-medium text-emerald-300">
                        Ready
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-11/12 rounded-full bg-slate-700" />
                      <div className="h-2 w-8/12 rounded-full bg-slate-700" />
                      <div className="h-2 w-10/12 rounded-full bg-slate-700" />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4">
                      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-blue-100">
                        <GitBranch className="size-4" />
                        Generated flowchart
                      </div>
                      <div className="grid grid-cols-3 items-center gap-3 text-center text-[11px] text-slate-300">
                        {["Input", "Analyze", "Diagram"].map((node) => (
                          <div
                            key={node}
                            className="rounded-xl border border-white/10 bg-slate-950/70 px-2 py-3"
                          >
                            {node}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="h-2 w-full rounded-full bg-white/10" />
                        <div className="h-2 w-3/4 rounded-full bg-white/10" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid w-full gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group rounded-3xl border border-white bg-white/80 p-6 text-left shadow-sm backdrop-blur transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
            >
              <div className="mb-5 flex size-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm transition-transform group-hover:scale-105">
                <Icon className="size-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-950">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 rounded-[2rem] border border-white bg-white/80 p-6 shadow-sm backdrop-blur lg:grid-cols-[0.8fr_1fr] lg:p-8">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Product workflow
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              From raw code to visual understanding
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              CodeRider keeps the workflow simple: bring code in, ask AI to map
              the logic, then inspect the diagram and explanation side by side.
            </p>
          </div>
          <ol className="grid gap-4">
            {steps.map(({ step, title, description }) => (
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                  {step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-950">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-900 bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/15">
            <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-white/10">
              <Code2 className="size-6" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Built for real developer workflows
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Open folders, inspect code, paste snippets, analyze with Gemini,
              and share Mermaid logic with teammates. The MVP stays focused on
              speed, clarity, and trust.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white bg-white/80 p-8 shadow-sm backdrop-blur">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-slate-950">
              <LockKeyhole className="size-4" />
              Launch-ready basics
            </div>
            <div className="space-y-3">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span className="text-sm text-slate-600">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
