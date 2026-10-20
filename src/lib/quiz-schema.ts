import { z } from "zod";

const nonEmptyText = z.string().trim().min(1, "Cannot be empty");

export const quizImportQuestionSchema = z.object({
  question: nonEmptyText,
  options: z.tuple([nonEmptyText, nonEmptyText, nonEmptyText, nonEmptyText]),
  correctOption: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  points: z.number().int().min(1).max(100).optional(),
});

export const quizImportPayloadSchema = z.object({
  title: nonEmptyText.optional(),
  description: nonEmptyText.optional(),
  questions: z.array(quizImportQuestionSchema).min(1).max(100),
});

export const quizQuestionSchema = quizImportQuestionSchema.extend({
  id: nonEmptyText,
  points: z.number().int().min(1).max(100),
});

export const quizDefinitionSchema = z.object({
  id: nonEmptyText,
  title: nonEmptyText,
  description: nonEmptyText,
  source: z.enum(["built-in", "custom"]),
  createdAt: z.string().nullable(),
  questions: z.array(quizQuestionSchema).min(1).max(100),
});

export const persistedQuizStateSchema = z.object({
  version: z.literal(1),
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
          points: z.literal(10),
        }),
      )
      .length(questionCount),
  });
}
