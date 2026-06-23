"use client";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import {
  ClipboardPaste,
  FileCode2,
  FolderOpen,
  GitBranch,
  Loader2,
  Maximize2,
  MessageSquare,
  Minimize2,
  Moon,
  Sparkles,
  Sun,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UsageBadge } from "@/components/workspace/UsageBadge";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";

type TopBarProps = {
  onToggleTheme: () => void;
  isDark: boolean;
};

export function TopBar({ onToggleTheme, isDark }: TopBarProps) {
  const {
    mode,
    isLoading,
    isAnalyzing,
    isReadingFile,
    isSupported,
    isFileSystemReady,
    canAnalyze,
    selectedFile,
    fileContent,
    pastedCode,
    analysisResult,
    activeAnalyzeLabel,
    isFocusMode,
    enterFocusMode,
    exitFocusMode,
    switchToFolder,
    switchToPaste,
    switchToGuide,
    openFolder,
    analyzeFile,
    showToast,
    isChatOpen,
    toggleChat,
  } = useWorkspace();

  const analyzeLabel = isAnalyzing
    ? "Analyzing..."
    : isReadingFile
      ? "Loading file..."
      : !canAnalyze && mode === "paste"
        ? "Paste code first"
        : !canAnalyze && mode !== "paste" && !selectedFile
          ? "Select a file"
          : analysisResult
            ? "Re-analyze"
            : "Analyze";

  const canOpenFolder = !isFileSystemReady || isSupported;

  const handleAnalyzeClick = () => {
    if (isAnalyzing) {
      return;
    }

    if (!canAnalyze) {
      const description = isReadingFile || (selectedFile && fileContent === null)
        ? "Wait for the file to finish loading."
        : mode === "paste"
          ? "Paste a code snippet in the editor first."
          : "Click a file in the left sidebar, then analyze it.";

      showToast({
        title: "Cannot analyze yet",
        description,
      });
      return;
    }

    void analyzeFile();
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur dark:border-white/[0.06] dark:bg-[#121212]/95">
      <Link
        href="/"
        className="flex items-center gap-2.5 text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm premium-btn-primary">
          <GitBranch className="size-4" strokeWidth={1.75} />
        </span>
        <span className="dark:text-[#e3e3e3]">CodeRider</span>
      </Link>

      <Separator orientation="vertical" className="h-5 dark:bg-white/10" />

      <div className="hidden min-w-0 flex-col sm:flex">
        <span className="text-xs font-medium text-slate-700 dark:text-[#e3e3e3]/85">
          Workspace
        </span>
        <span className="truncate text-[11px] text-slate-500 dark:text-[#e3e3e3]/45">
          Local code explorer and AI diagrammer
        </span>
      </div>

      <div className="flex items-center rounded-full border border-slate-200 bg-slate-100 p-1 dark:border-white/[0.06] dark:bg-white/[0.03]">
        <Button
          type="button"
          variant={mode === "guide" ? "default" : "ghost"}
          size="sm"
          className={`h-8 rounded-full px-3 text-xs ${
            mode === "guide" ? "premium-btn-primary" : "dark:text-[#e3e3e3]/70"
          }`}
          onClick={switchToGuide}
        >
          Guide Me
        </Button>
        <Button
          type="button"
          variant={mode === "folder" ? "default" : "ghost"}
          size="sm"
          className={`h-8 rounded-full px-3 text-xs ${
            mode === "folder" ? "premium-btn-primary" : "dark:text-[#e3e3e3]/70"
          }`}
          onClick={switchToFolder}
        >
          <FolderOpen className="size-3.5" strokeWidth={1.5} />
          Explore
        </Button>
        <Button
          type="button"
          variant={mode === "paste" ? "default" : "ghost"}
          size="sm"
          className={`h-8 rounded-full px-3 text-xs ${
            mode === "paste" ? "premium-btn-primary" : "dark:text-[#e3e3e3]/70"
          }`}
          onClick={switchToPaste}
        >
          <ClipboardPaste className="size-3.5" strokeWidth={1.5} />
          Paste
        </Button>
      </div>

      {activeAnalyzeLabel ? (
        <div className="hidden min-w-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 md:flex dark:border-white/[0.06] dark:bg-white/[0.03]">
          <FileCode2 className="size-3.5 shrink-0 text-slate-500 dark:text-[#e3e3e3]/50" strokeWidth={1.5} />
          <span
            className="truncate text-xs font-medium text-slate-700 dark:text-[#e3e3e3]/85"
            title={activeAnalyzeLabel}
          >
            {activeAnalyzeLabel}
          </span>
        </div>
      ) : null}

      <div className="ml-auto flex items-center gap-2">
        <UsageBadge />
        <span className="hidden text-[11px] text-slate-400 lg:inline dark:text-[#e3e3e3]/40">
          Ctrl+Enter to analyze
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-9 w-9 rounded-full border-slate-200 bg-white p-0 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
          onClick={onToggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="size-4" strokeWidth={1.5} /> : <Moon className="size-4" strokeWidth={1.5} />}
        </Button>
        <Button
          type="button"
          variant={isChatOpen ? "default" : "outline"}
          size="sm"
          className={`h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#e3e3e3] ${
            isChatOpen ? "premium-btn-primary" : ""
          }`}
          onClick={toggleChat}
          aria-pressed={isChatOpen}
          aria-label={isChatOpen ? "Close AI chat" : "Open AI chat"}
        >
          <MessageSquare className="size-3.5" strokeWidth={1.5} />
          <span className="hidden sm:inline">Chat</span>
        </Button>
        {analysisResult ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="hidden h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm sm:inline-flex dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
            onClick={isFocusMode ? exitFocusMode : enterFocusMode}
          >
            {isFocusMode ? (
              <>
                <Minimize2 className="size-3.5" strokeWidth={1.5} />
                Exit focus
              </>
            ) : (
              <>
                <Maximize2 className="size-3.5" strokeWidth={1.5} />
                Focus diagram
              </>
            )}
          </Button>
        ) : null}
        {mode === "guide" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
            disabled={!canOpenFolder || isLoading}
            onClick={() => void openFolder()}
            suppressHydrationWarning
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <FolderOpen strokeWidth={1.5} />}
            {isLoading ? "Opening..." : "Open Folder"}
          </Button>
        ) : null}
        {mode === "folder" ? (
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
            disabled={!canOpenFolder || isLoading}
            onClick={() => void openFolder()}
            suppressHydrationWarning
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <FolderOpen strokeWidth={1.5} />}
            {isLoading ? "Opening..." : "Open Folder"}
          </Button>
        ) : null}
        <Button
          size="sm"
          className="h-9 rounded-full px-4 shadow-sm premium-btn-primary"
          disabled={isAnalyzing || isReadingFile}
          onClick={handleAnalyzeClick}
          title={
            canAnalyze
              ? "Analyze the selected file"
              : "Select a file from the sidebar first"
          }
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles strokeWidth={1.75} />}
          {analyzeLabel}
        </Button>
        {isClerkPublishableKeySet() ? <UserButton /> : null}
      </div>
    </header>
  );
}
