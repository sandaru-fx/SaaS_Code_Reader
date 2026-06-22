import Link from "next/link";
import { GitBranch } from "lucide-react";

import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ title, description, children }: AuthShellProps) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#f8fafc,#eef2f7)]">
      <header className="px-6 py-5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-slate-900"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
            <GitBranch className="size-4" />
          </span>
          CodeRider
        </Link>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="mb-8 max-w-md text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
