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
import { getPasteSnippetFileName } from "@/components/workspace/paste-utils";
import {
  DEFAULT_PASTE_LANGUAGE,
  type WorkspaceMode,
} from "@/components/workspace/types";
import {
  isFileSystemAccessError,
  isFileSystemAccessSupported,
  pickAndBuildFileTree,
  readFileNode,
  type FileNode,
} from "@/lib/file-system";
import { MAX_FILE_SIZE_BYTES } from "@/lib/file-system/constants";
import { formatFileSize } from "@/lib/file-system/format-bytes";

type WorkspaceContextValue = {
  mode: WorkspaceMode;
  fileTree: FileNode | null;
  selectedFile: FileNode | null;
  fileContent: string | null;
  fileLanguage: string | null;
  pastedCode: string;
  pastedLanguage: string;
  analysisResult: AnalyzeResponseBody | null;
  isLoading: boolean;
  isReadingFile: boolean;
  isAnalyzing: boolean;
  error: string | null;
  fileError: string | null;
  analysisError: string | null;
  folderSkippedCount: number;
  canAnalyze: boolean;
  isSupported: boolean;
  switchToFolder: () => void;
  switchToPaste: () => void;
  setPastedCode: (code: string) => void;
  setPastedLanguage: (language: string) => void;
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

function resetPasteState(
  setPastedCode: (value: string) => void,
  setPastedLanguage: (value: string) => void
) {
  setPastedCode("");
  setPastedLanguage(DEFAULT_PASTE_LANGUAGE);
}

function resetAnalysisState(
  setAnalysisResult: (value: AnalyzeResponseBody | null) => void,
  setAnalysisError: (value: string | null) => void
) {
  setAnalysisResult(null);
  setAnalysisError(null);
}

function getPasteByteLength(code: string): number {
  return new TextEncoder().encode(code).length;
}

export function WorkspaceProvider({
  children,
  initialMode = "folder",
}: Readonly<{
  children: React.ReactNode;
  initialMode?: WorkspaceMode;
}>) {
  const [mode, setMode] = useState<WorkspaceMode>(initialMode);
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLanguage, setFileLanguage] = useState<string | null>(null);
  const [pastedCode, setPastedCode] = useState("");
  const [pastedLanguage, setPastedLanguage] = useState(DEFAULT_PASTE_LANGUAGE);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponseBody | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [folderSkippedCount, setFolderSkippedCount] = useState(0);
  const readingPathRef = useRef<string | null>(null);
  const isSupported = useMemo(() => isFileSystemAccessSupported(), []);
  const pasteByteLength = useMemo(
    () => getPasteByteLength(pastedCode),
    [pastedCode]
  );

  const canAnalyze = useMemo(() => {
    if (isAnalyzing || isReadingFile) {
      return false;
    }

    if (mode === "paste") {
      return (
        pastedCode.trim().length > 0 && pasteByteLength <= MAX_FILE_SIZE_BYTES
      );
    }

    return Boolean(selectedFile && fileContent !== null && fileLanguage);
  }, [
    mode,
    pastedCode,
    pasteByteLength,
    selectedFile,
    fileContent,
    fileLanguage,
    isAnalyzing,
    isReadingFile,
  ]);

  const switchToFolder = useCallback(() => {
    setMode("folder");
    resetPasteState(setPastedCode, setPastedLanguage);
    resetAnalysisState(setAnalysisResult, setAnalysisError);
    setFolderSkippedCount(0);
  }, []);

  const switchToPaste = useCallback(() => {
    setMode("paste");
    resetFileState(setSelectedFile, setFileContent, setFileLanguage, setFileError);
    readingPathRef.current = null;
    resetAnalysisState(setAnalysisResult, setAnalysisError);
    setFolderSkippedCount(0);
  }, []);

  const updatePastedCode = useCallback((code: string) => {
    setPastedCode(code);
    resetAnalysisState(setAnalysisResult, setAnalysisError);
  }, []);

  const updatePastedLanguage = useCallback((language: string) => {
    setPastedLanguage(language);
    resetAnalysisState(setAnalysisResult, setAnalysisError);
  }, []);

  const openFolder = useCallback(async () => {
    if (!isSupported) {
      setError(
        "Local folder access is not supported in this browser. Use Chrome or Edge."
      );
      return;
    }

    setMode("folder");
    resetPasteState(setPastedCode, setPastedLanguage);
    setIsLoading(true);
    setError(null);

    try {
      const scanResult = await pickAndBuildFileTree();
      setFileTree(scanResult.tree);
      setFolderSkippedCount(scanResult.skippedEntryCount);
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

    setMode("folder");
    resetPasteState(setPastedCode, setPastedLanguage);
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
    let code: string;
    let language: string;
    let fileName: string | undefined;

    if (mode === "paste") {
      const trimmed = pastedCode.trim();

      if (!trimmed) {
        setAnalysisError("Paste a code snippet before analyzing.");
        return;
      }

      if (pasteByteLength > MAX_FILE_SIZE_BYTES) {
        setAnalysisError(
          `Snippet exceeds the maximum size of ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`
        );
        return;
      }

      code = pastedCode;
      language = pastedLanguage;
      fileName = getPasteSnippetFileName(pastedLanguage);
    } else {
      if (!selectedFile || fileContent === null || !fileLanguage) {
        setAnalysisError("Select a readable file before analyzing.");
        return;
      }

      code = fileContent;
      language = fileLanguage;
      fileName = selectedFile.name;
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
          code,
          language,
          fileName,
        }),
      });

      const data = (await response.json()) as
        | AnalyzeResponseBody
        | { error?: string };

      if (!response.ok) {
        if (response.status === 401) {
          setAnalysisError("Please sign in to analyze code.");
          return;
        }

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
      setAnalysisError(
        mode === "paste"
          ? "Network error while analyzing the snippet."
          : "Network error while analyzing the file."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [
    mode,
    pastedCode,
    pastedLanguage,
    pasteByteLength,
    selectedFile,
    fileContent,
    fileLanguage,
  ]);

  const value = useMemo(
    () => ({
      mode,
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      pastedCode,
      pastedLanguage,
      analysisResult,
      isLoading,
      isReadingFile,
      isAnalyzing,
      error,
      fileError,
      analysisError,
      folderSkippedCount,
      canAnalyze,
      isSupported,
      switchToFolder,
      switchToPaste,
      setPastedCode: updatePastedCode,
      setPastedLanguage: updatePastedLanguage,
      openFolder,
      selectFile,
      analyzeFile,
      dismissError,
      dismissFileError,
      dismissAnalysisError,
    }),
    [
      mode,
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      pastedCode,
      pastedLanguage,
      analysisResult,
      isLoading,
      isReadingFile,
      isAnalyzing,
      error,
      fileError,
      analysisError,
      folderSkippedCount,
      canAnalyze,
      isSupported,
      switchToFolder,
      switchToPaste,
      updatePastedCode,
      updatePastedLanguage,
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
