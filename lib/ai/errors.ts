export type GeminiErrorCode =
  | "missing-key"
  | "quota-exceeded"
  | "network-error"
  | "generation-failed";

export class GeminiError extends Error {
  readonly code: GeminiErrorCode;

  constructor(code: GeminiErrorCode, message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "GeminiError";
    this.code = code;
  }
}

export function isGeminiError(error: unknown): error is GeminiError {
  return error instanceof GeminiError;
}
