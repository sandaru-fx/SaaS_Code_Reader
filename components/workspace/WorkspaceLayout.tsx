"use client";

import { AiPanel } from "@/components/workspace/AiPanel";
import { CodeViewer } from "@/components/workspace/CodeViewer";
import { Sidebar } from "@/components/workspace/Sidebar";
import { TopBar } from "@/components/workspace/TopBar";
import { WorkspaceProvider } from "@/components/workspace/WorkspaceProvider";

export function WorkspaceLayout() {
  return (
    <WorkspaceProvider>
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
