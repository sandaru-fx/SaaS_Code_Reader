export const SIDEBAR_WIDTH_KEY = "coderider-sidebar-width";
export const AI_PANEL_WIDTH_KEY = "coderider-ai-panel-width";

export const SIDEBAR_MIN_WIDTH = 220;
export const SIDEBAR_MAX_WIDTH = 420;
export const SIDEBAR_DEFAULT_WIDTH = 280;

export const AI_PANEL_MIN_WIDTH = 360;
export const AI_PANEL_MAX_WIDTH = 640;
export const AI_PANEL_DEFAULT_WIDTH = 520;

export function clampSidebarWidth(width: number): number {
  return Math.min(SIDEBAR_MAX_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, width));
}

export function clampAiPanelWidth(width: number): number {
  return Math.min(AI_PANEL_MAX_WIDTH, Math.max(AI_PANEL_MIN_WIDTH, width));
}

export function readStoredPanelWidth(
  key: string,
  fallback: number,
  clamp: (width: number) => number
): number {
  if (typeof window === "undefined") {
    return fallback;
  }

  const stored = window.localStorage.getItem(key);

  if (!stored) {
    return fallback;
  }

  const parsed = Number.parseInt(stored, 10);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return clamp(parsed);
}

export function storePanelWidth(key: string, width: number): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, String(width));
}
