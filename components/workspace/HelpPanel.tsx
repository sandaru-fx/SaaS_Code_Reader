"use client";

import {
  BookOpen,
  ClipboardPaste,
  FolderTree,
  HelpCircle,
  Keyboard,
  Sparkles,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { resetTour } from "@/lib/workspace/onboarding";

type HelpPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
};

const MODES = [
  {
    icon: BookOpen,
    title: "Guide Me",
    description:
      "Best for new users. AI builds a learning path and walks you through files in order.",
  },
  {
    icon: FolderTree,
    title: "Explore",
    description:
      "Browse a local folder freely and analyze any file you choose.",
  },
  {
    icon: ClipboardPaste,
    title: "Quick Paste",
    description:
      "Paste a snippet without opening a folder. Great for quick debugging.",
  },
] as const;

export function HelpPanel({ isOpen, onClose, onStartTour }: HelpPanelProps) {
  if (!isOpen) {
    return null;
  }

  const handleStartTour = () => {
    resetTour();
    onStartTour();
    onClose();
  };

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-[1px]"
        aria-label="Close help panel"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col border-l border-white/[0.08] bg-[#121212] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="size-5 text-[#14d1a0]" strokeWidth={1.5} />
            <h2 className="text-base font-semibold text-[#e3e3e3]">Help</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0 text-[#e3e3e3]/70"
            onClick={onClose}
            aria-label="Close help"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <section className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#e3e3e3]/45">
              Workspace modes
            </h3>
            <div className="mt-3 space-y-3">
              {MODES.map((mode) => (
                <div
                  key={mode.title}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-[#e3e3e3]">
                    <mode.icon className="size-4 text-[#14d1a0]" />
                    {mode.title}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#e3e3e3]/55">
                    {mode.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#e3e3e3]/45">
              How to analyze
            </h3>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-[#e3e3e3]/70">
              <li>Open a folder or paste a code snippet</li>
              <li>Select a file from the explorer (folder mode)</li>
              <li>Click Analyze in the top bar</li>
            </ol>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-xs text-[#e3e3e3]/60">
              <Keyboard className="size-3.5 shrink-0 text-[#14d1a0]" />
              Shortcut: Ctrl+Enter to analyze
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-[#e3e3e3]/45">
              Browser note
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#e3e3e3]/55">
              Local folder access requires Chrome or Edge. Your files stay on
              your device until you analyze them.
            </p>
          </section>

          <Button
            type="button"
            className="h-10 w-full rounded-full premium-btn-primary"
            onClick={handleStartTour}
          >
            <Sparkles className="size-4" strokeWidth={1.75} />
            Take a tour
          </Button>
        </div>
      </aside>
    </>
  );
}
