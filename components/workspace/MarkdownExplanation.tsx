"use client";

import ReactMarkdown from "react-markdown";

type MarkdownExplanationProps = {
  content: string;
  variant?: "card" | "inline";
};

const cardClassName =
  "rounded-xl border border-border bg-background p-4 text-base font-normal leading-6 antialiased text-[#1f1f1f] shadow-sm dark:text-[#e3e3e3] [&_code]:rounded-md [&_code]:bg-blue-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:font-normal [&_code]:text-blue-700 dark:[&_code]:bg-blue-900/30 dark:[&_code]:text-blue-300 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-7 [&_h2]:text-[#1f1f1f] dark:[&_h2]:text-[#e3e3e3] [&_h2]:first:mt-0 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:leading-[26px] [&_h3]:text-[#1f1f1f] dark:[&_h3]:text-[#e3e3e3] [&_li]:my-1.5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p]:leading-6 [&_strong]:font-semibold [&_strong]:text-[#1f1f1f] dark:[&_strong]:text-[#e3e3e3] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5";

const inlineClassName =
  "text-sm font-normal leading-6 antialiased text-inherit [&_code]:rounded-md [&_code]:bg-blue-50 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-blue-700 dark:[&_code]:bg-blue-900/40 dark:[&_code]:text-blue-300 [&_h2]:mt-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:first:mt-0 [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-medium [&_li]:my-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-4 [&_p]:my-1 [&_p]:leading-6 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900/90 [&_pre]:p-3 [&_pre]:text-xs [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-100 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-4";

export function MarkdownExplanation({
  content,
  variant = "card",
}: MarkdownExplanationProps) {
  return (
    <div className={variant === "inline" ? inlineClassName : cardClassName}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
