"use client";

import { useSearchParams } from "next/navigation";

import { AiPanel } from "@/components/workspace/AiPanel";
import { CodeViewer } from "@/components/workspace/CodeViewer";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import type { WorkspaceMode } from "@/components/workspace/types";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";

function getInitialMode(modeParam: string | null): WorkspaceMode {
  return modeParam === "paste" ? "paste" : "folder";
}

export function WorkspaceLayout() {
  const searchParams = useSearchParams();
  const initialMode = getInitialMode(searchParams.get("mode"));

  return (
    <WorkspaceProvider initialMode={initialMode}>
      <div className="flex h-screen flex-col overflow-hidden">
        <TopBar />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <Sidebar />
          <CodeViewer />
          <AiPanel />
        </div>
      </div>
    </WorkspaceProvider>
  );
}
