import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk/appearance";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to CodeRider and analyze your code visually.",
};

export default function SignInPage() {
  if (!isClerkPublishableKeySet()) {
    redirect("/workspace");
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to save your analysis history and use the workspace."
    >
      <SignIn appearance={clerkAppearance} />
    </AuthShell>
  );
}
