const EXTENSION_LANGUAGE_MAP: Record<string, string> = {
  ".ts": "typescript",
  ".tsx": "tsx",
  ".mts": "typescript",
  ".cts": "typescript",
  ".js": "javascript",
  ".jsx": "jsx",
  ".mjs": "javascript",
  ".cjs": "javascript",
  ".json": "json",
  ".css": "css",
  ".scss": "scss",
  ".sass": "sass",
  ".less": "less",
  ".html": "html",
  ".htm": "html",
  ".xml": "xml",
  ".svg": "xml",
  ".md": "markdown",
  ".mdx": "mdx",
  ".yaml": "yaml",
  ".yml": "yaml",
  ".toml": "toml",
  ".py": "python",
  ".rb": "ruby",
  ".go": "go",
  ".rs": "rust",
  ".java": "java",
  ".kt": "kotlin",
  ".swift": "swift",
  ".php": "php",
  ".sql": "sql",
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".ps1": "powershell",
  ".bat": "batch",
  ".cmd": "batch",
  ".dockerfile": "dockerfile",
  ".env": "dotenv",
  ".gitignore": "ignore",
  ".prisma": "prisma",
  ".graphql": "graphql",
  ".gql": "graphql",
  ".vue": "vue",
  ".svelte": "svelte",
};

const FILENAME_LANGUAGE_MAP: Record<string, string> = {
  dockerfile: "dockerfile",
  makefile: "makefile",
  ".gitignore": "ignore",
  ".env": "dotenv",
  ".env.local": "dotenv",
  ".env.example": "dotenv",
};

function getExtension(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) {
    return "";
  }

  return name.slice(dotIndex).toLowerCase();
}

export function getLanguageFromFileName(name: string): string {
  const lowerName = name.toLowerCase();
  const byFilename = FILENAME_LANGUAGE_MAP[lowerName];

  if (byFilename) {
    return byFilename;
  }

  const extension = getExtension(name);
  return EXTENSION_LANGUAGE_MAP[extension] ?? "plaintext";
}

export function getLanguageFromPath(path: string): string {
  const segments = path.split("/");
  const fileName = segments[segments.length - 1] ?? path;
  return getLanguageFromFileName(fileName);
}
