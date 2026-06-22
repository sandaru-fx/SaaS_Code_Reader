"use client";

import { useCallback, useEffect, useState } from "react";

import {
  readWorkspaceTheme,
  storeWorkspaceTheme,
  type WorkspaceTheme,
} from "@/lib/workspace/theme";

export function useWorkspaceTheme() {
  const [theme, setTheme] = useState<WorkspaceTheme>("dark");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setTheme(readWorkspaceTheme());
    setHydrated(true);
  }, []);

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
    hydrated,
  };
}
