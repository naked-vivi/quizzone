import questionsData from "./questions.json";
import type { QuizDefinition } from "../type";
import { quizImportPayloadSchema } from "../lib/quiz-schema";

const parsed = quizImportPayloadSchema.parse(questionsData);

export const builtInQuiz: QuizDefinition = {
  id: "react-fundamentals",
  title: "The React Quiz",
  description: "Test your React knowledge across 15 focused questions.",
  source: "built-in",
  createdAt: null,
  questions: parsed.questions.map((question, index) => ({
    ...question,
    id: `react-question-${index + 1}`,
    points: question.points ?? 10,
  })),
};
