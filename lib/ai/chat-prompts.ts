import type { ChatContext } from "@/lib/ai/chat-types";

export const CHAT_SYSTEM_PROMPT = `You are CodeRider, a friendly and expert AI coding tutor.

Your job is to help developers understand code, architecture, and explanations in plain language.

Rules:
- Be concise but thorough. Use short paragraphs and bullet points when helpful.
- Use Markdown for formatting when it improves readability.
- When referencing code, use fenced code blocks with the correct language when possible.
- If the user asks about a provided code snippet or explanation, ground your answer in that context.
- If something is unclear from the context, say what you can infer and what would need more information.
- Do not invent files, APIs, or behavior that are not supported by the provided context.
- Prefer teaching: explain the "why", not just the "what".`;

export function buildChatSystemInstruction(context?: ChatContext): string {
  if (!context) {
    return CHAT_SYSTEM_PROMPT;
  }

  const fileLabel = context.file ? `\nFile: ${context.file}` : "";

  if (context.type === "code") {
    return `${CHAT_SYSTEM_PROMPT}

The user opened chat while reviewing this code snippet:${fileLabel}

\`\`\`
${context.content}
\`\`\``;
  }

  if (context.type === "explanation") {
    return `${CHAT_SYSTEM_PROMPT}

The user opened chat to ask follow-up questions about this prior explanation:${fileLabel}

${context.content}`;
  }

  return `${CHAT_SYSTEM_PROMPT}

Additional context from the workspace:

${context.content}`;
}
