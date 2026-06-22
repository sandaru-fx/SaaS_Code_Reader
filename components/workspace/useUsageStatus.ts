"use client";

import { useCallback, useEffect, useState } from "react";

import type { UsageStatus } from "@/lib/usage/types";

export function useUsageStatus() {
  const [usage, setUsage] = useState<UsageStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshUsage = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/usage");

      if (!response.ok) {
        setUsage(null);
        return;
      }

      const data = (await response.json()) as UsageStatus;
      setUsage(data);
    } catch {
      setUsage(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refreshUsage();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refreshUsage]);

  return {
    usage,
    isLoading,
    refreshUsage,
  };
}
