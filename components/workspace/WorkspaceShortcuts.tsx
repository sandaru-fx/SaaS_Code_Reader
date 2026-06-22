"use client";

import { useEffect } from "react";

import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function WorkspaceShortcuts() {
  const { analyzeFile, canAnalyze, isAnalyzing } = useWorkspace();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isAnalyzeShortcut =
        (event.ctrlKey || event.metaKey) && event.key === "Enter";

      if (!isAnalyzeShortcut) {
        return;
      }

      if (!canAnalyze || isAnalyzing) {
        return;
      }

      event.preventDefault();
      void analyzeFile();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [analyzeFile, canAnalyze, isAnalyzing]);

  return null;
}
