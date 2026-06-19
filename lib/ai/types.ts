export type AnalyzeRequestBody = {
  code: string;
  language: string;
  fileName?: string;
};

export type AnalyzeResponseBody = {
  explanation: string;
  mermaid: string;
};

export type AnalyzeErrorResponse = {
  error: string;
};

export type AnalyzeHealthResponse = {
  status: "ok";
  service: "analyze";
  geminiConfigured: boolean;
};
