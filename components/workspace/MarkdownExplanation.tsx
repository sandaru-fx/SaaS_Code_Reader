"use client";

import ReactMarkdown from "react-markdown";

type MarkdownExplanationProps = {
  content: string;
};

export function MarkdownExplanation({ content }: MarkdownExplanationProps) {
  return (
    <div className="rounded-lg border border-border bg-background p-3 text-sm leading-6 text-foreground/90 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:font-mono [&_code]:text-xs [&_h2]:mt-4 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:first:mt-0 [&_h3]:mt-3 [&_h3]:text-sm [&_h3]:font-medium [&_li]:my-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:leading-6 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
