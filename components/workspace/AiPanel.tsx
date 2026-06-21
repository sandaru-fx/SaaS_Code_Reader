"use client";

import { AlertCircle, GitBranch, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/workspace/EmptyState";
import {
  DiagramPanelSkeleton,
  ExplanationPanelSkeleton,
} from "@/components/workspace/LoadingSkeletons";
import { MarkdownExplanation } from "@/components/workspace/MarkdownExplanation";
import { MermaidDiagram } from "@/components/workspace/MermaidDiagram";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

function AnalysisErrorState({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 p-6 text-center">
      <AlertCircle className="size-8 text-destructive/70" />
      <p className="max-w-xs text-sm text-destructive">{message}</p>
      <Button variant="outline" size="sm" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  );
}

function AnalysisLoadingState({ variant }: { variant: "diagram" | "explanation" }) {
  if (variant === "diagram") {
    return (
      <div className="space-y-4 p-5">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Generating flowchart
          </p>
          <p className="text-xs text-slate-500">
            Step 1 of 2 — mapping architecture from your code
          </p>
        </div>
        <DiagramPanelSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          Writing explanation
        </p>
        <p className="text-xs text-slate-500">
          Step 2 of 2 — summarizing logic and runtime flow
        </p>
      </div>
      <ExplanationPanelSkeleton />
    </div>
  );
}

export function AiPanel() {
  const {
    analysisResult,
    isAnalyzing,
    analysisError,
    aiPanelTab,
    setAiPanelTab,
    dismissAnalysisError,
  } = useWorkspace();

  return (
    <aside className="flex h-full min-h-0 w-[min(100%,520px)] min-w-[420px] shrink-0 flex-col border-l border-slate-200 bg-white">
      <Tabs
        value={aiPanelTab}
        onValueChange={(value) => setAiPanelTab(value as "diagram" | "explanation")}
        className="flex h-full min-h-0 flex-col gap-0"
      >
        <div className="flex h-14 shrink-0 items-center bg-white px-4">
          <TabsList className="h-9 w-full rounded-full bg-slate-100 p-1">
            <TabsTrigger value="diagram" className="flex-1">
              <GitBranch className="size-3.5" />
              Diagram
            </TabsTrigger>
            <TabsTrigger value="explanation" className="flex-1">
              <Sparkles className="size-3.5" />
              Explanation
            </TabsTrigger>
          </TabsList>
        </div>

        <Separator />

        <TabsContent
          value="diagram"
          className="min-h-0 flex-1 overflow-hidden data-[orientation=horizontal]:mt-0"
        >
          <ScrollArea className="h-full">
            {isAnalyzing ? (
              <AnalysisLoadingState variant="diagram" />
            ) : analysisError ? (
              <AnalysisErrorState
                message={analysisError}
                onDismiss={dismissAnalysisError}
              />
            ) : analysisResult ? (
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Architecture Flowchart
                  </p>
                  <p className="text-xs text-slate-500">
                    Zoom or open fullscreen to inspect the diagram
                  </p>
                </div>
                <MermaidDiagram mermaid={analysisResult.mermaid} />
              </div>
            ) : (
              <EmptyState
                icon={GitBranch}
                title="Analyze a file to generate flowchart"
                description="Your architecture diagram will render here with zoom and fullscreen controls"
                className="min-h-[320px]"
              />
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent
          value="explanation"
          className="min-h-0 flex-1 overflow-hidden data-[orientation=horizontal]:mt-0"
        >
          <ScrollArea className="h-full">
            {isAnalyzing ? (
              <AnalysisLoadingState variant="explanation" />
            ) : analysisError ? (
              <AnalysisErrorState
                message={analysisError}
                onDismiss={dismissAnalysisError}
              />
            ) : analysisResult ? (
              <div className="space-y-4 p-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    AI Explanation
                  </p>
                  <p className="text-xs text-slate-500">
                    Step-by-step walkthrough of the logic
                  </p>
                </div>
                <MarkdownExplanation content={analysisResult.explanation} />
              </div>
            ) : (
              <EmptyState
                icon={Sparkles}
                title="AI explanation will appear here"
                description="Runtime logic and step-by-step breakdown after analysis"
                className="min-h-[320px]"
              />
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
