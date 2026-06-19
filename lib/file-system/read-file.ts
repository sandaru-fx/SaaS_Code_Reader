import { MAX_FILE_SIZE_BYTES } from "@/lib/file-system/constants";
import { getLanguageFromPath } from "@/lib/file-system/language-map";
import {
  FileSystemAccessError,
  type FileContentResult,
  type FileNode,
} from "@/lib/file-system/types";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

export async function readFileContent(
  handle: FileSystemFileHandle
): Promise<{ content: string; size: number }> {
  try {
    const file = await handle.getFile();

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new FileSystemAccessError(
        "file-too-large",
        `File is too large (${formatFileSize(file.size)}). Maximum size is ${formatFileSize(MAX_FILE_SIZE_BYTES)}.`
      );
    }

    const content = await file.text();

    return {
      content,
      size: file.size,
    };
  } catch (error) {
    if (error instanceof FileSystemAccessError) {
      throw error;
    }

    throw new FileSystemAccessError(
      "read-failed",
      "Failed to read the selected file.",
      { cause: error }
    );
  }
}

export async function readFileNode(node: FileNode): Promise<FileContentResult> {
  if (node.type !== "file") {
    throw new FileSystemAccessError(
      "read-failed",
      "Only files can be read into the code viewer."
    );
  }

  const { content, size } = await readFileContent(
    node.handle as FileSystemFileHandle
  );

  return {
    name: node.name,
    path: node.path,
    content,
    language: getLanguageFromPath(node.path || node.name),
    size,
  };
}
