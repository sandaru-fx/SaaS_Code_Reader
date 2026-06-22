"use client";

import { Boxes, Layers, Sparkles } from "lucide-react";

import type { ProjectOverview as ProjectOverviewData } from "@/lib/ai/project-types";

type ProjectOverviewProps = {
  projectName: string;
  overview: ProjectOverviewData;
};

export function ProjectOverview({ projectName, overview }: ProjectOverviewProps) {
  return (
    <section className="premium-card rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:bg-transparent">
      <div className="mb-5 flex items-center gap-2.5 text-blue-600 premium-accent">
        <Sparkles className="size-5" strokeWidth={1.5} />
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          Project Overview
        </span>
      </div>

      <h1 className="text-[28px] font-medium leading-tight tracking-tight text-[#1f1f1f] dark:text-[#e3e3e3]">
        {projectName}
      </h1>
      <p className="mt-3 text-base font-normal leading-7 text-slate-600 dark:text-[#e3e3e3]/70">
        {overview.summary}
      </p>

      {overview.techStack.length > 0 ? (
        <div className="mt-7">
          <div className="mb-3 flex items-center gap-2 text-slate-700 dark:text-[#e3e3e3]/80">
            <Boxes className="size-4 text-slate-500 dark:text-[#e3e3e3]/50" strokeWidth={1.5} />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">
              Tech Stack
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {overview.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition-colors premium-pill dark:px-3.5 dark:py-1.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50/80 p-5 dark:border-white/[0.06] dark:bg-white/[0.02]">
        <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-[#e3e3e3]/80">
          <Layers className="size-4 text-slate-500 dark:text-[#e3e3e3]/50" strokeWidth={1.5} />
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">
            Architecture
          </h2>
        </div>
        <p className="text-sm font-normal leading-7 text-slate-600 dark:text-[#e3e3e3]/70">
          {overview.architecture}
        </p>
      </div>
    </section>
  );
}
