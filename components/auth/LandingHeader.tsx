"use client";

import Link from "next/link";
import { useAuth, UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function LandingHeader() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <span className="text-sm font-semibold tracking-tight">CodeRider</span>

      <div className="flex min-h-8 items-center gap-2">
        {!isLoaded ? null : isSignedIn ? (
          <>
            <Button variant="outline" size="sm" render={<Link href="/workspace" />}>
              Open Workspace
            </Button>
            <UserButton />
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" render={<Link href="/sign-in" />}>
              Sign In
            </Button>
            <Button size="sm" render={<Link href="/sign-up" />}>
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
