"use client";

import Link from "next/link";
import { ClipboardPaste, FolderOpen, Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function TopBar() {
  const {
    mode,
    selectedFile,
    fileContent,
    isLoading,
    isReadingFile,
    isAnalyzing,
    isSupported,
    switchToFolder,
    switchToPaste,
    openFolder,
    analyzeFile,
  } = useWorkspace();

  const canAnalyze = Boolean(
    mode === "folder" &&
      selectedFile &&
      fileContent !== null &&
      !isReadingFile &&
      !isAnalyzing
  );

  return (
    <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <Link
        href="/"
        className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
      >
        CodeRider
      </Link>

      <Separator orientation="vertical" className="h-4" />

      <span className="text-xs text-muted-foreground">Workspace</span>

      <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
        <Button
          type="button"
          variant={mode === "folder" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={switchToFolder}
        >
          <FolderOpen className="size-3.5" />
          Folder
        </Button>
        <Button
          type="button"
          variant={mode === "paste" ? "default" : "ghost"}
          size="sm"
          className="h-7 px-2.5 text-xs"
          onClick={switchToPaste}
        >
          <ClipboardPaste className="size-3.5" />
          Quick Paste
        </Button>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {mode === "folder" ? (
          <Button
            variant="outline"
            size="sm"
            disabled={!isSupported || isLoading}
            onClick={openFolder}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <FolderOpen />}
            {isLoading ? "Opening..." : "Open Folder"}
          </Button>
        ) : null}
        <Button size="sm" disabled={!canAnalyze} onClick={analyzeFile}>
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {isAnalyzing ? "Analyzing..." : "Analyze"}
        </Button>
      </div>
    </header>
  );
}
