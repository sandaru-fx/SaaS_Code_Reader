export type FileNodeType = "file" | "folder";

export type FileNode = {
  name: string;
  type: FileNodeType;
  path: string;
  handle: FileSystemFileHandle | FileSystemDirectoryHandle;
  children?: FileNode[];
};

export type FileSystemErrorCode = "unsupported" | "aborted" | "read-failed";

export class FileSystemAccessError extends Error {
  readonly code: FileSystemErrorCode;

  constructor(code: FileSystemErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "FileSystemAccessError";
    this.code = code;
  }
}

export function isFileSystemAccessError(
  error: unknown
): error is FileSystemAccessError {
  return error instanceof FileSystemAccessError;
}
