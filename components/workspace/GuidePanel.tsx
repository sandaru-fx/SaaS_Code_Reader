"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Loader2,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectOverview } from "@/components/workspace/ProjectOverview";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { serializeTreeForAI, findNodeByPath, readFileNode } from "@/lib/file-system";
import { isTourCompleted } from "@/lib/workspace/onboarding";
import type { LearningModule, ProjectOverview as ProjectOverviewData } from "@/lib/ai/project-types";

type GuidePanelProps = {
  compact?: boolean;
};

export function GuidePanel({ compact = false }: GuidePanelProps) {
  const {
    fileTree,
    selectFile,
    analyzeFile,
    selectedFile,
    canAnalyze,
    analysisResult,
    loadCachedAnalysis,
    isReadingFile,
    isAnalyzing: isAnalyzingFile,
    showToast,
    exitGuideLesson,
    openFolder,
    isSupported,
    isFileSystemReady,
    startTour,
    isTourActive,
  } = useWorkspace();
  const [isAnalyzingProject, setIsAnalyzingProject] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningModule[] | null>(null);
  const [projectOverview, setProjectOverview] = useState<ProjectOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileToAutoAnalyze, setFileToAutoAnalyze] = useState<string | null>(null);
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());
  const moduleStatusRef = useRef<Record<string, string>>({});

  useEffect(() => {
    if (analysisResult && selectedFile) {
      setCompletedFiles((prev) => {
        const next = new Set(prev);
        next.add(selectedFile.path);
        return next;
      });
    }
  }, [analysisResult, selectedFile]);

  const derivedLearningPath = learningPath?.map((module, index, array) => {
    const isCompleted = module.files.every((f) => completedFiles.has(f.path));

    let status: "locked" | "current" | "completed" = "locked";

    if (isCompleted) {
      status = "completed";
    } else if (
      index === 0 ||
      array[index - 1].files.every((f) => completedFiles.has(f.path))
    ) {
      status = "current";
    }

    return { ...module, status };
  });

  useEffect(() => {
    if (!derivedLearningPath) {
      return;
    }

    for (const module of derivedLearningPath) {
      const previousStatus = moduleStatusRef.current[module.id];
      if (previousStatus && previousStatus !== "completed" && module.status === "completed") {
        showToast({
          title: `Module complete: ${module.title}`,
          description: "Nice work! The next module is now unlocked.",
        });
      }
      moduleStatusRef.current[module.id] = module.status;
    }
  }, [derivedLearningPath, showToast]);

  useEffect(() => {
    if (!learningPath || isTourCompleted() || isTourActive) {
      return;
    }

    const timer = window.setTimeout(() => {
      startTour();
    }, 800);

    return () => window.clearTimeout(timer);
  }, [learningPath, startTour, isTourActive]);

  useEffect(() => {
    if (!fileToAutoAnalyze || selectedFile?.path !== fileToAutoAnalyze) {
      return;
    }

    if (loadCachedAnalysis(fileToAutoAnalyze)) {
      setFileToAutoAnalyze(null);
      return;
    }

    if (canAnalyze) {
      void analyzeFile();
      setFileToAutoAnalyze(null);
    }
  }, [
    fileToAutoAnalyze,
    selectedFile,
    canAnalyze,
    analyzeFile,
    loadCachedAnalysis,
  ]);

  useEffect(() => {
    if (!fileTree || learningPath || isAnalyzingProject) return;

    async function analyzeProjectStructure() {
      setIsAnalyzingProject(true);
      setError(null);

      try {
        const treeStructure = fileTree ? serializeTreeForAI(fileTree) : "";

        let packageJson = "";
        let readme = "";

        const packageJsonNode = fileTree ? findNodeByPath(fileTree, "package.json") : null;
        if (packageJsonNode && packageJsonNode.type === "file") {
          try {
            const result = await readFileNode(packageJsonNode);
            packageJson = result.content.slice(0, 5000);
          } catch (e) {
            console.error("Failed to read package.json", e);
          }
        }

        const readmeNode = fileTree
          ? findNodeByPath(fileTree, "README.md") || findNodeByPath(fileTree, "readme.md")
          : null;
        if (readmeNode && readmeNode.type === "file") {
          try {
            const result = await readFileNode(readmeNode);
            readme = result.content.slice(0, 5000);
          } catch (e) {
            console.error("Failed to read README.md", e);
          }
        }

        const response = await fetch("/api/analyze-project", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: fileTree?.name || "Project",
            treeStructure,
            packageJson,
            readme,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to analyze project structure.");
        }

        const data = await response.json();
        if (data.learningPath && data.overview) {
          setLearningPath(data.learningPath);
          setProjectOverview(data.overview);
        } else {
          throw new Error("Invalid project analysis format received.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsAnalyzingProject(false);
      }
    }

    void analyzeProjectStructure();
  }, [fileTree, learningPath, isAnalyzingProject]);

  const isFileBusy = (path: string) =>
    selectedFile?.path === path && (isReadingFile || isAnalyzingFile);

  if (!fileTree) {
    const canOpenFolder = !isFileSystemReady || isSupported;

    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center dark:bg-[#121212]">
        <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#14d1a0]/10 dark:border dark:border-[#14d1a0]/20">
          <BookOpen className="size-8 text-slate-400 premium-accent" strokeWidth={1.25} />
        </div>
        <h2 className="text-xl font-semibold leading-7 text-[#1f1f1f] dark:text-[#e3e3e3]">
          AI Tutor Mode
        </h2>
        <p className="mt-2 max-w-sm text-base font-normal leading-6 text-slate-500 dark:text-[#e3e3e3]/55">
          Open a folder to let the AI analyze your project and create a personalized
          learning path.
        </p>
        <Button
          type="button"
          className="mt-6 rounded-full px-6 premium-btn-primary"
          disabled={!canOpenFolder}
          onClick={() => void openFolder("guide")}
        >
          Open Folder
        </Button>
        {isFileSystemReady && !isSupported ? (
          <p className="mt-3 max-w-sm text-sm text-amber-700 dark:text-[#cc7a31]">
            Use Chrome or Edge to open local project folders.
          </p>
        ) : null}
      </div>
    );
  }

  if (isAnalyzingProject) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center dark:bg-[#121212]">
        <Loader2 className="mb-4 size-8 animate-spin text-blue-500 premium-accent" />
        <h2 className="text-xl font-semibold leading-7 text-[#1f1f1f] dark:text-[#e3e3e3]">
          Analyzing Project...
        </h2>
        <p className="max-w-sm text-base font-normal leading-6 text-slate-500 dark:text-[#e3e3e3]/55">
          Reading project structure, tech stack, and generating your learning path.
        </p>
      </div>
    );
  }

  const startModuleFile = (path: string) => {
    const node = findNodeByPath(fileTree!, path);
    if (!node) {
      return;
    }

    setFileToAutoAnalyze(node.path);
    void selectFile(node, { autoAnalyze: true, keepGuideMode: true });
  };

  const learningPathSection = (
    <section data-tour-id="guide-learning-path">
      {!compact ? (
        <>
          <div className="mb-4 flex items-center gap-2 text-blue-600 premium-accent">
            <BookOpen className="size-5" strokeWidth={1.5} />
            <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
              Learning Path
            </h2>
          </div>
          <p className="mb-5 text-sm text-slate-500 dark:text-[#e3e3e3]/55">
            Follow these modules in order to understand how this project works.
          </p>
        </>
      ) : (
        <div className="mb-3 border-b border-slate-200 dark:border-white/[0.06]">
          <div className="flex items-center justify-between gap-2 px-5 py-3">
            <div className="flex items-center gap-2 text-blue-600 premium-accent">
              <BookOpen className="size-4" strokeWidth={1.5} />
              <h2 className="text-sm font-semibold text-[#1f1f1f] dark:text-[#e3e3e3]">
                Learning Path
              </h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 rounded-full px-2 text-xs text-slate-600 dark:text-[#e3e3e3]/70 dark:hover:bg-white/[0.05]"
              onClick={exitGuideLesson}
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.5} />
              Overview
            </Button>
          </div>
          {isAnalyzingFile && selectedFile ? (
            <div className="flex items-center gap-2 border-t border-slate-100 bg-blue-50/60 px-5 py-2 text-xs text-blue-700 dark:border-white/[0.06] dark:bg-[#14d1a0]/10 dark:text-[#14d1a0]">
              <Loader2 className="size-3.5 animate-spin" />
              Analyzing {selectedFile.name}...
            </div>
          ) : isReadingFile && selectedFile ? (
            <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-2 text-xs text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-[#e3e3e3]/65">
              <Loader2 className="size-3.5 animate-spin" />
              Loading {selectedFile.name}...
            </div>
          ) : null}
        </div>
      )}

      <div className={compact ? "space-y-3 px-5 pb-5" : "space-y-6"}>
        {derivedLearningPath?.map((module, index) => (
          <div
            key={module.id}
            className={`relative rounded-2xl border transition-all ${
              compact ? "p-4" : "p-6"
            } ${
              module.status === "current"
                ? "border-blue-200 bg-white shadow-md dark:border-[#14d1a0]/30 dark:bg-[#1c1c1c] dark:shadow-[0_0_24px_-12px_rgba(20,209,160,0.2)]"
                : module.status === "completed"
                  ? "border-green-200 bg-green-50/50 dark:border-[#14d1a0]/15 dark:bg-[#14d1a0]/[0.04]"
                  : "border-slate-200 bg-slate-50 opacity-70 dark:border-white/[0.06] dark:bg-white/[0.02]"
            }`}
          >
            {!compact && index !== (derivedLearningPath?.length ?? 0) - 1 ? (
              <div className="absolute bottom-[-24px] left-10 h-6 w-px bg-slate-200 dark:bg-white/[0.08]" />
            ) : null}

            <div
              className={`flex items-start justify-between gap-3 ${
                compact ? "mb-3" : "mb-4"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex items-center justify-center rounded-full font-semibold ${
                    compact ? "size-7 text-xs" : "size-9 text-sm"
                  } ${
                    module.status === "current"
                      ? "bg-blue-100 text-blue-600 dark:bg-[#14d1a0]/15 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/30"
                      : module.status === "completed"
                        ? "bg-green-100 text-green-600 dark:bg-[#14d1a0]/15 dark:text-[#14d1a0]"
                        : "bg-slate-200 text-slate-500 dark:bg-white/[0.05] dark:text-[#e3e3e3]/45"
                  }`}
                >
                  {module.status === "completed" ? (
                    <CheckCircle2 className={compact ? "size-4" : "size-5"} strokeWidth={1.75} />
                  ) : (
                    index + 1
                  )}
                </div>
                <div>
                  <h3
                    className={`font-medium text-[#1f1f1f] dark:text-[#e3e3e3] ${
                      compact
                        ? "text-sm leading-5"
                        : "text-lg leading-[26px]"
                    }`}
                  >
                    {module.title}
                  </h3>
                  {!compact ? (
                    <p className="text-sm font-normal leading-5 text-slate-500 dark:text-[#e3e3e3]/55">
                      {module.description}
                    </p>
                  ) : null}
                </div>
              </div>
              {module.status === "current" && !compact ? (
                <Button
                  size="sm"
                  className="shrink-0 gap-1 rounded-full premium-btn-primary"
                  data-tour-id="guide-start-module"
                  onClick={() => {
                    const uncompletedFile = module.files.find(
                      (f) => !completedFiles.has(f.path)
                    );
                    if (uncompletedFile) {
                      startModuleFile(uncompletedFile.path);
                    }
                  }}
                >
                  <PlayCircle className="size-4" strokeWidth={1.5} />
                  {module.files.some((f) => completedFiles.has(f.path))
                    ? "Continue Module"
                    : "Start Module"}
                </Button>
              ) : null}
            </div>

            <div className={compact ? "space-y-2" : "ml-12 space-y-2"}>
              {module.files.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  disabled={module.status === "locked"}
                  onClick={() => startModuleFile(file.path)}
                  className={`flex w-full items-center justify-between rounded-xl border text-left transition-colors ${
                    compact ? "p-2.5" : "p-3.5"
                  } ${
                    selectedFile?.path === file.path
                      ? "border-blue-300 bg-blue-50 dark:border-[#14d1a0]/40 dark:bg-[#14d1a0]/10"
                      : module.status === "locked"
                        ? "cursor-not-allowed border-transparent bg-transparent"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-white/[0.06] dark:bg-white/[0.02] dark:hover:border-[#14d1a0]/30 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {!compact ? (
                      <span className="relative flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/[0.04]">
                        <span
                          className={`size-2 rounded-full ${
                            completedFiles.has(file.path)
                              ? "bg-green-500 dark:bg-[#14d1a0] premium-status-saved"
                              : selectedFile?.path === file.path
                                ? "bg-amber-500 dark:bg-[#cc7a31] premium-status-modified"
                                : "bg-slate-300 dark:bg-white/20"
                          }`}
                          aria-hidden
                        />
                      </span>
                    ) : null}
                    <div className="min-w-0">
                      <p
                        className={`truncate font-normal text-[#1f1f1f] dark:text-[#e3e3e3] ${
                          compact ? "text-xs leading-4" : "text-base leading-6"
                        }`}
                      >
                        {file.name}
                      </p>
                      {!compact ? (
                        <p className="text-sm font-normal leading-5 text-slate-400 dark:text-[#e3e3e3]/40">
                          {file.path}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {isFileBusy(file.path) ? (
                    <Loader2 className="size-4 shrink-0 animate-spin text-blue-500 dark:text-[#14d1a0]" />
                  ) : completedFiles.has(file.path) ? (
                    <CheckCircle2 className="size-4 shrink-0 text-green-500 dark:text-[#14d1a0]" strokeWidth={1.75} />
                  ) : module.status !== "locked" ? (
                    <ChevronRight className="size-4 shrink-0 text-slate-400 dark:text-[#e3e3e3]/35" strokeWidth={1.5} />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center dark:bg-[#121212]">
        <AlertCircle className="mb-4 size-12 text-red-500" strokeWidth={1.25} />
        <h2 className="text-xl font-semibold leading-7 text-[#1f1f1f] dark:text-[#e3e3e3]">
          Analysis Failed
        </h2>
        <p className="max-w-sm text-base font-normal leading-6 text-red-500 dark:text-red-400">
          {error}
        </p>
        <Button
          className="mt-4 premium-btn-primary"
          onClick={() => {
            setError(null);
            setLearningPath(null);
            setProjectOverview(null);
          }}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex h-full flex-col bg-slate-50 dark:bg-[#121212]">
        <div className="flex-1 overflow-auto">{learningPathSection}</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-[#0f0f0f]">
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {projectOverview ? (
            <ProjectOverview projectName={fileTree.name} overview={projectOverview} />
          ) : null}
          {learningPathSection}
        </div>
      </div>
    </div>
  );
}
