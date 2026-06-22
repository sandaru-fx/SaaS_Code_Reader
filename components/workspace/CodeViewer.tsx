"use client";

import { AlertCircle, ArrowLeft, FileCode2, ClipboardPaste } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/workspace/CodeBlock";
import { EmptyState } from "@/components/workspace/EmptyState";
import { FileBreadcrumbs } from "@/components/workspace/FileBreadcrumbs";
import { FileTypeIcon } from "@/components/workspace/FileTypeIcon";
import { CodeBlockSkeleton } from "@/components/workspace/LoadingSkeletons";
import { PastePanel } from "@/components/workspace/PastePanel";
import { getPasteSnippetFileName } from "@/components/workspace/paste-utils";
import { WorkspaceOnboarding } from "@/components/workspace/WorkspaceOnboarding";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function CodeViewer() {
  const {
    mode,
    fileTree,
    selectedFile,
    fileContent,
    fileLanguage,
    pastedCode,
    pastedLanguage,
    isReadingFile,
    fileError,
    dismissFileError,
    showOnboarding,
    dismissOnboarding,
    exitGuideLesson,
    isAnalyzing,
  } = useWorkspace();

  if (mode === "paste") {
    const lineCount =
      pastedCode.length > 0 ? pastedCode.split("\n").length : 0;
    const snippetName = getPasteSnippetFileName(pastedLanguage);

    return (
      <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex size-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50">
            <ClipboardPaste className="size-3.5 shrink-0 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <FileBreadcrumbs
              projectName="Quick Paste"
              filePath={snippetName}
            />
          </div>
          {lineCount > 0 ? (
            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          ) : null}
          <span className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white dark:bg-slate-100 dark:text-slate-950">
            {pastedLanguage}
          </span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
          <PastePanel />
        </div>
      </main>
    );
  }

  const lineCount =
    fileContent !== null && fileContent.length > 0
      ? fileContent.split("\n").length
      : 0;

  return (
    <main className="flex min-w-0 flex-1 flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900">
        {mode === "guide" && selectedFile ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 shrink-0 gap-1 rounded-full px-3 text-xs"
            onClick={exitGuideLesson}
          >
            <ArrowLeft className="size-3.5" />
            Overview
          </Button>
        ) : null}
        {selectedFile ? (
          <FileTypeIcon
            fileName={selectedFile.name}
            className="size-8 rounded-xl"
            iconClassName="size-3.5"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800" />
        )}
        <div className="min-w-0 flex-1">
          <FileBreadcrumbs
            projectName={fileTree?.name ?? null}
            filePath={selectedFile?.path ?? null}
          />
        </div>
        {lineCount > 0 ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        ) : null}
        {fileLanguage ? (
          <span className="shrink-0 rounded-full bg-slate-950 px-2.5 py-1 text-[10px] uppercase tracking-wide text-white dark:bg-slate-100 dark:text-slate-950">
            {fileLanguage}
          </span>
        ) : null}
        {mode === "guide" && (isReadingFile || isAnalyzing) ? (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            <span className="size-1.5 animate-pulse rounded-full bg-blue-500" />
            {isAnalyzing ? "Analyzing..." : "Loading..."}
          </span>
        ) : null}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-white/70 dark:bg-slate-900/70">
        {showOnboarding && !selectedFile && !fileTree ? (
          <WorkspaceOnboarding onDismiss={dismissOnboarding} />
        ) : !selectedFile ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={FileCode2}
              title="Select a file from the sidebar"
              description="File contents will appear here with syntax highlighting"
              iconClassName="size-10"
            />
          </div>
        ) : isReadingFile ? (
          <CodeBlockSkeleton message="Loading file content..." />
        ) : fileError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="size-8 text-destructive/70" />
            <p className="max-w-md text-sm text-destructive">{fileError}</p>
            <Button variant="outline" size="sm" onClick={dismissFileError}>
              Dismiss
            </Button>
          </div>
        ) : fileContent !== null && fileLanguage ? (
          <CodeBlock content={fileContent} language={fileLanguage} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={FileCode2}
              title={`${selectedFile.name} selected`}
              description="Unable to display file content"
              iconClassName="size-10"
            />
          </div>
        )}
      </div>
    </main>
  );
}
