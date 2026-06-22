import { MAX_ANALYZE_CODE_BYTES } from "@/lib/ai/constants";
import type { ChatContext, ChatMessage, ChatRequestBody } from "@/lib/ai/chat-types";
import { formatFileSize } from "@/lib/file-system/format-bytes";

const MAX_CHAT_MESSAGES = 30;
const MAX_CHAT_MESSAGE_BYTES = MAX_ANALYZE_CODE_BYTES;

type ValidationResult =
  | { success: true; data: ChatRequestBody }
  | { success: false; error: string };

function getByteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

function validateContext(value: unknown): ChatContext | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  const type = record.type;
  const content = record.content;
  const file = record.file;

  if (type !== "code" && type !== "explanation" && type !== "general") {
    return undefined;
  }

  if (typeof content !== "string" || content.trim().length === 0) {
    return undefined;
  }

  if (getByteLength(content) > MAX_CHAT_MESSAGE_BYTES) {
    return undefined;
  }

  if (file !== undefined && typeof file !== "string") {
    return undefined;
  }

  return {
    type,
    content,
    file: typeof file === "string" ? file : undefined,
  };
}

function validateMessage(value: unknown, index: number): ChatMessage | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const role = record.role;
  const content = record.content;

  if (role !== "user" && role !== "ai") {
    return null;
  }

  if (typeof content !== "string" || content.trim().length === 0) {
    return null;
  }

  if (getByteLength(content) > MAX_CHAT_MESSAGE_BYTES) {
    throw new Error(
      `Message ${index + 1} exceeds the maximum size of ${formatFileSize(MAX_CHAT_MESSAGE_BYTES)}.`
    );
  }

  return { role, content: content.trim() };
}

export function validateChatRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return { success: false, error: "Request body must be a JSON object." };
  }

  const record = body as Record<string, unknown>;
  const messages = record.messages;
  const context = validateContext(record.context);

  if (!Array.isArray(messages) || messages.length === 0) {
    return {
      success: false,
      error: "Field `messages` must be a non-empty array.",
    };
  }

  if (messages.length > MAX_CHAT_MESSAGES) {
    return {
      success: false,
      error: `A maximum of ${MAX_CHAT_MESSAGES} messages is allowed per request.`,
    };
  }

  const parsedMessages: ChatMessage[] = [];

  try {
    for (let index = 0; index < messages.length; index += 1) {
      const message = validateMessage(messages[index], index);

      if (!message) {
        return {
          success: false,
          error: `Message ${index + 1} must include a valid role and non-empty content.`,
        };
      }

      parsedMessages.push(message);
    }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "One or more chat messages are invalid.",
    };
  }

  const lastMessage = parsedMessages[parsedMessages.length - 1];

  if (lastMessage.role !== "user") {
    return {
      success: false,
      error: "The last message must be from the user.",
    };
  }

  return {
    success: true,
    data: {
      messages: parsedMessages,
      context,
    },
  };
}
