"use client";

import { BookOpen, Compass, FolderOpen, FolderTree } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function ModeSelection() {
  const { openFolder, isSupported, isFileSystemReady } = useWorkspace();
  const canOpenFolder = !isFileSystemReady || isSupported;

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center dark:bg-[#121212]">
      <div className="mb-10 max-w-md">
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
          onClick={() => void openFolder("guide")}
          disabled={!canOpenFolder}
          className="group relative flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[0.06] dark:bg-[#1c1c1c] dark:hover:border-[#14d1a0]/40 dark:hover:shadow-[0_0_32px_-12px_rgba(20,209,160,0.3)]"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-[#14d1a0]/10 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/20 dark:group-hover:bg-[#14d1a0]/15">
            <BookOpen className="size-6" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-medium leading-[26px] text-[#1f1f1f] dark:text-[#e3e3e3]">
              Guide Me (AI Tutor)
            </h3>
            <p className="text-sm font-normal leading-6 text-slate-500 dark:text-[#e3e3e3]/55">
              Open a folder and get a structured learning path with file-by-file guidance.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => void openFolder("folder")}
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
              Open a folder and browse files manually, analyzing whatever you choose.
            </p>
          </div>
        </button>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Button
          type="button"
          size="lg"
          className="h-11 rounded-full px-6 premium-btn-primary"
          disabled={!canOpenFolder}
          onClick={() => void openFolder()}
        >
          <FolderOpen className="size-4" strokeWidth={1.5} />
          Open Folder
        </Button>
        {isFileSystemReady && !isSupported ? (
          <p className="max-w-md text-sm text-amber-700 dark:text-[#cc7a31]">
            Local folder access needs Chrome or Edge. Firefox and Safari are not supported yet.
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
