"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { ArrowRight, ClipboardPaste } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroActions() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <div className="h-10" aria-hidden="true" />;
  }

  if (isSignedIn) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="lg" render={<Link href="/workspace" />}>
          Open Workspace
          <ArrowRight />
        </Button>
        <Button
          size="lg"
          variant="outline"
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
      <Button size="lg" render={<Link href="/sign-up" />}>
        Get Started
        <ArrowRight />
      </Button>
      <Button size="lg" variant="outline" render={<Link href="/sign-in" />}>
        Sign In
      </Button>
    </div>
  );
}
