"use client";

import { ModeSelection } from "@/components/workspace/ModeSelection";
import { AiPanel } from "@/components/workspace/AiPanel";
import { CodeViewer } from "@/components/workspace/CodeViewer";
import { GuidePanel } from "@/components/workspace/GuidePanel";
import { ResizeHandle } from "@/components/workspace/ResizeHandle";
import { Sidebar } from "@/components/workspace/Sidebar";
import { usePanelLayout } from "@/components/workspace/usePanelLayout";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { AI_PANEL_MAX_WIDTH } from "@/lib/workspace/panel-layout";

export function WorkspacePanels() {
  const { isFocusMode, mode, fileTree } = useWorkspace();
  const { sidebarWidth, aiPanelWidth, resizeSidebar, resizeAiPanel } =
    usePanelLayout();

  if (mode === "folder" && !fileTree) {
    return <ModeSelection />;
  }

  if (isFocusMode) {
    const focusAiWidth = Math.max(aiPanelWidth, AI_PANEL_MAX_WIDTH);

    return (
      <div className="flex min-h-0 flex-1 overflow-hidden bg-slate-950/5">
        <div className="flex min-h-0 min-w-0 flex-[0.95] flex-col overflow-hidden border-r border-slate-200 bg-slate-50">
          <CodeViewer />
        </div>

        <ResizeHandle onResize={resizeAiPanel} />

        <div
          className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden bg-white shadow-xl shadow-slate-950/5"
          style={{ width: focusAiWidth }}
        >
          <AiPanel />
        </div>
      </div>
    );
  }

  if (mode === "guide") {
    return (
      <div className="flex min-h-0 flex-1 overflow-hidden bg-slate-50/70">
        <div
          className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden"
          style={{ width: sidebarWidth }}
        >
          <Sidebar />
        </div>

        <ResizeHandle onResize={resizeSidebar} />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <GuidePanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden bg-slate-50/70">
      <div
        className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden"
        style={{ width: sidebarWidth }}
      >
        <Sidebar />
      </div>

      <ResizeHandle onResize={resizeSidebar} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <CodeViewer />
      </div>

      <ResizeHandle onResize={resizeAiPanel} />

      <div
        className="flex h-full min-h-0 shrink-0 flex-col overflow-hidden"
        style={{ width: aiPanelWidth }}
      >
        <AiPanel />
      </div>
    </div>
  );
}
