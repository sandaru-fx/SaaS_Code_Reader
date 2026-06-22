"use client";

import { Boxes, Layers, Sparkles } from "lucide-react";

import type { ProjectOverview as ProjectOverviewData } from "@/lib/ai/project-types";

type ProjectOverviewProps = {
  projectName: string;
  overview: ProjectOverviewData;
};

export function ProjectOverview({ projectName, overview }: ProjectOverviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Sparkles className="size-5" />
        <span className="text-sm font-semibold">Project Overview</span>
      </div>

      <h1 className="text-2xl font-medium tracking-normal text-[#1f1f1f] dark:text-[#e3e3e3]">
        {projectName}
      </h1>
      <p className="mt-2 text-base font-normal leading-6 text-slate-600 dark:text-slate-300">
        {overview.summary}
      </p>

      {overview.techStack.length > 0 ? (
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <Boxes className="size-4 text-slate-500 dark:text-slate-400" />
            <h2 className="text-sm font-semibold">Tech Stack</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {overview.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50">
        <div className="mb-2 flex items-center gap-2 text-slate-700 dark:text-slate-200">
          <Layers className="size-4 text-slate-500 dark:text-slate-400" />
          <h2 className="text-sm font-semibold">Architecture</h2>
        </div>
        <p className="text-sm font-normal leading-6 text-slate-600 dark:text-slate-300">
          {overview.architecture}
        </p>
      </div>
    </section>
  );
}
