import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Workspace",
  description:
    "Analyze your codebase with AI-generated flowcharts and logic explanations.",
};

export default function WorkspaceRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
