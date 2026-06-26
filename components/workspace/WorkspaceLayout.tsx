"use client";

import { useSearchParams } from "next/navigation";

import { TopBar } from "@/components/workspace/TopBar";
import { WorkspacePanels } from "@/components/workspace/WorkspacePanels";
import { ProductTour } from "@/components/workspace/ProductTour";
import type { WorkspaceMode } from "@/components/workspace/types";
import { WorkspaceErrorBoundary } from "@/components/workspace/WorkspaceErrorBoundary";
import { AnalysisToast } from "@/components/workspace/AnalysisToast";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";
import { WorkspaceShortcuts } from "@/components/workspace/WorkspaceShortcuts";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { useWorkspaceTheme } from "@/components/workspace/useWorkspaceTheme";
import { cn } from "@/lib/utils";

function getInitialMode(modeParam: string | null): WorkspaceMode {
  return modeParam === "paste" ? "paste" : "folder";
}

function WorkspaceShell() {
  const { isDark, toggleTheme } = useWorkspaceTheme();
  const { isTourActive, tourSteps, completeTour, skipTour } = useWorkspace();

  return (
    <div
      suppressHydrationWarning
      className={cn(
        "flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#f8fafc,#eef2f7)] p-3 dark:bg-[radial-gradient(ellipse_at_top_left,rgba(20,209,160,0.06),transparent_40%),radial-gradient(ellipse_at_bottom_right,rgba(204,122,49,0.04),transparent_40%),#0a0a0a]",
        isDark && "dark"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white bg-white/90 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/[0.06] dark:bg-[#121212]/95 dark:shadow-black/40">
        <TopBar onToggleTheme={toggleTheme} isDark={isDark} />
        <WorkspacePanels />
      </div>
      <AnalysisToast />
      <WorkspaceShortcuts />
      <ProductTour
        steps={tourSteps}
        isActive={isTourActive}
        onComplete={completeTour}
        onSkip={skipTour}
      />
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
