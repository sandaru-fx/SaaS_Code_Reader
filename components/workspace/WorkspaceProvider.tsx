"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { AnalyzeResponseBody } from "@/lib/ai/types";
import { getAnalyzeErrorMessage } from "@/lib/ai/get-analyze-error-message";
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
import {
  getOrCreateSessionId,
  SESSION_ID_HEADER,
} from "@/lib/session/client-id";
import type { AnalysisHistoryItem } from "@/lib/supabase/types";

type SidebarTab = "explorer" | "history";
type AiPanelTab = "diagram" | "explanation";

type AnalysisToastState = {
  title: string;
  description?: string;
};

type WorkspaceContextValue = {
  mode: WorkspaceMode;
  sidebarTab: SidebarTab;
  aiPanelTab: AiPanelTab;
  activeAnalyzeLabel: string | null;
  analysisToast: AnalysisToastState | null;
  fileTree: FileNode | null;
  selectedFile: FileNode | null;
  fileContent: string | null;
  fileLanguage: string | null;
  pastedCode: string;
  pastedLanguage: string;
  analysisResult: AnalyzeResponseBody | null;
  historyItems: AnalysisHistoryItem[];
  activeHistoryId: string | null;
  isHistoryLoading: boolean;
  isDeletingHistoryId: string | null;
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
  setSidebarTab: (tab: SidebarTab) => void;
  setAiPanelTab: (tab: AiPanelTab) => void;
  dismissAnalysisToast: () => void;
  setPastedCode: (code: string) => void;
  setPastedLanguage: (language: string) => void;
  openFolder: () => Promise<void>;
  selectFile: (node: FileNode) => Promise<void>;
  analyzeFile: () => Promise<void>;
  loadHistoryItem: (id: string) => Promise<void>;
  deleteHistoryItem: (id: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
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

function getHistoryHeaders(): HeadersInit {
  return {
    [SESSION_ID_HEADER]: getOrCreateSessionId(),
  };
}

export function WorkspaceProvider({
  children,
  initialMode = "folder",
}: Readonly<{
  children: React.ReactNode;
  initialMode?: WorkspaceMode;
}>) {
  const [mode, setMode] = useState<WorkspaceMode>(initialMode);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("explorer");
  const [aiPanelTab, setAiPanelTab] = useState<AiPanelTab>("diagram");
  const [analysisToast, setAnalysisToast] = useState<AnalysisToastState | null>(
    null
  );
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLanguage, setFileLanguage] = useState<string | null>(null);
  const [pastedCode, setPastedCode] = useState("");
  const [pastedLanguage, setPastedLanguage] = useState(DEFAULT_PASTE_LANGUAGE);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResponseBody | null>(
    null
  );
  const [historyItems, setHistoryItems] = useState<AnalysisHistoryItem[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [isDeletingHistoryId, setIsDeletingHistoryId] = useState<string | null>(
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
  const activeAnalyzeLabel = useMemo(() => {
    if (mode === "paste") {
      const trimmed = pastedCode.trim();
      return trimmed
        ? getPasteSnippetFileName(pastedLanguage)
        : "Quick Paste snippet";
    }

    return selectedFile?.name ?? null;
  }, [mode, pastedCode, pastedLanguage, selectedFile]);

  const dismissAnalysisToast = useCallback(() => {
    setAnalysisToast(null);
  }, []);

  const showAnalysisToast = useCallback((toast: AnalysisToastState) => {
    setAnalysisToast(toast);
  }, []);

  useEffect(() => {
    if (!analysisToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setAnalysisToast(null);
    }, 4500);

    return () => window.clearTimeout(timeoutId);
  }, [analysisToast]);

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

  const refreshHistory = useCallback(async () => {
    setIsHistoryLoading(true);

    try {
      const response = await fetch("/api/history", {
        headers: getHistoryHeaders(),
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { items?: AnalysisHistoryItem[] };
      setHistoryItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      // History is optional — ignore network failures silently.
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const updateSidebarTab = useCallback(
    (tab: SidebarTab) => {
      setSidebarTab(tab);

      if (tab === "history") {
        void refreshHistory();
      }
    },
    [refreshHistory]
  );

  const loadHistoryItem = useCallback(async (id: string) => {
    setAnalysisError(null);

    try {
      const response = await fetch(`/api/history/${id}`, {
        headers: getHistoryHeaders(),
      });

      const data = (await response.json()) as
        | {
            code?: string;
            language?: string;
            explanation?: string;
            mermaid?: string;
            fileName?: string | null;
            error?: string;
          }
        | { error?: string };

      if (!response.ok) {
        const serverError = "error" in data ? data.error : undefined;
        setAnalysisError(serverError ?? "Could not load saved analysis.");
        return;
      }

      if (
        !("code" in data) ||
        !("language" in data) ||
        !("explanation" in data) ||
        !("mermaid" in data)
      ) {
        setAnalysisError("Saved analysis returned an invalid response.");
        return;
      }

      setMode("paste");
      setSidebarTab("history");
      resetFileState(setSelectedFile, setFileContent, setFileLanguage, setFileError);
      readingPathRef.current = null;
      setPastedCode(data.code ?? "");
      setPastedLanguage(data.language ?? DEFAULT_PASTE_LANGUAGE);
      setAnalysisResult({
        explanation: data.explanation ?? "",
        mermaid: data.mermaid ?? "",
      });
      setActiveHistoryId(id);
      setAiPanelTab("diagram");
    } catch {
      setAnalysisError("Network error while loading saved analysis.");
    }
  }, []);

  const deleteHistoryItem = useCallback(
    async (id: string) => {
      setIsDeletingHistoryId(id);

      try {
        const response = await fetch("/api/history", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...getHistoryHeaders(),
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          return;
        }

        setHistoryItems((current) => current.filter((item) => item.id !== id));

        if (activeHistoryId === id) {
          setActiveHistoryId(null);
        }
      } finally {
        setIsDeletingHistoryId(null);
      }
    },
    [activeHistoryId]
  );

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
    setAiPanelTab("diagram");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getHistoryHeaders(),
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
        const serverError = "error" in data ? data.error : undefined;
        setAnalysisError(getAnalyzeErrorMessage(response.status, serverError));
        return;
      }

      if (!("explanation" in data) || !("mermaid" in data)) {
        setAnalysisError("Analysis returned an invalid response.");
        return;
      }

      setAnalysisResult(data);
      setActiveHistoryId(null);
      setAiPanelTab("diagram");
      showAnalysisToast({
        title: "Analysis complete",
        description: "Flowchart ready — saved to History.",
      });
      void refreshHistory();
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
    refreshHistory,
    showAnalysisToast,
  ]);

  const value = useMemo(
    () => ({
      mode,
      sidebarTab,
      aiPanelTab,
      activeAnalyzeLabel,
      analysisToast,
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      pastedCode,
      pastedLanguage,
      analysisResult,
      historyItems,
      activeHistoryId,
      isHistoryLoading,
      isDeletingHistoryId,
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
      setSidebarTab: updateSidebarTab,
      setAiPanelTab,
      dismissAnalysisToast,
      setPastedCode: updatePastedCode,
      setPastedLanguage: updatePastedLanguage,
      openFolder,
      selectFile,
      analyzeFile,
      loadHistoryItem,
      deleteHistoryItem,
      refreshHistory,
      dismissError,
      dismissFileError,
      dismissAnalysisError,
    }),
    [
      mode,
      sidebarTab,
      aiPanelTab,
      activeAnalyzeLabel,
      analysisToast,
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      pastedCode,
      pastedLanguage,
      analysisResult,
      historyItems,
      activeHistoryId,
      isHistoryLoading,
      isDeletingHistoryId,
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
      updateSidebarTab,
      setAiPanelTab,
      dismissAnalysisToast,
      updatePastedCode,
      updatePastedLanguage,
      openFolder,
      selectFile,
      analyzeFile,
      loadHistoryItem,
      deleteHistoryItem,
      refreshHistory,
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
