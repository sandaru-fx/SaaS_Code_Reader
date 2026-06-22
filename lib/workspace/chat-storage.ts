import type { ChatMessage } from "@/lib/ai/chat-types";

export const CHAT_STORAGE_PREFIX = "coderider-chat-history";
export const MAX_STORED_CHAT_MESSAGES = 50;

export type StoredChatMessage = ChatMessage & {
  id: string;
};

type StoredChatSession = {
  messages: StoredChatMessage[];
  updatedAt: number;
};

function getStorageKey(scope: string): string {
  const normalized = scope.trim().toLowerCase() || "default";
  return `${CHAT_STORAGE_PREFIX}:${normalized}`;
}

function isStoredChatMessage(value: unknown): value is StoredChatMessage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    (record.role === "user" || record.role === "ai") &&
    typeof record.content === "string" &&
    record.content.trim().length > 0
  );
}

export function readChatHistory(scope: string): StoredChatMessage[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(scope));
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredChatSession;
    if (!parsed?.messages || !Array.isArray(parsed.messages)) {
      return [];
    }

    return parsed.messages.filter(isStoredChatMessage).slice(-MAX_STORED_CHAT_MESSAGES);
  } catch {
    return [];
  }
}

export function storeChatHistory(
  scope: string,
  messages: StoredChatMessage[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  const payload: StoredChatSession = {
    messages: messages.slice(-MAX_STORED_CHAT_MESSAGES),
    updatedAt: Date.now(),
  };

  try {
    window.localStorage.setItem(getStorageKey(scope), JSON.stringify(payload));
  } catch {
    // Ignore quota errors — chat still works in memory.
  }
}

export function clearChatHistory(scope: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getStorageKey(scope));
}

export function createChatMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function toApiMessages(messages: StoredChatMessage[]): ChatMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}
