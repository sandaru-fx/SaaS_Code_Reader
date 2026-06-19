"use client";

import { AlertCircle, FolderTree, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/workspace/EmptyState";
import { FileTree } from "@/components/workspace/FileTree";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function Sidebar() {
  const {
    fileTree,
    selectedFile,
    isLoading,
    error,
    isSupported,
    selectFile,
    dismissError,
  } = useWorkspace();

  const headerLabel = fileTree ? fileTree.name : "File Explorer";

  return (
    <aside className="flex h-full min-h-0 w-[250px] shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-10 shrink-0 items-center gap-2 px-3">
        <FolderTree className="size-4 shrink-0 text-muted-foreground" />
        <span
          className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground"
          title={headerLabel}
        >
          {headerLabel}
        </span>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        {!isSupported ? (
          <EmptyState
            icon={AlertCircle}
            title="Browser not supported"
            description="Local folder access requires Chrome or Edge."
            className="min-h-[280px]"
          />
        ) : isLoading ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-2 p-6 text-center">
            <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
            <p className="text-sm text-muted-foreground">Reading folder...</p>
          </div>
        ) : error ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="size-8 text-destructive/70" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={dismissError}>
              Dismiss
            </Button>
          </div>
        ) : fileTree ? (
          <FileTree
            tree={fileTree}
            selectedPath={selectedFile?.path ?? null}
            onSelectFile={selectFile}
          />
        ) : (
          <EmptyState
            icon={FolderTree}
            title="No folder opened yet"
            description='Use "Open Folder" to load a local project'
            className="min-h-[280px]"
          />
        )}
      </ScrollArea>
    </aside>
  );
}
