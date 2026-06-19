"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  isFileSystemAccessError,
  isFileSystemAccessSupported,
  pickAndBuildFileTree,
  type FileNode,
} from "@/lib/file-system";

type WorkspaceContextValue = {
  fileTree: FileNode | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  openFolder: () => Promise<void>;
  dismissError: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const value = useMemo(
    () => ({
      fileTree,
      isLoading,
      error,
      isSupported,
      openFolder,
      dismissError,
    }),
    [fileTree, isLoading, error, isSupported, openFolder, dismissError]
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
