"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2, Code2, Sparkles } from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { getAnalyzeErrorMessage } from "@/lib/ai/get-analyze-error-message";
import { MarkdownExplanation } from "@/components/workspace/MarkdownExplanation";
import type { ChatMessage, ChatContext } from "@/lib/ai/chat-types";

function getContextLabel(type: ChatContext["type"]) {
  switch (type) {
    case "code":
      return "Selected code loaded as context";
    case "explanation":
      return "Explanation loaded as context";
    default:
      return "Workspace context loaded";
  }
}

export function ChatPanel() {
  const { isChatOpen, closeChat, chatContext } = useWorkspace();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isChatOpen) {
      setMessages([]);
      setInput("");
      setIsLoading(false);
    }
  }, [isChatOpen]);

  if (!isChatOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];

    setInput("");
    setMessages(nextMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          context: chatContext ?? undefined,
        }),
      });

      const data = (await response.json()) as
        | { message?: string; error?: string };

      if (!response.ok) {
        throw new Error(getAnalyzeErrorMessage(response.status, data.error));
      }

      if (!data.message?.trim()) {
        throw new Error("Chat returned an invalid response.");
      }

      setMessages((prev) => [...prev, { role: "ai", content: data.message! }]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Sorry, I encountered an error while processing your request.";

      setMessages((prev) => [...prev, { role: "ai", content: message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col border-l border-slate-200 bg-white dark:border-white/[0.06] dark:bg-[#121212]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/50 px-5 py-4 dark:border-white/[0.06] dark:bg-[#121212]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-[#14d1a0]/15 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/25">
            <Bot className="h-4 w-4" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-[#e3e3e3]">
            AI Chat
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:text-[#e3e3e3]/55 dark:hover:bg-white/[0.05] dark:hover:text-[#e3e3e3]"
          onClick={closeChat}
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </Button>
      </div>

      {chatContext ? (
        <div className="border-b border-blue-100 bg-blue-50/80 px-5 py-3 dark:border-[#14d1a0]/15 dark:bg-[#14d1a0]/[0.06]">
          <div className="flex items-start gap-2">
            {chatContext.type === "code" ? (
              <Code2 className="mt-0.5 size-4 shrink-0 text-blue-600 premium-accent" strokeWidth={1.5} />
            ) : (
              <Sparkles className="mt-0.5 size-4 shrink-0 text-blue-600 premium-accent" strokeWidth={1.5} />
            )}
            <div className="min-w-0">
              <p className="text-xs font-medium text-blue-800 dark:text-[#14d1a0]">
                {getContextLabel(chatContext.type)}
              </p>
              <p className="mt-1 line-clamp-3 text-xs text-blue-700/80 dark:text-[#e3e3e3]/55">
                {chatContext.content}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-3 text-center text-slate-500 dark:text-[#e3e3e3]/55">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/[0.04] dark:border dark:border-white/[0.06]">
              <Bot className="h-6 w-6 text-slate-400 premium-accent" strokeWidth={1.25} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-[#e3e3e3]">
                How can I help?
              </p>
              <p className="mt-1 max-w-[240px] text-xs leading-5 dark:text-[#e3e3e3]/45">
                Ask questions about your code, architecture, or request a simpler
                explanation.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white dark:bg-white/[0.08] dark:text-[#e3e3e3]"
                    : "bg-blue-100 text-blue-600 dark:bg-[#14d1a0]/15 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/25"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="h-4 w-4" strokeWidth={1.5} />
                ) : (
                  <Bot className="h-4 w-4" strokeWidth={1.5} />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-slate-900 text-white dark:bg-[#14d1a0]/15 dark:text-[#e3e3e3] dark:border dark:border-[#14d1a0]/25"
                    : "rounded-tl-sm bg-slate-100 text-slate-900 dark:bg-white/[0.04] dark:text-[#e3e3e3] dark:border dark:border-white/[0.06]"
                }`}
              >
                {msg.role === "ai" ? (
                  <MarkdownExplanation content={msg.content} variant="inline" />
                ) : (
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        {isLoading ? (
          <div className="flex flex-row gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-[#14d1a0]/15 dark:text-[#14d1a0] dark:border dark:border-[#14d1a0]/25">
              <Bot className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-slate-900 dark:bg-white/[0.04] dark:text-[#e3e3e3] dark:border dark:border-white/[0.06]">
              <Loader2 className="h-4 w-4 animate-spin text-slate-500 dark:text-[#14d1a0]" />
              <span className="text-sm text-slate-500 dark:text-[#e3e3e3]/55">Thinking...</span>
            </div>
          </div>
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200 bg-white p-4 dark:border-white/[0.06] dark:bg-[#121212]">
        <div className="relative flex items-end gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-white/[0.08] dark:bg-white/[0.03] dark:focus-within:border-[#14d1a0]/40 dark:focus-within:ring-[#14d1a0]/20">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="max-h-32 min-h-[40px] w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 dark:text-[#e3e3e3] dark:placeholder:text-[#e3e3e3]/35"
            rows={1}
          />
          <Button
            size="icon"
            className="mb-1 mr-1 h-8 w-8 shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 premium-btn-primary"
            onClick={() => void handleSend()}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400 dark:text-[#e3e3e3]/35">
            Shift + Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}
