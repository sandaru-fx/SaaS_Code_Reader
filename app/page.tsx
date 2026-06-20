import { FolderOpen, GitBranch, Zap } from "lucide-react";

import { HeroActions } from "@/components/auth/HeroActions";
import { LandingHeader } from "@/components/auth/LandingHeader";

const features = [
  {
    icon: FolderOpen,
    title: "Local Projects",
    description: "Open folders directly in your browser with zero server storage.",
  },
  {
    icon: GitBranch,
    title: "Visual Flowcharts",
    description: "Auto-generated architecture diagrams from your code.",
  },
  {
    icon: Zap,
    title: "Quick Paste",
    description: "Drop a snippet and get instant AI explanations.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <LandingHeader />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/50">
            <GitBranch className="size-7 text-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            CodeRider
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Understand your code visually — AI-powered flowcharts and
            step-by-step logic explanations for vibe-coded projects.
          </p>
          <HeroActions />
        </div>

        <div className="grid w-full gap-4 sm:grid-cols-3">
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
        </div>
      </main>

      <footer className="border-t border-border px-6 py-4 text-center text-xs text-muted-foreground">
        Local-first by design — your code stays on your machine.
      </footer>
    </div>
  );
}
