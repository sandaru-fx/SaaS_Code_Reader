"use client";

import { useCallback, useEffect, useState } from "react";

import type { ChatMessageRole } from "@/lib/ai/chat-types";
import {
  clearChatHistory,
  createChatMessageId,
  readChatHistory,
  storeChatHistory,
  type StoredChatMessage,
} from "@/lib/workspace/chat-storage";

export function useChatHistory(scope: string) {
  const [messages, setMessages] = useState<StoredChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMessages(readChatHistory(scope));
      setHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [scope]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    storeChatHistory(scope, messages);
  }, [scope, messages, hydrated]);

  const appendMessage = useCallback(
    (role: ChatMessageRole, content: string) => {
      setMessages((current) => [
        ...current,
        { id: createChatMessageId(), role, content },
      ]);
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    clearChatHistory(scope);
  }, [scope]);

  return {
    messages,
    setMessages,
    appendMessage,
    clearMessages,
    hydrated,
  };
}
