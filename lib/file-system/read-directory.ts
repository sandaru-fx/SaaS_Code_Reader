import {
  MAX_PROJECT_TOTAL_BYTES,
} from "@/lib/file-system/constants";
import { formatFileSize } from "@/lib/file-system/format-bytes";
import {
  FileSystemAccessError,
  type FileNode,
  type FolderScanResult,
} from "@/lib/file-system/types";
import { shouldSkipEntry } from "@/lib/file-system/skip-rules";

export function isFileSystemAccessSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "showDirectoryPicker" in window &&
    typeof window.showDirectoryPicker === "function"
  );
}

export async function pickLocalFolder(): Promise<FileSystemDirectoryHandle> {
  if (!isFileSystemAccessSupported()) {
    throw new FileSystemAccessError(
      "unsupported",
      "Local folder access is not supported in this browser. Use Chrome or Edge."
    );
  }

  try {
    return await window.showDirectoryPicker!({ mode: "read" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new FileSystemAccessError(
        "aborted",
        "Folder selection was cancelled."
      );
    }

    throw error;
  }
}

type FolderScanState = {
  totalReadableBytes: number;
  skippedEntryCount: number;
};

function sortFileNodes(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

function assertProjectWithinLimit(totalReadableBytes: number): void {
  if (totalReadableBytes > MAX_PROJECT_TOTAL_BYTES) {
    throw new FileSystemAccessError(
      "project-too-large",
      `Project is too large (${formatFileSize(totalReadableBytes)}). Maximum total readable size is ${formatFileSize(MAX_PROJECT_TOTAL_BYTES)}. Try a smaller folder.`
    );
  }
}

async function readDirectoryHandle(
  handle: FileSystemDirectoryHandle,
  basePath: string,
  scanState: FolderScanState
): Promise<FileNode[]> {
  const children: FileNode[] = [];

  try {
    for await (const [name, entryHandle] of handle.entries()) {
      if (shouldSkipEntry(name, entryHandle.kind)) {
        scanState.skippedEntryCount += 1;
        continue;
      }

      const path = basePath ? `${basePath}/${name}` : name;

      if (entryHandle.kind === "file") {
        const file = await entryHandle.getFile();
        scanState.totalReadableBytes += file.size;
        assertProjectWithinLimit(scanState.totalReadableBytes);

        children.push({
          name,
          type: "file",
          path,
          handle: entryHandle,
        });
        continue;
      }

      const nestedChildren = await readDirectoryHandle(
        entryHandle,
        path,
        scanState
      );

      children.push({
        name,
        type: "folder",
        path,
        handle: entryHandle,
        children: nestedChildren,
      });
    }
  } catch (error) {
    if (error instanceof FileSystemAccessError) {
      throw error;
    }

    throw new FileSystemAccessError(
      "read-failed",
      "Failed to read the selected folder.",
      { cause: error }
    );
  }

  return sortFileNodes(children);
}

export async function buildFileTreeFromDirectory(
  handle: FileSystemDirectoryHandle
): Promise<FolderScanResult> {
  const scanState: FolderScanState = {
    totalReadableBytes: 0,
    skippedEntryCount: 0,
  };
  const children = await readDirectoryHandle(handle, "", scanState);

  return {
    tree: {
      name: handle.name,
      type: "folder",
      path: "",
      handle,
      children,
    },
    skippedEntryCount: scanState.skippedEntryCount,
    totalReadableBytes: scanState.totalReadableBytes,
  };
}

export async function pickAndBuildFileTree(): Promise<FolderScanResult> {
  const handle = await pickLocalFolder();
  return buildFileTreeFromDirectory(handle);
}
