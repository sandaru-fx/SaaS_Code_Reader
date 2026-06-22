"use client";

import { useCallback, useState } from "react";

import {
  readWorkspaceTheme,
  storeWorkspaceTheme,
  type WorkspaceTheme,
} from "@/lib/workspace/theme";

export function useWorkspaceTheme() {
  const [theme, setTheme] = useState<WorkspaceTheme>(() => readWorkspaceTheme());

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      storeWorkspaceTheme(next);
      return next;
    });
  }, []);

  return {
    isDark: theme === "dark",
    theme,
    toggleTheme,
  };
}
