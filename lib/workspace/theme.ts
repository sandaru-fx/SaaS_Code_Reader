export const WORKSPACE_THEME_KEY = "coderider-workspace-theme";

export type WorkspaceTheme = "light" | "dark";

export function readWorkspaceTheme(): WorkspaceTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(WORKSPACE_THEME_KEY);

  return stored === "light" ? "light" : "dark";
}

export function storeWorkspaceTheme(theme: WorkspaceTheme): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WORKSPACE_THEME_KEY, theme);
}
