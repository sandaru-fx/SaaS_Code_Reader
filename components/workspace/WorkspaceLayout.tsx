"use client";

import { useSearchParams } from "next/navigation";

import { AiPanel } from "@/components/workspace/AiPanel";
import { CodeViewer } from "@/components/workspace/CodeViewer";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import type { WorkspaceMode } from "@/components/workspace/types";
import { WorkspaceErrorBoundary } from "@/components/workspace/WorkspaceErrorBoundary";
import { AnalysisToast } from "@/components/workspace/AnalysisToast";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";

function getInitialMode(modeParam: string | null): WorkspaceMode {
  return modeParam === "paste" ? "paste" : "folder";
}

export function WorkspaceLayout() {
  const searchParams = useSearchParams();
  const initialMode = getInitialMode(searchParams.get("mode"));

  return (
    <WorkspaceProvider initialMode={initialMode}>
      <WorkspaceErrorBoundary>
        <div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#f8fafc,#eef2f7)] p-3">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.5rem] border border-white bg-white/90 shadow-2xl shadow-slate-950/10 backdrop-blur">
            <TopBar />
            <div className="flex min-h-0 flex-1 overflow-hidden bg-slate-50/70">
              <Sidebar />
              <CodeViewer />
              <AiPanel />
            </div>
          </div>
          <AnalysisToast />
        </div>
      </WorkspaceErrorBoundary>
    </WorkspaceProvider>
  );
}
