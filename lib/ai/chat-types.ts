export type ChatMessageRole = "user" | "ai";

export type ChatMessage = {
  role: ChatMessageRole;
  content: string;
};

export type ChatContext = {
  type: "code" | "explanation" | "general";
  content: string;
  file?: string;
};

export type ChatRequestBody = {
  messages: ChatMessage[];
  context?: ChatContext;
};

export type ChatResponseBody = {
  message: string;
};

export type ChatErrorResponse = {
  error: string;
};

export type ChatHealthResponse = {
  status: "ok";
  service: "chat";
  geminiConfigured: boolean;
};
