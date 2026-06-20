import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to CodeRider and analyze your code visually.",
};

export default function SignInPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "border border-border bg-card shadow-none",
          },
        }}
      />
    </div>
  );
}
