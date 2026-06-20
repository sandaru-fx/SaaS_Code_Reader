export function getAnalyzeErrorMessage(
  status: number,
  serverError?: string
): string {
  if (serverError?.trim()) {
    return serverError;
  }

  switch (status) {
    case 401:
      return "Please sign in to analyze code.";
    case 429:
      return "AI quota exceeded. Please try again in a few minutes.";
    case 502:
      return "Could not reach the AI service. Check your connection and try again.";
    case 503:
      return "AI analysis is unavailable right now. Please try again later.";
    case 500:
      return "Something went wrong while analyzing the code.";
    default:
      return "Analysis failed. Please try again.";
  }
}
