import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a CodeRider account and start analyzing code visually.",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <SignUp
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
