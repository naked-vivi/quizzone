import { z } from "zod";
import type { QuizDefinition, QuizImportPayload } from "../type";
import { quizImportPayloadSchema } from "./quizSchema";

export const MAX_QUIZ_FILE_SIZE = 1024 * 1024;

export const quizTemplate: Required<QuizImportPayload> = {
  title: "JavaScript Fundamentals",
  description: "A short quiz about JavaScript basics.",
  questions: [
    {
      question: "Which keyword declares a block-scoped variable?",
      options: ["var", "let", "define", "static"],
      correctOption: 1,
      points: 10,
    },
    {
      question: "What does Array.isArray([]) return?",
      options: ["true", "false", "undefined", "null"],
      correctOption: 0,
      points: 10,
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
  return base || "Custom Quiz";
}

export function createCustomQuiz(
  payload: QuizImportPayload,
  fallbackTitle = "Custom Quiz",
): QuizDefinition {
  return {
    id: createId(),
    title: payload.title?.trim() || fallbackTitle,
    description: payload.description?.trim() || "Imported quiz",
    source: "custom",
    createdAt: new Date().toISOString(),
    questions: payload.questions.map((question) => ({
      ...question,
      id: createId(),
      points: question.points ?? 10,
    })),
  };
}

export function serializeQuizTemplate(): string {
  return `${JSON.stringify(quizTemplate, null, 2)}\n`;
}
