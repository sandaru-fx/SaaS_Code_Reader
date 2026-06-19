"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import type { AnalyzeResponseBody } from "@/lib/ai/types";
import {
  isFileSystemAccessError,
  isFileSystemAccessSupported,
  pickAndBuildFileTree,
  readFileNode,
  type FileNode,
} from "@/lib/file-system";

type WorkspaceContextValue = {
  fileTree: FileNode | null;
  selectedFile: FileNode | null;
  fileContent: string | null;
  fileLanguage: string | null;
  analysisResult: AnalyzeResponseBody | null;
  isLoading: boolean;
  isReadingFile: boolean;
  isAnalyzing: boolean;
  error: string | null;
  fileError: string | null;
  analysisError: string | null;
  isSupported: boolean;
  openFolder: () => Promise<void>;
  selectFile: (node: FileNode) => Promise<void>;
  analyzeFile: () => Promise<void>;
  dismissError: () => void;
  dismissFileError: () => void;
  dismissAnalysisError: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function resetFileState(
  setSelectedFile: (value: FileNode | null) => void,
  setFileContent: (value: string | null) => void,
  setFileLanguage: (value: string | null) => void,
  setFileError: (value: string | null) => void
) {
  setSelectedFile(null);
  setFileContent(null);
  setFileLanguage(null);
  setFileError(null);
}

function resetAnalysisState(
  setAnalysisResult: (value: AnalyzeResponseBody | null) => void,
  setAnalysisError: (value: string | null) => void
) {
  setAnalysisResult(null);
  setAnalysisError(null);
}

export function WorkspaceProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLanguage, setFileLanguage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponseBody | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const readingPathRef = useRef<string | null>(null);
  const isSupported = useMemo(() => isFileSystemAccessSupported(), []);

  const openFolder = useCallback(async () => {
    if (!isSupported) {
      setError(
        "Local folder access is not supported in this browser. Use Chrome or Edge."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tree = await pickAndBuildFileTree();
      setFileTree(tree);
      resetFileState(setSelectedFile, setFileContent, setFileLanguage, setFileError);
      resetAnalysisState(setAnalysisResult, setAnalysisError);
      readingPathRef.current = null;
    } catch (err) {
      if (isFileSystemAccessError(err) && err.code === "aborted") {
        return;
      }

      if (isFileSystemAccessError(err)) {
        setError(err.message);
        return;
      }

      setError("Something went wrong while opening the folder.");
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  const dismissFileError = useCallback(() => {
    setFileError(null);
  }, []);

  const dismissAnalysisError = useCallback(() => {
    setAnalysisError(null);
  }, []);

  const selectFile = useCallback(async (node: FileNode) => {
    if (node.type !== "file") {
      return;
    }

    readingPathRef.current = node.path;
    setSelectedFile(node);
    setIsReadingFile(true);
    setFileError(null);
    setFileContent(null);
    setFileLanguage(null);
    resetAnalysisState(setAnalysisResult, setAnalysisError);

    try {
      const result = await readFileNode(node);

      if (readingPathRef.current !== node.path) {
        return;
      }

      setFileContent(result.content);
      setFileLanguage(result.language);
    } catch (err) {
      if (readingPathRef.current !== node.path) {
        return;
      }

      if (isFileSystemAccessError(err)) {
        setFileError(err.message);
        return;
      }

      setFileError("Something went wrong while reading the file.");
    } finally {
      if (readingPathRef.current === node.path) {
        setIsReadingFile(false);
      }
    }
  }, []);

  const analyzeFile = useCallback(async () => {
    if (!selectedFile || fileContent === null || !fileLanguage) {
      setAnalysisError("Select a readable file before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: fileContent,
          language: fileLanguage,
          fileName: selectedFile.name,
        }),
      });

      const data = (await response.json()) as
        | AnalyzeResponseBody
        | { error?: string };

      if (!response.ok) {
        setAnalysisError(
          "error" in data && data.error
            ? data.error
            : "Analysis failed. Please try again."
        );
        return;
      }

      if (!("explanation" in data) || !("mermaid" in data)) {
        setAnalysisError("Analysis returned an invalid response.");
        return;
      }

      setAnalysisResult(data);
    } catch {
      setAnalysisError("Network error while analyzing the file.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFile, fileContent, fileLanguage]);

  const value = useMemo(
    () => ({
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      analysisResult,
      isLoading,
      isReadingFile,
      isAnalyzing,
      error,
      fileError,
      analysisError,
      isSupported,
      openFolder,
      selectFile,
      analyzeFile,
      dismissError,
      dismissFileError,
      dismissAnalysisError,
    }),
    [
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      analysisResult,
      isLoading,
      isReadingFile,
      isAnalyzing,
      error,
      fileError,
      analysisError,
      isSupported,
      openFolder,
      selectFile,
      analyzeFile,
      dismissError,
      dismissFileError,
      dismissAnalysisError,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }

  return context;
}
