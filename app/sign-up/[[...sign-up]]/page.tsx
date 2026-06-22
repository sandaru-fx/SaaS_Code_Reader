import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth/AuthShell";
import { clerkAppearance } from "@/lib/clerk/appearance";
import { isClerkPublishableKeySet } from "@/lib/clerk/is-configured";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a CodeRider account and start analyzing code visually.",
};

export default function SignUpPage() {
  if (!isClerkPublishableKeySet()) {
    redirect("/workspace");
  }

  return (
    <AuthShell
      title="Create your account"
      description="Free to start — analyze code, save diagrams, and pick up where you left off."
    >
      <SignUp appearance={clerkAppearance} />
    </AuthShell>
  );
}
