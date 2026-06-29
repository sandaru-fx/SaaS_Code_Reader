import type { MermaidConfig } from "mermaid";

export const CODERIDER_MERMAID_CONFIG: MermaidConfig = {
  startOnLoad: false,
  securityLevel: "strict",
  fontFamily: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 16,
    nodeSpacing: 50,
    rankSpacing: 55,
  },
  theme: "base",
  themeVariables: {
    primaryColor: "#4ade80",
    primaryTextColor: "#052e16",
    primaryBorderColor: "#16a34a",
    secondaryColor: "#dbeafe",
    secondaryTextColor: "#1e3a8a",
    secondaryBorderColor: "#3b82f6",
    tertiaryColor: "#fef3c7",
    tertiaryTextColor: "#78350f",
    tertiaryBorderColor: "#f59e0b",
    lineColor: "#64748b",
    textColor: "#0f172a",
    mainBkg: "#ecfdf5",
    nodeBorder: "#16a34a",
    clusterBkg: "#f8fafc",
    titleColor: "#0f172a",
    edgeLabelBackground: "#ffffff",
    fontSize: "14px",
  },
};

export const CODERIDER_MERMAID_DARK_CONFIG: MermaidConfig = {
  ...CODERIDER_MERMAID_CONFIG,
  themeVariables: {
    primaryColor: "#14d1a0",
    primaryTextColor: "#0d1f1a",
    primaryBorderColor: "#0f766e",
    secondaryColor: "#1e3a5f",
    secondaryTextColor: "#dbeafe",
    secondaryBorderColor: "#3b82f6",
    tertiaryColor: "#422006",
    tertiaryTextColor: "#fde68a",
    tertiaryBorderColor: "#d97706",
    lineColor: "#94a3b8",
    textColor: "#e2e8f0",
    mainBkg: "#134e4a",
    nodeBorder: "#14d1a0",
    clusterBkg: "#1e293b",
    titleColor: "#f1f5f9",
    edgeLabelBackground: "#0f172a",
    fontSize: "14px",
  },
};

export function getMermaidConfig(isDark: boolean): MermaidConfig {
  return isDark ? CODERIDER_MERMAID_DARK_CONFIG : CODERIDER_MERMAID_CONFIG;
}
