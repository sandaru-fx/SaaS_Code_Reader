import type { WorkspaceMode } from "@/components/workspace/types";

export type TourStep = {
  id: string;
  target: string;
  title: string;
  description: string;
};

export const FOLDER_TOUR_STEPS: TourStep[] = [
  {
    id: "explorer",
    target: "sidebar-explorer",
    title: "Your project files",
    description: "Browse folders and click any file to load it in the editor.",
  },
  {
    id: "editor",
    target: "code-editor",
    title: "Code viewer",
    description: "Selected file contents appear here with syntax highlighting.",
  },
  {
    id: "analyze",
    target: "analyze-button",
    title: "Analyze with AI",
    description:
      "Hit Analyze (or press Ctrl+Enter) to generate a flowchart and explanation.",
  },
  {
    id: "ai-panel",
    target: "ai-panel-tabs",
    title: "Diagram and explanation",
    description: "Switch between the Mermaid flowchart and plain-English walkthrough.",
  },
  {
    id: "history",
    target: "sidebar-history",
    title: "Saved analyses",
    description: "Past results are stored here so you can reopen them anytime.",
  },
];

export const GUIDE_TOUR_STEPS: TourStep[] = [
  {
    id: "learning-path",
    target: "guide-learning-path",
    title: "Your learning path",
    description:
      "AI built a step-by-step curriculum for this project. Follow modules in order.",
  },
  {
    id: "start-module",
    target: "guide-start-module",
    title: "Start a lesson",
    description: "Click Start Module or any file to auto-analyze and learn.",
  },
  {
    id: "ai-results",
    target: "ai-panel-tabs",
    title: "See the results",
    description: "View the flowchart and explanation, then ask follow-ups in Chat.",
  },
];

export function getTourStepsForMode(mode: WorkspaceMode): TourStep[] {
  return mode === "guide" ? GUIDE_TOUR_STEPS : FOLDER_TOUR_STEPS;
}
