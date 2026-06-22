import { GeminiError } from "@/lib/ai/errors";
import { getGeminiModel } from "@/lib/ai/gemini";
import type { AnalyzeProjectRequestBody, AnalyzeProjectResponseBody } from "@/lib/ai/project-types";

const PROJECT_ANALYZE_SYSTEM_PROMPT = `You are CodeRider, an expert software architecture analyst and coding tutor.

Your job is to analyze a project's structure (file tree, package.json, README) and return a structured JSON object with:
1. "overview" — a high-level project summary for a beginner.
2. "learningPath" — a step-by-step syllabus broken into 3-5 logical modules.

Rules:
- Return ONLY valid JSON. No prose before or after the JSON.
- Do not wrap the JSON in markdown code fences.
- The JSON must match this exact shape:
{
  "overview": {
    "summary": "2-3 sentence plain-language summary of what this project does.",
    "techStack": ["Next.js", "TypeScript", "Tailwind CSS"],
    "architecture": "1-2 sentences describing how the project is organized (folders, layers, data flow)."
  },
  "learningPath": [
    {
      "id": "1",
      "title": "Entry Point",
      "description": "Where the application starts and basic layout is defined.",
      "files": [
        { "path": "app/layout.tsx", "name": "layout.tsx", "type": "file" },
        { "path": "app/page.tsx", "name": "page.tsx", "type": "file" }
      ],
      "status": "current"
    }
  ]
}
- "techStack" should list 3-8 key technologies inferred from package.json and file structure.
- The first module's status MUST be "current", and all subsequent modules MUST be "locked".
- Include 1-3 critical files per module.
- Ensure the file paths exactly match the ones provided in the tree structure.
- Group files logically (e.g., Entry Point, Database/Models, Core Logic, UI Components).`;

function buildProjectAnalyzeUserPrompt(request: AnalyzeProjectRequestBody): string {
  return `Project Name: ${request.projectName}

Tree Structure:
${request.treeStructure}

${request.packageJson ? `package.json:\n\`\`\`json\n${request.packageJson}\n\`\`\`\n` : ""}
${request.readme ? `README.md:\n\`\`\`markdown\n${request.readme}\n\`\`\`\n` : ""}

Analyze the project structure above and generate a learning path syllabus in JSON format.`;
}

export async function analyzeProject(
  request: AnalyzeProjectRequestBody
): Promise<AnalyzeProjectResponseBody> {
  try {
    const model = getGeminiModel({ systemInstruction: PROJECT_ANALYZE_SYSTEM_PROMPT });
    const prompt = buildProjectAnalyzeUserPrompt(request);
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    if (!text) {
      throw new GeminiError("generation-failed", "Gemini returned an empty response.");
    }

    let parsed: unknown;
    try {
      // Remove markdown code fences if Gemini included them despite instructions
      const cleanedText = text.replace(/^```(json)?\n?/i, "").replace(/\n```$/i, "");
      parsed = JSON.parse(cleanedText);
    } catch {
      throw new GeminiError("generation-failed", "Failed to parse JSON response from Gemini.");
    }

    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("learningPath" in parsed) ||
      !Array.isArray((parsed as Record<string, unknown>).learningPath) ||
      !("overview" in parsed) ||
      typeof (parsed as Record<string, unknown>).overview !== "object"
    ) {
      throw new GeminiError("generation-failed", "Invalid response format from Gemini.");
    }

    const record = parsed as Record<string, unknown>;
    const overview = record.overview as Record<string, unknown>;

    if (
      typeof overview.summary !== "string" ||
      !Array.isArray(overview.techStack) ||
      typeof overview.architecture !== "string"
    ) {
      throw new GeminiError("generation-failed", "Invalid overview format from Gemini.");
    }

    return parsed as AnalyzeProjectResponseBody;
  } catch (error) {
    if (error instanceof GeminiError) {
      throw error;
    }
    throw new GeminiError("generation-failed", "Failed to analyze project.", { cause: error });
  }
}
