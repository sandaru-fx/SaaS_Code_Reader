import { GeminiError } from "@/lib/ai/errors";
import { buildChatSystemInstruction } from "@/lib/ai/chat-prompts";
import type { ChatRequestBody, ChatResponseBody } from "@/lib/ai/chat-types";
import { getGeminiModel } from "@/lib/ai/gemini";

function mapGeminiFailure(error: unknown): GeminiError {
  if (error instanceof GeminiError) {
    return error;
  }

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);

  if (
    message.includes("quota") ||
    message.includes("rate limit") ||
    message.includes("429")
  ) {
    return new GeminiError(
      "quota-exceeded",
      "Gemini API quota exceeded. Please try again later."
    );
  }

  if (
    message.includes("econnreset") ||
    message.includes("enotfound") ||
    message.includes("etimedout") ||
    message.includes("network request failed")
  ) {
    return new GeminiError(
      "network-error",
      "Unable to reach the Gemini API. Check your connection and try again."
    );
  }

  return new GeminiError(
    "generation-failed",
    "Gemini failed to generate a chat response.",
    { cause: error }
  );
}

function toGeminiHistory(messages: ChatRequestBody["messages"]) {
  return messages.slice(0, -1).map((message) => ({
    role: message.role === "user" ? ("user" as const) : ("model" as const),
    parts: [{ text: message.content }],
  }));
}

export async function sendChatMessage(
  request: ChatRequestBody
): Promise<ChatResponseBody> {
  const lastMessage = request.messages[request.messages.length - 1];

  if (!lastMessage || lastMessage.role !== "user") {
    throw new GeminiError(
      "generation-failed",
      "The latest chat message must be from the user."
    );
  }

  try {
    const model = getGeminiModel({
      systemInstruction: buildChatSystemInstruction(request.context),
    });

    const history = toGeminiHistory(request.messages);
    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const text = result.response.text().trim();

    if (!text) {
      throw new GeminiError(
        "generation-failed",
        "Gemini returned an empty chat response."
      );
    }

    return { message: text };
  } catch (error) {
    throw mapGeminiFailure(error);
  }
}
