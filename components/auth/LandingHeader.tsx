"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";
import { GitBranch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";

export function LandingHeader() {
  if (!isClerkPublishableKeySet()) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Brand />
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm"
            render={<Link href="/workspace" />}
          >
            Open Workspace
          </Button>
        </div>
      </header>
    );
  }

  return <LandingHeaderWithAuth />;
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-sm font-semibold tracking-tight"
    >
      <span className="flex size-8 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
        <GitBranch className="size-4" />
      </span>
      <span>CodeRider</span>
    </Link>
  );
}

function LandingHeaderWithAuth() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Brand />

        <div className="flex min-h-9 items-center gap-2">
          {!isLoaded ? null : isSignedIn ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-full border-slate-200 bg-white px-4 shadow-sm"
                render={<Link href="/workspace" />}
              >
                Open Workspace
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-full px-4"
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="h-9 rounded-full px-4 shadow-sm"
                render={<Link href="/sign-up" />}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
