"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type WorkspaceErrorBoundaryProps = {
  children: ReactNode;
};

type WorkspaceErrorBoundaryState = {
  hasError: boolean;
};

export class WorkspaceErrorBoundary extends Component<
  WorkspaceErrorBoundaryProps,
  WorkspaceErrorBoundaryState
> {
  state: WorkspaceErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): WorkspaceErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Workspace error boundary caught:", error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
          <AlertCircle className="size-10 text-destructive/70" />
          <div className="max-w-md space-y-1">
            <h2 className="text-lg font-semibold">Something went wrong</h2>
            <p className="text-sm text-muted-foreground">
              The workspace hit an unexpected error. Reload the page to try
              again.
            </p>
          </div>
          <Button onClick={this.handleReload}>Reload workspace</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
