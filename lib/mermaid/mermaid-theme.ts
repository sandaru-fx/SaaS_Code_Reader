import type { MermaidConfig } from "mermaid";

export const CODERIDER_MERMAID_CONFIG: MermaidConfig = {
  startOnLoad: false,
  securityLevel: "strict",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 24,
    nodeSpacing: 70,
    rankSpacing: 90,
    useMaxWidth: false,
  },
  theme: "base",
  themeVariables: {
    primaryColor: "#3b82f6",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#1d4ed8",
    secondaryColor: "#a78bfa",
    secondaryTextColor: "#ffffff",
    secondaryBorderColor: "#7c3aed",
    tertiaryColor: "#fbbf24",
    tertiaryTextColor: "#1f2937",
    tertiaryBorderColor: "#d97706",
    lineColor: "#94a3b8",
    textColor: "#0f172a",
    mainBkg: "#3b82f6",
    nodeBorder: "#1d4ed8",
    clusterBkg: "#f1f5f9",
    titleColor: "#0f172a",
    edgeLabelBackground: "#ffffff",
    fontSize: "15px",
  },
};

export const CODERIDER_MERMAID_DARK_CONFIG: MermaidConfig = {
  ...CODERIDER_MERMAID_CONFIG,
  themeVariables: {
    primaryColor: "#3b82f6",
    primaryTextColor: "#f8fafc",
    primaryBorderColor: "#60a5fa",
    secondaryColor: "#8b5cf6",
    secondaryTextColor: "#f8fafc",
    secondaryBorderColor: "#a78bfa",
    tertiaryColor: "#f59e0b",
    tertiaryTextColor: "#1f2937",
    tertiaryBorderColor: "#fbbf24",
    lineColor: "#cbd5e1",
    textColor: "#e2e8f0",
    mainBkg: "#1e293b",
    nodeBorder: "#475569",
    clusterBkg: "#0f172a",
    titleColor: "#f1f5f9",
    edgeLabelBackground: "#1e293b",
    fontSize: "15px",
  },
};

export function getMermaidConfig(isDark: boolean): MermaidConfig {
  return isDark ? CODERIDER_MERMAID_DARK_CONFIG : CODERIDER_MERMAID_CONFIG;
}

/** Re-apply after render so SVG nodes pick up classDef fills. */
export const MERMAID_RENDER_OVERRIDES: Partial<MermaidConfig> = {
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 24,
    nodeSpacing: 70,
    rankSpacing: 90,
    useMaxWidth: false,
  },
};
