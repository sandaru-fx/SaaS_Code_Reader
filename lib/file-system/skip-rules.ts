import { BINARY_FILE_EXTENSIONS, SKIP_DIRECTORY_NAMES } from "@/lib/file-system/constants";

function getExtension(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) {
    return "";
  }

  return name.slice(dotIndex).toLowerCase();
}

export function shouldSkipDirectory(name: string): boolean {
  if (SKIP_DIRECTORY_NAMES.has(name)) {
    return true;
  }

  return name.startsWith(".");
}

export function shouldSkipFile(name: string): boolean {
  return BINARY_FILE_EXTENSIONS.has(getExtension(name));
}

export function shouldSkipEntry(
  name: string,
  kind: FileSystemHandleKind
): boolean {
  if (kind === "directory") {
    return shouldSkipDirectory(name);
  }

  return shouldSkipFile(name);
}
