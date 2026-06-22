"use client";

import ReactMarkdown from "react-markdown";

type MarkdownExplanationProps = {
  content: string;
};

export function MarkdownExplanation({ content }: MarkdownExplanationProps) {
  return (
    <div className="rounded-xl border border-border bg-background p-4 text-base font-normal leading-6 antialiased text-[#1f1f1f] dark:text-[#e3e3e3] shadow-sm [&_code]:rounded-md [&_code]:bg-blue-50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:font-normal [&_code]:text-blue-700 dark:[&_code]:bg-blue-900/30 dark:[&_code]:text-blue-300 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-7 [&_h2]:text-[#1f1f1f] dark:[&_h2]:text-[#e3e3e3] [&_h2]:first:mt-0 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:leading-[26px] [&_h3]:text-[#1f1f1f] dark:[&_h3]:text-[#e3e3e3] [&_li]:my-1.5 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_ol]:pl-5 [&_p]:leading-6 [&_strong]:font-semibold [&_strong]:text-[#1f1f1f] dark:[&_strong]:text-[#e3e3e3] [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
