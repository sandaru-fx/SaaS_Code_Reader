import {
  FileSystemAccessError,
  type FileNode,
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

function sortFileNodes(nodes: FileNode[]): FileNode[] {
  return nodes.sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "folder" ? -1 : 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  });
}

async function readDirectoryHandle(
  handle: FileSystemDirectoryHandle,
  basePath: string
): Promise<FileNode[]> {
  const children: FileNode[] = [];

  try {
    for await (const [name, entryHandle] of handle.entries()) {
      if (shouldSkipEntry(name, entryHandle.kind)) {
        continue;
      }

      const path = basePath ? `${basePath}/${name}` : name;

      if (entryHandle.kind === "file") {
        children.push({
          name,
          type: "file",
          path,
          handle: entryHandle,
        });
        continue;
      }

      const nestedChildren = await readDirectoryHandle(entryHandle, path);

      children.push({
        name,
        type: "folder",
        path,
        handle: entryHandle,
        children: nestedChildren,
      });
    }
  } catch (error) {
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
): Promise<FileNode> {
  const children = await readDirectoryHandle(handle, "");

  return {
    name: handle.name,
    type: "folder",
    path: "",
    handle,
    children,
  };
}

export async function pickAndBuildFileTree(): Promise<FileNode> {
  const handle = await pickLocalFolder();
  return buildFileTreeFromDirectory(handle);
}
