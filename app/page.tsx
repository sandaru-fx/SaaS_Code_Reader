import { FolderOpen, GitBranch, Sparkles, Zap } from "lucide-react";
import type { Metadata } from "next";

import { HeroActions } from "@/components/auth/HeroActions";
import { LandingHeader } from "@/components/auth/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI code flowcharts & explanations",
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} — Understand any code with AI flowcharts`,
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
      "Skip the file tree — paste a snippet and get an instant explanation.",
  },
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

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <LandingHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 px-6 py-16">
        <section className="flex flex-col items-center gap-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
            <GitBranch className="size-7 text-foreground" />
          </div>
          <div className="flex max-w-2xl flex-col gap-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Understand any code with AI flowcharts
            </h1>
            <p className="text-lg text-muted-foreground">
              {SITE_NAME} turns files and snippets into visual architecture
              diagrams and step-by-step explanations — built for developers who
              want clarity fast.
            </p>
          </div>
          <HeroActions />
          <p className="text-xs text-muted-foreground">
            Free to try · Local-first · No repo upload required
          </p>
        </section>

        <section className="grid w-full gap-4 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-5 text-left"
            >
              <Icon className="mb-3 size-5 text-muted-foreground" />
              <h2 className="text-sm font-medium">{title}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-border bg-muted/20 p-8">
          <div className="mb-8 flex items-center gap-2">
            <Sparkles className="size-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ step, title, description }) => (
              <li key={step} className="flex flex-col gap-2">
                <span className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-sm font-medium">
                  {step}
                </span>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
