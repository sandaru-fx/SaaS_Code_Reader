"use client";

import { useCallback, useState } from "react";

import {
  AI_PANEL_DEFAULT_WIDTH,
  AI_PANEL_WIDTH_KEY,
  clampAiPanelWidth,
  clampSidebarWidth,
  readStoredPanelWidth,
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_WIDTH_KEY,
  storePanelWidth,
} from "@/lib/workspace/panel-layout";

export function usePanelLayout() {
  const [sidebarWidth, setSidebarWidth] = useState(() =>
    readStoredPanelWidth(
      SIDEBAR_WIDTH_KEY,
      SIDEBAR_DEFAULT_WIDTH,
      clampSidebarWidth
    )
  );
  const [aiPanelWidth, setAiPanelWidth] = useState(() =>
    readStoredPanelWidth(
      AI_PANEL_WIDTH_KEY,
      AI_PANEL_DEFAULT_WIDTH,
      clampAiPanelWidth
    )
  );

  const resizeSidebar = useCallback((delta: number) => {
    setSidebarWidth((current) => {
      const next = clampSidebarWidth(current + delta);
      storePanelWidth(SIDEBAR_WIDTH_KEY, next);
      return next;
    });
  }, []);

  const resizeAiPanel = useCallback((delta: number) => {
    setAiPanelWidth((current) => {
      const next = clampAiPanelWidth(current - delta);
      storePanelWidth(AI_PANEL_WIDTH_KEY, next);
      return next;
    });
  }, []);

  return {
    sidebarWidth,
    aiPanelWidth,
    resizeSidebar,
    resizeAiPanel,
  };
}
