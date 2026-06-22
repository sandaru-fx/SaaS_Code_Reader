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
    <div className="grid grid-cols-2 gap-1 rounded-full bg-slate-100 p-1 dark:bg-white/[0.03] dark:border dark:border-white/[0.06]">
      <Button
        type="button"
        variant={sidebarTab === "explorer" ? "default" : "ghost"}
        size="sm"
        className={`h-8 rounded-full px-3 text-xs ${
          sidebarTab === "explorer" ? "premium-btn-primary" : "dark:text-[#e3e3e3]/65"
        }`}
        onClick={() => setSidebarTab("explorer")}
      >
        <FolderTree className="size-3.5" strokeWidth={1.5} />
        Explorer
      </Button>
      <Button
        type="button"
        variant={sidebarTab === "history" ? "default" : "ghost"}
        size="sm"
        className={`h-8 rounded-full px-3 text-xs ${
          sidebarTab === "history" ? "premium-btn-primary" : "dark:text-[#e3e3e3]/65"
        }`}
        onClick={() => setSidebarTab("history")}
      >
        <Clock3 className="size-3.5" strokeWidth={1.5} />
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
      <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white dark:border-white/[0.06] dark:bg-[#121212]">
        <div className="space-y-3 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
          <SidebarTabs />
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]">Saved analyses</p>
            <p className="text-[11px] text-slate-500 dark:text-[#e3e3e3]/45">
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
      <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white dark:border-white/[0.06] dark:bg-[#121212]">
        <div className="space-y-3 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
          <SidebarTabs />
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04] dark:border dark:border-white/[0.06]">
              <ClipboardPaste className="size-4 shrink-0 text-slate-600 dark:text-[#e3e3e3]/70" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]">
                Quick Paste
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#e3e3e3]/45">Snippet workspace</p>
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
          <div className="px-5 pb-5">
            <Button
              variant="outline"
              size="sm"
              className="w-full dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
              onClick={switchToFolder}
            >
              <FolderTree className="size-3.5" strokeWidth={1.5} />
              Switch to Folder mode
            </Button>
          </div>
        </ScrollArea>
      </aside>
    );
  }

  const headerLabel = fileTree ? fileTree.name : "File Explorer";

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-slate-200 bg-white dark:border-white/[0.06] dark:bg-[#121212]">
      <div className="space-y-3 border-b border-slate-200 px-5 py-4 dark:border-white/[0.06]">
        <SidebarTabs />
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04] dark:border dark:border-white/[0.06]">
            <FolderTree className="size-4 shrink-0 text-slate-600 premium-accent" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]"
              title={headerLabel}
            >
              {headerLabel}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-[#e3e3e3]/45">Project explorer</p>
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
              <p className="border-b border-slate-200 bg-amber-50 px-5 py-2 text-[11px] leading-4 text-amber-700 dark:border-white/[0.06] dark:bg-[#cc7a31]/10 dark:text-[#cc7a31]">
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
