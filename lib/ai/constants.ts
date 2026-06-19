import { MAX_FILE_SIZE_BYTES } from "@/lib/file-system/constants";

export const MAX_ANALYZE_CODE_BYTES = MAX_FILE_SIZE_BYTES;

export const MOCK_ANALYZE_RESPONSE = {
  explanation:
    "## Analysis Pending\n\nGemini integration arrives in Day 4 Kota 2. This is a mock response confirming the `/api/analyze` route is working.",
  mermaid: "graph TD\n  A[Selected Code] --> B[Analyze API]\n  B --> C[Gemini - Coming Soon]",
} as const;
