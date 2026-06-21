"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  ClipboardPaste,
  FileCode2,
  FolderOpen,
  GitBranch,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";

export function TopBar() {
  const {
    mode,
    isLoading,
    isAnalyzing,
    isSupported,
    canAnalyze,
    analysisResult,
    activeAnalyzeLabel,
    switchToFolder,
    switchToPaste,
    openFolder,
    analyzeFile,
  } = useWorkspace();

  const analyzeLabel = isAnalyzing
    ? "Analyzing..."
    : analysisResult
      ? "Re-analyze"
      : "Analyze";

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur">
      <Link
        href="/"
        className="flex items-center gap-2 text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
          <GitBranch className="size-4" />
        </span>
        <span>CodeRider</span>
      </Link>

      <Separator orientation="vertical" className="h-5" />

      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="text-xs font-medium text-slate-700">Workspace</span>
        <span className="truncate text-[11px] text-slate-500">
          Local code explorer and AI diagrammer
        </span>
      </div>

      <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-1">
        <Button
          type="button"
          variant={mode === "folder" ? "default" : "ghost"}
          size="sm"
          className="h-8 rounded-full px-3 text-xs"
          onClick={switchToFolder}
        >
          <FolderOpen className="size-3.5" />
          Folder
        </Button>
        <Button
          type="button"
          variant={mode === "paste" ? "default" : "ghost"}
          size="sm"
          className="h-8 rounded-full px-3 text-xs"
          onClick={switchToPaste}
        >
          <ClipboardPaste className="size-3.5" />
          Quick Paste
        </Button>
      </div>

      {activeAnalyzeLabel ? (
        <div className="hidden min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex">
          <FileCode2 className="size-3.5 shrink-0 text-slate-500" />
          <span
            className="truncate text-xs font-medium text-slate-700"
            title={activeAnalyzeLabel}
          >
            {activeAnalyzeLabel}
          </span>
        </div>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        {mode === "folder" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm"
            disabled={!isSupported || isLoading}
            onClick={openFolder}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <FolderOpen />}
            {isLoading ? "Opening..." : "Open Folder"}
          </Button>
        ) : null}
        <Button
          size="sm"
          className="h-9 rounded-full px-4 shadow-sm"
          disabled={!canAnalyze}
          onClick={analyzeFile}
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {analyzeLabel}
        </Button>
        {isClerkPublishableKeySet() ? <UserButton /> : null}
      </div>
    </header>
  );
}
