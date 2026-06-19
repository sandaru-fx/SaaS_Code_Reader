"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

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
  isLoading: boolean;
  isReadingFile: boolean;
  error: string | null;
  fileError: string | null;
  isSupported: boolean;
  openFolder: () => Promise<void>;
  selectFile: (node: FileNode) => Promise<void>;
  dismissError: () => void;
  dismissFileError: () => void;
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

export function WorkspaceProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileLanguage, setFileLanguage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
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

  const value = useMemo(
    () => ({
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      isLoading,
      isReadingFile,
      error,
      fileError,
      isSupported,
      openFolder,
      selectFile,
      dismissError,
      dismissFileError,
    }),
    [
      fileTree,
      selectedFile,
      fileContent,
      fileLanguage,
      isLoading,
      isReadingFile,
      error,
      fileError,
      isSupported,
      openFolder,
      selectFile,
      dismissError,
      dismissFileError,
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
