"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";

export function ChatPanel() {
  const { isChatOpen, closeChat, chatContext } = useWorkspace();
  const [messages, setMessages] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle initial context if provided when opening
  useEffect(() => {
    if (isChatOpen && chatContext && messages.length === 0) {
      let initialMessage = "";
      if (chatContext.type === "code") {
        initialMessage = `I have a question about this code:\n\`\`\`\n${chatContext.content}\n\`\`\``;
      } else if (chatContext.type === "explanation") {
        initialMessage = `I have a follow-up question about this explanation:\n"${chatContext.content}"`;
      }
      
      if (initialMessage) {
        setMessages([{ role: "user", content: initialMessage }]);
        // In a real implementation, we would auto-trigger the AI response here
        // For now, we'll just simulate it or wait for the user to type more
      }
    }
  }, [isChatOpen, chatContext, messages.length]);

  if (!isChatOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // TODO: Connect to actual /api/chat endpoint
      // Simulating API call for now
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "This is a simulated response. The backend API is not yet connected." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I encountered an error while processing your request." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
            <Bot className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">AI Chat</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          onClick={closeChat}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <Bot className="h-6 w-6 text-slate-400 dark:text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">How can I help?</p>
              <p className="text-xs mt-1 max-w-[200px]">Ask questions about your code, architecture, or get explanations.</p>
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
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                }`}
              >
                {msg.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div
                className={`rounded-2xl px-4 py-2.5 max-w-[85%] text-sm ${
                  msg.role === "user"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 rounded-tr-sm"
                    : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-tl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 rounded-tl-sm flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
              <span className="text-sm text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="relative flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-blue-500">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="max-h-32 min-h-[40px] w-full resize-none bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 dark:text-slate-100 dark:placeholder:text-slate-500"
            rows={1}
          />
          <Button
            size="icon"
            className="mb-1 mr-1 h-8 w-8 shrink-0 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-center">
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Shift + Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
}
