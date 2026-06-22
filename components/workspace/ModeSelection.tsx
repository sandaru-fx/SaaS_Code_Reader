"use client";

import { BookOpen, Compass, FolderTree } from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function ModeSelection() {
  const { switchToFolder, switchToGuide } = useWorkspace();

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 max-w-md">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <Compass className="size-8" />
        </div>
        <h1 className="text-2xl font-medium tracking-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
          How do you want to learn?
        </h1>
        <p className="mt-2 text-base font-normal leading-6 text-slate-500 dark:text-slate-400">
          Choose a mode to start exploring your codebase.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        <button
          onClick={switchToGuide}
          className="group relative flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:group-hover:bg-blue-900/50">
            <BookOpen className="size-6" />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-medium leading-[26px] text-[#1f1f1f] dark:text-[#e3e3e3]">
              Guide Me (AI Tutor)
            </h3>
            <p className="text-sm font-normal leading-5 text-slate-500 dark:text-slate-400">
              Get a structured learning path. The AI will analyze the project and guide you file by file.
            </p>
          </div>
        </button>

        <button
          onClick={switchToFolder}
          className="group relative flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all hover:border-slate-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-600"
        >
          <div className="flex size-12 items-center justify-center rounded-xl bg-slate-50 text-slate-600 transition-colors group-hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-slate-700">
            <FolderTree className="size-6" />
          </div>
          <div>
            <h3 className="mb-1 text-lg font-medium leading-[26px] text-[#1f1f1f] dark:text-[#e3e3e3]">
              Explore Myself
            </h3>
            <p className="text-sm font-normal leading-5 text-slate-500 dark:text-slate-400">
              Browse the file tree manually and analyze specific files whenever you want.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
