"use client";

import { FolderOpen, MousePointerClick, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dismissOnboarding } from "@/lib/workspace/onboarding";

export const ONBOARDING_STEPS = [
  {
    step: "1",
    icon: FolderOpen,
    title: "Open a project folder",
    description: 'Click "Open Folder" and choose your local codebase.',
  },
  {
    step: "2",
    icon: MousePointerClick,
    title: "Select a file",
    description: "Pick any file from the explorer to load it in the editor.",
  },
  {
    step: "3",
    icon: Sparkles,
    title: "Analyze with AI",
    description: "Hit Analyze to generate a flowchart and explanation.",
  },
] as const;

type WorkspaceOnboardingProps = {
  onDismiss: () => void;
  compact?: boolean;
};

export function WorkspaceOnboarding({
  onDismiss,
  compact = false,
}: WorkspaceOnboardingProps) {
  const handleDismiss = () => {
    dismissOnboarding();
    onDismiss();
  };

  if (compact) {
    return (
      <div className="w-full max-w-2xl rounded-2xl border border-white/[0.08] bg-[#1c1c1c] p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#14d1a0]">
          Getting started
        </p>
        <p className="mt-1 text-sm text-[#e3e3e3]/70">
          Open a folder, pick a file, then click Analyze.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-3 h-8 rounded-full px-3 text-xs text-[#e3e3e3]/60 hover:text-[#e3e3e3]"
          onClick={handleDismiss}
        >
          Dismiss tips
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-[1.75rem] border border-white/[0.08] bg-[#1c1c1c] p-6 shadow-lg shadow-black/20">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#14d1a0]">
          Getting started
        </p>
        <h2 className="mt-1 text-lg font-semibold text-[#e3e3e3]">
          Understand your code in 3 steps
        </h2>
        <p className="mt-1 text-sm text-[#e3e3e3]/55">
          CodeRider turns files into visual diagrams and plain-language
          explanations.
        </p>
      </div>

      <div className="space-y-3">
        {ONBOARDING_STEPS.map((item) => (
          <div
            key={item.step}
            className="flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-xs font-semibold text-[#e3e3e3]">
              {item.step}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2 text-sm font-medium text-[#e3e3e3]">
                <item.icon className="size-4 text-[#14d1a0]" />
                {item.title}
              </span>
              <span className="mt-1 block text-xs leading-5 text-[#e3e3e3]/55">
                {item.description}
              </span>
            </span>
          </div>
        ))}
      </div>

      <Button
        type="button"
        className="mt-5 h-10 w-full rounded-full premium-btn-primary"
        onClick={handleDismiss}
      >
        Got it, let&apos;s go
      </Button>
    </div>
  );
}
