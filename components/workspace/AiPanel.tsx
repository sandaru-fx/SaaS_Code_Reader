"use client";

import { AlertCircle, GitBranch, Sparkles, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/workspace/CopyButton";
import { EmptyState } from "@/components/workspace/EmptyState";
import {
  DiagramPanelSkeleton,
  ExplanationPanelSkeleton,
} from "@/components/workspace/LoadingSkeletons";
import { MarkdownExplanation } from "@/components/workspace/MarkdownExplanation";
import { MermaidDiagram } from "@/components/workspace/MermaidDiagram";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { downloadTextFile } from "@/lib/workspace/download-file";

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
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]">
            Generating flowchart
          </p>
          <p className="text-xs text-slate-500 dark:text-[#e3e3e3]/50">
            Step 1 of 2 — mapping architecture from your code
          </p>
        </div>
        <DiagramPanelSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]">
          Writing explanation
        </p>
        <p className="text-xs text-slate-500 dark:text-[#e3e3e3]/50">
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
    isFocusMode,
    dismissAnalysisError,
    openChat,
  } = useWorkspace();

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-l border-slate-200 bg-white dark:border-white/[0.06] dark:bg-[#121212]">
      {isFocusMode ? (
        <div className="border-b border-blue-100 bg-blue-50 px-4 py-2 text-center text-[11px] font-medium text-blue-700 dark:border-[#14d1a0]/20 dark:bg-[#14d1a0]/10 dark:text-[#14d1a0]">
          Focus mode — diagram expanded for easier review
        </div>
      ) : null}
      <Tabs
        value={aiPanelTab}
        onValueChange={(value) => setAiPanelTab(value as "diagram" | "explanation")}
        className="flex h-full min-h-0 flex-col gap-0"
      >
        <div className="flex h-14 shrink-0 items-center bg-white px-5 dark:bg-[#121212]">
          <TabsList className="h-9 w-full rounded-full bg-slate-100 p-1 dark:bg-white/[0.03] dark:border dark:border-white/[0.06]">
            <TabsTrigger value="diagram" className="flex-1 data-[state=active]:premium-btn-primary dark:text-[#e3e3e3]/70 dark:data-[state=active]:text-[#0d1f1a]">
              <GitBranch className="size-3.5" strokeWidth={1.5} />
              Diagram
            </TabsTrigger>
            <TabsTrigger value="explanation" className="flex-1 data-[state=active]:premium-btn-primary dark:text-[#e3e3e3]/70 dark:data-[state=active]:text-[#0d1f1a]">
              <Sparkles className="size-3.5" strokeWidth={1.5} />
              Explanation
            </TabsTrigger>
          </TabsList>
        </div>

        <Separator className="dark:bg-white/[0.06]" />

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
              <div className="space-y-5 p-6">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]">
                    Architecture Flowchart
                  </p>
                  <p className="text-xs text-slate-500 dark:text-[#e3e3e3]/50">
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
              <div className="space-y-5 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-[#e3e3e3]">
                      AI Explanation
                    </p>
                    <p className="text-xs text-slate-500 dark:text-[#e3e3e3]/50">
                      Step-by-step walkthrough of the logic
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <CopyButton
                      text={analysisResult.explanation}
                      label="Copy"
                      className="h-8 rounded-full text-xs dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-full text-xs dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-[#e3e3e3]"
                      onClick={() =>
                        downloadTextFile(
                          analysisResult.explanation,
                          "coderider-explanation.md"
                        )
                      }
                    >
                      .md
                    </Button>
                  </div>
                </div>
                <MarkdownExplanation content={analysisResult.explanation} />

                <div className="mt-6 flex justify-center pb-4">
                  <Button
                    variant="outline"
                    className="gap-2 rounded-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 dark:border-[#14d1a0]/30 dark:bg-[#14d1a0]/10 dark:text-[#14d1a0] dark:hover:bg-[#14d1a0]/20"
                    onClick={() => openChat({ type: "explanation", content: analysisResult.explanation })}
                  >
                    <MessageSquare className="size-4" strokeWidth={1.5} />
                    Ask Follow-up Question
                  </Button>
                </div>
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
