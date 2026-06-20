"use client";

import { AlertCircle, ClipboardPaste, FileCode2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/workspace/CodeBlock";
import { EmptyState } from "@/components/workspace/EmptyState";
import { CodeBlockSkeleton } from "@/components/workspace/LoadingSkeletons";
import { PastePanel } from "@/components/workspace/PastePanel";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function CodeViewer() {
  const {
    mode,
    selectedFile,
    fileContent,
    fileLanguage,
    pastedCode,
    pastedLanguage,
    isReadingFile,
    fileError,
    dismissFileError,
  } = useWorkspace();

  if (mode === "paste") {
    const lineCount =
      pastedCode.length > 0 ? pastedCode.split("\n").length : 0;

    return (
      <main className="flex min-w-0 flex-1 flex-col bg-muted/20">
        <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
          <ClipboardPaste className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
            Quick Paste
          </span>
          {lineCount > 0 ? (
            <span className="shrink-0 text-[10px] text-muted-foreground">
              {lineCount} {lineCount === 1 ? "line" : "lines"}
            </span>
          ) : null}
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
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
    <main className="flex min-w-0 flex-1 flex-col bg-muted/20">
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-background px-4">
        <span
          className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground"
          title={selectedFile?.path}
        >
          {selectedFile ? selectedFile.path : "No file selected"}
        </span>
        {lineCount > 0 ? (
          <span className="shrink-0 text-[10px] text-muted-foreground">
            {lineCount} {lineCount === 1 ? "line" : "lines"}
          </span>
        ) : null}
        {fileLanguage ? (
          <span className="shrink-0 rounded-md bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
            {fileLanguage}
          </span>
        ) : null}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background/80">
        {!selectedFile ? (
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
