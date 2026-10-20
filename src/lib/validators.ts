import { z } from "zod";
import {
  DEFAULT_AI_QUESTIONS,
  DEFAULT_POINTS_PER_QUESTION,
  MAX_AI_QUESTIONS,
  MAX_CONTEXT_LENGTH,
  MAX_POINTS,
  MAX_QUESTIONS,
  MIN_AI_QUESTIONS,
  MIN_CONTEXT_LENGTH,
  MIN_POINTS,
  MIN_QUESTIONS,
  STORAGE_VERSION,
} from "./constants";

export const nonEmptyText = z.string().trim().min(1, "Cannot be empty");

export const quizImportQuestionSchema = z.object({
  question: nonEmptyText,
  options: z.tuple([nonEmptyText, nonEmptyText, nonEmptyText, nonEmptyText]),
  correctOption: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  points: z.number().int().min(MIN_POINTS).max(MAX_POINTS).optional(),
});

export const quizImportPayloadSchema = z.object({
  title: nonEmptyText.optional(),
  description: nonEmptyText.optional(),
  questions: z.array(quizImportQuestionSchema).min(MIN_QUESTIONS).max(MAX_QUESTIONS),
});

export const quizQuestionSchema = quizImportQuestionSchema.extend({
  id: nonEmptyText,
  points: z.number().int().min(MIN_POINTS).max(MAX_POINTS),
});

export const quizDefinitionSchema = z.object({
  id: nonEmptyText,
  title: nonEmptyText,
  description: nonEmptyText,
  source: z.enum(["built-in", "custom"]),
  createdAt: z.string().nullable(),
  questions: z.array(quizQuestionSchema).min(MIN_QUESTIONS).max(MAX_QUESTIONS),
});

export const persistedQuizStateSchema = z.object({
  version: z.literal(STORAGE_VERSION),
  customQuizzes: z.array(quizDefinitionSchema.extend({ source: z.literal("custom") })),
  highScores: z.record(z.string(), z.number().nonnegative()),
});

export function createAiQuizSchema(questionCount: number) {
  return z.object({
    title: nonEmptyText,
    description: nonEmptyText,
    questions: z
      .array(
        quizImportQuestionSchema.extend({
          points: z.literal(DEFAULT_POINTS_PER_QUESTION),
        }),
      )
      .length(questionCount),
  });
}

export const generateQuizRequestSchema = z.object({
  context: z.string().trim().min(MIN_CONTEXT_LENGTH).max(MAX_CONTEXT_LENGTH),
  questionCount: z
    .number()
    .int()
    .min(MIN_AI_QUESTIONS)
    .max(MAX_AI_QUESTIONS)
    .default(DEFAULT_AI_QUESTIONS),
});

export const quizImportFormSchema = z.object({
  jsonText: z.string().trim().min(1, "Paste quiz JSON before previewing it."),
});

export const aiGeneratorFormSchema = z
  .object({
    mode: z.enum(["direct", "external"]),
    context: z.string().max(MAX_CONTEXT_LENGTH, {
      error: `Lesson context must be ${MAX_CONTEXT_LENGTH.toLocaleString()} characters or fewer.`,
    }),
    questionCount: z
      .number()
      .int("Use a whole number of questions.")
      .min(MIN_AI_QUESTIONS)
      .max(MAX_AI_QUESTIONS),
    usePdf: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.mode === "direct" && values.context.trim().length < MIN_CONTEXT_LENGTH) {
      context.addIssue({
        code: "custom",
        path: ["context"],
        message: `Add at least ${MIN_CONTEXT_LENGTH} characters of lesson context.`,
      });
    }
  });
