import type { Metadata } from "next";
import Link from "next/link";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles your code, data, and authentication.`,
};

const sections = [
  {
    title: "Local files stay on your device",
    body: "When you use folder mode, files are read through your browser's File System API. CodeRider does not upload your project files to our servers or store them in a database.",
  },
  {
    title: "Code sent for AI analysis",
    body: "When you click Analyze, the selected file or pasted snippet is sent to our server and forwarded to Google Gemini to generate explanations and Mermaid flowcharts. Only the content you choose to analyze is transmitted.",
  },
  {
    title: "Authentication",
    body: "If sign-in is enabled, authentication is handled by Clerk. Account data (email, profile) is managed according to Clerk's privacy policy. We do not store passwords on CodeRider servers.",
  },
  {
    title: "Logs and hosting",
    body: "The app is hosted on Vercel. Standard request logs (IP, user agent, timestamps) may be collected by the hosting provider for security and reliability. We do not sell your data.",
  },
  {
    title: "Your choices",
    body: "You control what code is analyzed. Do not paste secrets, API keys, or credentials into the workspace. You can use folder mode without creating an account when demo mode is active.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            {SITE_NAME}
          </Link>
          <Link
            href="/workspace"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Open workspace
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last updated: June 2026. This is a simple MVP policy for {SITE_NAME}.
          </p>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-medium">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
