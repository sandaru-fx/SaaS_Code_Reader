export const MAX_FILE_SIZE_BYTES = 100 * 1024;

/** Total readable project size allowed when opening a local folder. */
export const MAX_PROJECT_TOTAL_BYTES = 500 * 1024;

export const SKIP_DIRECTORY_NAMES = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".cache",
  "coverage",
  ".turbo",
  ".vercel",
  "out",
]);

export const BINARY_FILE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".ico",
  ".bmp",
  ".pdf",
  ".zip",
  ".gz",
  ".tar",
  ".rar",
  ".7z",
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".woff",
  ".woff2",
  ".ttf",
  ".eot",
  ".otf",
  ".mp3",
  ".mp4",
  ".wav",
  ".avi",
  ".mov",
  ".lock",
  ".sqlite",
  ".db",
  ".bin",
  ".dat",
  ".wasm",
]);
