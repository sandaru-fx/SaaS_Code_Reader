"use client";

import { AlertCircle, ClipboardPaste, Clock3, FolderTree } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/workspace/EmptyState";
import { FileTree } from "@/components/workspace/FileTree";
import { HistoryPanel } from "@/components/workspace/HistoryPanel";
import { FileTreeSkeleton } from "@/components/workspace/LoadingSkeletons";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

function SidebarTabs() {
  const { sidebarTab, setSidebarTab } = useWorkspace();

  return (
    <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1">
      <Button
        type="button"
        variant={sidebarTab === "explorer" ? "default" : "ghost"}
        size="sm"
        className="h-8 rounded-full px-3 text-xs"
        onClick={() => setSidebarTab("explorer")}
      >
        <FolderTree className="size-3.5" />
        Explorer
      </Button>
      <Button
        type="button"
        variant={sidebarTab === "history" ? "default" : "ghost"}
        size="sm"
        className="h-8 rounded-full px-3 text-xs"
        onClick={() => setSidebarTab("history")}
      >
        <Clock3 className="size-3.5" />
        History
      </Button>
    </div>
  );
}

export function Sidebar() {
  const {
    mode,
    sidebarTab,
    fileTree,
    selectedFile,
    folderSkippedCount,
    isLoading,
    error,
    isSupported,
    switchToFolder,
    selectFile,
    dismissError,
    historyItems,
    activeHistoryId,
    isHistoryLoading,
    isDeletingHistoryId,
    loadHistoryItem,
    deleteHistoryItem,
  } = useWorkspace();

  if (sidebarTab === "history") {
    return (
      <aside className="flex h-full min-h-0 w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="space-y-3 border-b border-slate-200 px-4 py-3">
          <SidebarTabs />
          <div>
            <p className="text-sm font-semibold text-slate-900">Saved analyses</p>
            <p className="text-[11px] text-slate-500">
              Reopen previous AI results anytime
            </p>
          </div>
        </div>

        <div className="min-h-0 flex-1">
          <HistoryPanel
            items={historyItems}
            activeId={activeHistoryId}
            isLoading={isHistoryLoading}
            isDeletingId={isDeletingHistoryId}
            onSelect={loadHistoryItem}
            onDelete={deleteHistoryItem}
          />
        </div>
      </aside>
    );
  }

  if (mode === "paste") {
    return (
      <aside className="flex h-full min-h-0 w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="space-y-3 border-b border-slate-200 px-4 py-3">
          <SidebarTabs />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-slate-100">
              <ClipboardPaste className="size-4 shrink-0 text-slate-600" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                Quick Paste
              </p>
              <p className="text-[11px] text-slate-500">Snippet workspace</p>
            </div>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <EmptyState
            icon={ClipboardPaste}
            title="Paste mode active"
            description="Type or paste a code snippet in the editor, pick a language, then analyze it from the top bar."
            className="min-h-[280px]"
          />
          <div className="px-4 pb-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={switchToFolder}
            >
              <FolderTree className="size-3.5" />
              Switch to Folder mode
            </Button>
          </div>
        </ScrollArea>
      </aside>
    );
  }

  const headerLabel = fileTree ? fileTree.name : "File Explorer";

  return (
    <aside className="flex h-full min-h-0 w-[280px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="space-y-3 border-b border-slate-200 px-4 py-3">
        <SidebarTabs />
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-slate-100">
            <FolderTree className="size-4 shrink-0 text-slate-600" />
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold text-slate-900"
              title={headerLabel}
            >
              {headerLabel}
            </p>
            <p className="text-[11px] text-slate-500">Project explorer</p>
          </div>
        </div>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        {!isSupported ? (
          <EmptyState
            icon={AlertCircle}
            title="Browser not supported"
            description="Local folder access requires Chrome or Edge."
            className="min-h-[280px]"
          />
        ) : isLoading ? (
          <FileTreeSkeleton />
        ) : error ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 p-6 text-center">
            <AlertCircle className="size-8 text-destructive/70" />
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" size="sm" onClick={dismissError}>
              Dismiss
            </Button>
          </div>
        ) : fileTree ? (
          <div className="min-h-0">
            {folderSkippedCount > 0 ? (
              <p className="border-b border-slate-200 bg-amber-50 px-4 py-2 text-[11px] leading-4 text-amber-700">
                Skipped {folderSkippedCount.toLocaleString()} entries such as
                node_modules, .git, and binary files.
              </p>
            ) : null}
            <FileTree
              tree={fileTree}
              selectedPath={selectedFile?.path ?? null}
              onSelectFile={selectFile}
            />
          </div>
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
