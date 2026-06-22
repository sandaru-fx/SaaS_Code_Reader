"use client";

import { useEffect, useState } from "react";
import {
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
import { FileTypeIcon } from "@/components/workspace/FileTypeIcon";
import { serializeTreeForAI, findNodeByPath, readFileNode } from "@/lib/file-system";
import type { LearningModule, ProjectOverview as ProjectOverviewData } from "@/lib/ai/project-types";

export function GuidePanel() {
  const {
    fileTree,
    selectFile,
    analyzeFile,
    selectedFile,
    canAnalyze,
    analysisResult,
  } = useWorkspace();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningModule[] | null>(null);
  const [projectOverview, setProjectOverview] = useState<ProjectOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileToAutoAnalyze, setFileToAutoAnalyze] = useState<string | null>(null);
  const [completedFiles, setCompletedFiles] = useState<Set<string>>(new Set());

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
    if (fileToAutoAnalyze && selectedFile?.path === fileToAutoAnalyze && canAnalyze) {
      void analyzeFile();
      setFileToAutoAnalyze(null);
    }
  }, [fileToAutoAnalyze, selectedFile, canAnalyze, analyzeFile]);

  useEffect(() => {
    if (!fileTree || learningPath || isAnalyzing) return;

    async function analyzeProjectStructure() {
      setIsAnalyzing(true);
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
        setIsAnalyzing(false);
      }
    }

    void analyzeProjectStructure();
  }, [fileTree, learningPath, isAnalyzing]);

  if (!fileTree) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <BookOpen className="mb-4 size-12 text-slate-300 dark:text-slate-600" />
        <h2 className="text-xl font-semibold leading-7 text-[#1f1f1f] dark:text-[#e3e3e3]">
          AI Tutor Mode
        </h2>
        <p className="max-w-sm text-base font-normal leading-6 text-slate-500 dark:text-slate-400">
          Open a folder to let the AI analyze your project and create a personalized
          learning path.
        </p>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <Loader2 className="mb-4 size-8 animate-spin text-blue-500" />
        <h2 className="text-xl font-semibold leading-7 text-[#1f1f1f] dark:text-[#e3e3e3]">
          Analyzing Project...
        </h2>
        <p className="max-w-sm text-base font-normal leading-6 text-slate-500 dark:text-slate-400">
          Reading project structure, tech stack, and generating your learning path.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="mb-4 size-12 text-red-500" />
        <h2 className="text-xl font-semibold leading-7 text-[#1f1f1f] dark:text-[#e3e3e3]">
          Analysis Failed
        </h2>
        <p className="max-w-sm text-base font-normal leading-6 text-red-500 dark:text-red-400">
          {error}
        </p>
        <Button
          className="mt-4"
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

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {projectOverview ? (
            <ProjectOverview projectName={fileTree.name} overview={projectOverview} />
          ) : null}

          <section>
            <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <BookOpen className="size-5" />
              <h2 className="text-lg font-medium text-[#1f1f1f] dark:text-[#e3e3e3]">
                Learning Path
              </h2>
            </div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Follow these modules in order to understand how this project works.
            </p>

            <div className="space-y-6">
              {derivedLearningPath?.map((module, index) => (
                <div
                  key={module.id}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    module.status === "current"
                      ? "border-blue-200 bg-white shadow-md dark:border-blue-900/50 dark:bg-slate-900"
                      : module.status === "completed"
                        ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20"
                        : "border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-900/50"
                  }`}
                >
                  {index !== (derivedLearningPath?.length ?? 0) - 1 && (
                    <div className="absolute bottom-[-24px] left-8 h-6 w-px bg-slate-200 dark:bg-slate-800" />
                  )}

                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex size-8 items-center justify-center rounded-full text-sm font-bold ${
                          module.status === "current"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                            : module.status === "completed"
                              ? "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400"
                              : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {module.status === "completed" ? (
                          <CheckCircle2 className="size-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-medium leading-[26px] text-[#1f1f1f] dark:text-[#e3e3e3]">
                          {module.title}
                        </h3>
                        <p className="text-sm font-normal leading-5 text-slate-500 dark:text-slate-400">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    {module.status === "current" ? (
                      <Button
                        size="sm"
                        className="shrink-0 gap-1 rounded-full"
                        onClick={() => {
                          const uncompletedFile = module.files.find(
                            (f) => !completedFiles.has(f.path)
                          );
                          if (uncompletedFile) {
                            const node = findNodeByPath(fileTree, uncompletedFile.path);
                            if (node) {
                              setFileToAutoAnalyze(node.path);
                              void selectFile(node, true);
                            }
                          }
                        }}
                      >
                        <PlayCircle className="size-4" />
                        {module.files.some((f) => completedFiles.has(f.path))
                          ? "Continue Module"
                          : "Start Module"}
                      </Button>
                    ) : null}
                  </div>

                  <div className="ml-11 space-y-2">
                    {module.files.map((file) => (
                      <button
                        key={file.path}
                        type="button"
                        disabled={module.status === "locked"}
                        onClick={() => {
                          const node = findNodeByPath(fileTree, file.path);
                          if (node) {
                            setFileToAutoAnalyze(node.path);
                            void selectFile(node, true);
                          }
                        }}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${
                          module.status === "locked"
                            ? "cursor-not-allowed border-transparent bg-transparent"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-700 dark:hover:bg-slate-800/80"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FileTypeIcon
                            fileName={file.name}
                            className="size-8 rounded-lg"
                            iconClassName="size-4"
                          />
                          <div>
                            <p className="text-base font-normal leading-6 text-[#1f1f1f] dark:text-[#e3e3e3]">
                              {file.name}
                            </p>
                            <p className="text-sm font-normal leading-5 text-slate-400 dark:text-slate-500">
                              {file.path}
                            </p>
                          </div>
                        </div>
                        {completedFiles.has(file.path) ? (
                          <CheckCircle2 className="size-4 text-green-500 dark:text-green-400" />
                        ) : module.status !== "locked" ? (
                          <ChevronRight className="size-4 text-slate-400" />
                        ) : null}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
