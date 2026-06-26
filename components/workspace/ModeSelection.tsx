"use client";

import { useState } from "react";
import {
  BookOpen,
  ClipboardPaste,
  Compass,
  FolderOpen,
  FolderTree,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WorkspaceOnboarding } from "@/components/workspace/WorkspaceOnboarding";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { markModeChosen } from "@/lib/workspace/onboarding";

export function ModeSelection() {
  const {
    openFolder,
    switchToPaste,
    isSupported,
    isFileSystemReady,
    showOnboarding,
    dismissOnboarding,
  } = useWorkspace();
  const [showFolderChoice, setShowFolderChoice] = useState(false);
  const canOpenFolder = !isFileSystemReady || isSupported;

  const handleModePick = (action: () => void) => {
    markModeChosen();
    action();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center overflow-y-auto p-8 text-center dark:bg-[#121212]">
      {showOnboarding ? (
        <div className="mb-8 w-full max-w-2xl">
          <WorkspaceOnboarding onDismiss={dismissOnboarding} />
        </div>
      ) : null}

      <div className="mb-8 max-w-md">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-[#14d1a0]/10 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/20">
          <Compass className="size-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-[28px] font-medium leading-tight tracking-tight text-[#1f1f1f] dark:text-[#e3e3e3]">
          How do you want to learn?
        </h1>
        <p className="mt-3 text-base font-normal leading-7 text-slate-500 dark:text-[#e3e3e3]/55">
          Choose a mode, then pick a local project folder to get started.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => handleModePick(() => void openFolder("guide"))}
          disabled={!canOpenFolder}
          className="group relative flex flex-col items-center gap-4 rounded-2xl border-2 border-blue-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#14d1a0]/35 dark:bg-[#1c1c1c] dark:hover:border-[#14d1a0]/50 dark:hover:shadow-[0_0_32px_-12px_rgba(20,209,160,0.3)]"
        >
          <span className="absolute right-4 top-4 rounded-full bg-[#14d1a0]/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#14d1a0]">
            Recommended
          </span>
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-[#14d1a0]/10 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/20 dark:group-hover:bg-[#14d1a0]/15">
            <BookOpen className="size-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-medium leading-[26px] text-[#1f1f1f] dark:text-[#e3e3e3]">
              Guide Me (AI Tutor)
            </h3>
            <p className="text-sm font-normal leading-6 text-slate-500 dark:text-[#e3e3e3]/55">
              Best for new users — structured learning path with file-by-file
              guidance.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleModePick(() => void openFolder("folder"))}
          disabled={!canOpenFolder}
          className="group relative flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all hover:border-slate-400 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.06] dark:bg-[#1c1c1c] dark:hover:border-[#cc7a31]/40 dark:hover:shadow-[0_0_32px_-12px_rgba(204,122,49,0.25)]"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-100 dark:bg-[#cc7a31]/10 dark:text-[#cc7a31] dark:border dark:border-[#cc7a31]/20 dark:group-hover:bg-[#cc7a31]/15">
            <FolderTree className="size-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-medium leading-[26px] text-[#1f1f1f] dark:text-[#e3e3e3]">
              Explore Myself
            </h3>
            <p className="text-sm font-normal leading-6 text-slate-500 dark:text-[#e3e3e3]/55">
              Open a folder and browse files manually, analyzing whatever you
              choose.
            </p>
          </div>
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            type="button"
            size="lg"
            className="h-11 rounded-full px-6 premium-btn-primary"
            disabled={!canOpenFolder}
            onClick={() => setShowFolderChoice(true)}
          >
            <FolderOpen className="size-4" strokeWidth={1.5} />
            Open Folder
          </Button>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className="h-11 rounded-full px-6 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
            onClick={() => handleModePick(switchToPaste)}
          >
            <ClipboardPaste className="size-4" strokeWidth={1.5} />
            Quick Paste
          </Button>
        </div>

        {showFolderChoice ? (
          <div className="mt-2 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#1c1c1c] p-4 text-left">
            <p className="text-sm font-medium text-[#e3e3e3]">
              Want a guided learning path?
            </p>
            <p className="mt-1 text-xs text-[#e3e3e3]/55">
              Guide Me is recommended for first-time users.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                className="rounded-full premium-btn-primary"
                disabled={!canOpenFolder}
                onClick={() => {
                  setShowFolderChoice(false);
                  handleModePick(() => void openFolder("guide"));
                }}
              >
                Guide Me
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="rounded-full dark:border-white/[0.08] dark:text-[#e3e3e3]"
                disabled={!canOpenFolder}
                onClick={() => {
                  setShowFolderChoice(false);
                  handleModePick(() => void openFolder("folder"));
                }}
              >
                Explore only
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="rounded-full text-[#e3e3e3]/60"
                onClick={() => setShowFolderChoice(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        {isFileSystemReady && !isSupported ? (
          <p className="max-w-md text-sm text-amber-700 dark:text-[#cc7a31]">
            Local folder access needs Chrome or Edge. Firefox and Safari are not
            supported yet.
          </p>
        ) : (
          <p className="text-sm text-slate-500 dark:text-[#e3e3e3]/45">
            Your files stay on your device until you analyze them.
          </p>
        )}
      </div>
    </div>
  );
}
