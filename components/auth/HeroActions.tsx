"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, ClipboardPaste } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";

function PublicWorkspaceActions() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        size="lg"
        className="h-12 rounded-full px-6 text-sm shadow-lg shadow-slate-950/15"
        nativeButton={false}
        render={<Link href="/workspace" />}
      >
        Open Workspace Free
        <ArrowRight />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-12 rounded-full border-slate-200 bg-white/80 px-6 text-sm shadow-sm backdrop-blur"
        nativeButton={false}
        render={<Link href="/workspace?mode=paste" />}
      >
        <ClipboardPaste />
        Quick Paste
      </Button>
    </div>
  );
}

export function HeroActions() {
  if (!isClerkPublishableKeySet()) {
    return <PublicWorkspaceActions />;
  }

  return <HeroActionsWithAuth />;
}

function HeroActionsWithAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-10" aria-hidden="true" />;
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          size="lg"
          className="h-12 rounded-full px-6 text-sm shadow-lg shadow-slate-950/15"
          nativeButton={false}
          render={<Link href="/workspace" />}
        >
          Open Workspace Free
          <ArrowRight />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="h-12 rounded-full border-slate-200 bg-white/80 px-6 text-sm shadow-sm backdrop-blur"
          nativeButton={false}
          render={<Link href="/workspace?mode=paste" />}
        >
          <ClipboardPaste />
          Quick Paste
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        size="lg"
        className="h-12 rounded-full px-6 text-sm shadow-lg shadow-slate-950/15"
        nativeButton={false}
        render={<Link href="/sign-up" />}
      >
        Get Started
        <ArrowRight />
      </Button>
      <Button
        size="lg"
        variant="outline"
        className="h-12 rounded-full border-slate-200 bg-white/80 px-6 text-sm shadow-sm backdrop-blur"
        nativeButton={false}
        render={<Link href="/sign-in" />}
      >
        Sign In
      </Button>
    </div>
  );
}
