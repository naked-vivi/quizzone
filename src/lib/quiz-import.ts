import { type z } from "zod";
import {
  DEFAULT_POINTS_PER_QUESTION,
  FALLBACK_QUIZ_DESCRIPTION,
  FALLBACK_QUIZ_TITLE,
} from "./constants";
import { quizImportPayloadSchema } from "./validators";

export const quizTemplate: Required<QuizImportPayload> = {
  title: "JavaScript Fundamentals",
  description: "A short quiz about JavaScript basics.",
  questions: [
    {
      question: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "define", "static"],
      correctOption: 1,
      points: DEFAULT_POINTS_PER_QUESTION,
    },
    {
      question: "What does Array.isArray([]) return?",
      options: ["true", "false", "undefined", "null"],
      correctOption: 0,
      points: DEFAULT_POINTS_PER_QUESTION,
    },
  ],
};

function createId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

export function stripMarkdownCodeFence(value: string): string {
  const trimmed = value.trim();
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return match ? match[1].trim() : trimmed;
}

function formatValidationError(error: z.ZodError): string {
  const first = error.issues[0];
  const path = first.path.length ? `${first.path.join(".")}: ` : "";
  return `${path}${first.message}`;
}

export function parseQuizJson(value: string): QuizImportPayload {
  let parsed: unknown;

  try {
    parsed = JSON.parse(stripMarkdownCodeFence(value));
  } catch {
    throw new Error("This is not valid JSON. Check commas, quotes, and brackets.");
  }

  const result = quizImportPayloadSchema.safeParse(parsed);
  if (!result.success) throw new Error(formatValidationError(result.error));
  return result.data;
}

export function filenameToTitle(filename: string): string {
  const base = filename.replace(/\.json$/i, "").replace(/[-_]+/g, " ").trim();
  return base || FALLBACK_QUIZ_TITLE;
}

export function createCustomQuiz(
  payload: QuizImportPayload,
  fallbackTitle = FALLBACK_QUIZ_TITLE,
): QuizDefinition {
  return {
    id: createId(),
    title: payload.title?.trim() || fallbackTitle,
    description: payload.description?.trim() || FALLBACK_QUIZ_DESCRIPTION,
    source: "custom",
    createdAt: new Date().toISOString(),
    questions: payload.questions.map((question) => ({
      ...question,
      id: createId(),
      points: question.points ?? DEFAULT_POINTS_PER_QUESTION,
    })),
  };
}

export function serializeQuizTemplate(): string {
  return `${JSON.stringify(quizTemplate, null, 2)}\n`;
}
