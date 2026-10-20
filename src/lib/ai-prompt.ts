import { DEFAULT_POINTS_PER_QUESTION, OPTIONS_COUNT } from "./constants";

export const assistantUrls: Record<AiAssistant, string> = {
  ChatGPT: "https://chatgpt.com/",
  Claude: "https://claude.ai/new",
  Gemini: "https://gemini.google.com/app",
};

export function buildAssistantUrl(assistant: AiAssistant, prompt: string): string {
  const url = new URL(assistantUrls[assistant]);
  if (assistant === "ChatGPT") url.searchParams.set("q", prompt);
  return url.toString();
}

export function buildExternalAiPrompt({
  context,
  questionCount,
  usePdf,
}: ExternalAiPromptOptions): string {
  const source = usePdf
    ? "Use the lesson PDF I attach after sending this prompt."
    : `Use this lesson context:\n\n${context.trim() || "<paste lesson context here>"}`;

  return `Create a quiz from the lesson material below.

${source}

Return exactly ${questionCount} questions. Return only valid JSON with no Markdown fences, commentary, or extra keys. Use this exact structure:
{
  "title": "A concise quiz title",
  "description": "A one-sentence description",
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctOption": 0,
      "points": ${DEFAULT_POINTS_PER_QUESTION}
    }
  ]
}

Every question must have exactly ${OPTIONS_COUNT} distinct, non-empty choices. correctOption must be the zero-based index of the correct choice (0, 1, 2, or 3). Set points to ${DEFAULT_POINTS_PER_QUESTION} for every question.`;
}
