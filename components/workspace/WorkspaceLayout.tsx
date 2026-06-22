"use client";

import { useSearchParams } from "next/navigation";

import { TopBar } from "@/components/workspace/TopBar";
import { WorkspacePanels } from "@/components/workspace/WorkspacePanels";
import type { WorkspaceMode } from "@/components/workspace/types";
import { WorkspaceErrorBoundary } from "@/components/workspace/WorkspaceErrorBoundary";
import { AnalysisToast } from "@/components/workspace/AnalysisToast";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceShortcuts } from "@/components/workspace/WorkspaceShortcuts";
import { useWorkspaceTheme } from "@/components/workspace/useWorkspaceTheme";
import { cn } from "@/lib/utils";

function getInitialMode(modeParam: string | null): WorkspaceMode {
  return modeParam === "paste" ? "paste" : "folder";
}

function WorkspaceShell() {
  const { isDark, toggleTheme } = useWorkspaceTheme();

  return (
    <div
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#f8fafc,#eef2f7)] p-3 dark:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.08),transparent_30%),linear-gradient(180deg,#0f172a,#020617)]",
        isDark && "dark"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white bg-white/90 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <TopBar onToggleTheme={toggleTheme} isDark={isDark} />
        <WorkspacePanels />
      </div>
      <AnalysisToast />
      <WorkspaceShortcuts />
    </div>
  );
}

export function WorkspaceLayout() {
  const searchParams = useSearchParams();
  const initialMode = getInitialMode(searchParams.get("mode"));

  return (
    <WorkspaceProvider initialMode={initialMode}>
      <WorkspaceErrorBoundary>
        <WorkspaceShell />
      </WorkspaceErrorBoundary>
    </WorkspaceProvider>
  );
}
