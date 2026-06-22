"use client";

import { FolderOpen, MousePointerClick, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dismissOnboarding } from "@/lib/workspace/onboarding";

const steps = [
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
];

type WorkspaceOnboardingProps = {
  onDismiss: () => void;
};

export function WorkspaceOnboarding({ onDismiss }: WorkspaceOnboardingProps) {
  const handleDismiss = () => {
    dismissOnboarding();
    onDismiss();
  };

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-950/5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Getting started
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Understand your code in 3 steps
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            CodeRider turns files into visual diagrams and plain-language
            explanations.
          </p>
        </div>

        <div className="space-y-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-xs font-semibold text-slate-700 shadow-sm">
                {item.step}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 text-sm font-medium text-slate-900">
                  <item.icon className="size-4 text-slate-500" />
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  {item.description}
                </span>
              </span>
            </div>
          ))}
        </div>

        <Button
          type="button"
          className="mt-5 h-10 w-full rounded-full"
          onClick={handleDismiss}
        >
          Got it, let&apos;s go
        </Button>
      </div>
    </div>
  );
}
